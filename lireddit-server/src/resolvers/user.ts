import { User } from "../entities"
import { MyContext } from "src/types"
import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql"
import argon2 from "argon2"
import { EntityManager } from "@mikro-orm/postgresql"
import { COOKIE_NAME } from "../constants"
import { UsernamePasswordInput } from "./UsernamePasswordInput"
import { validateRegister } from "../utils"

@ObjectType()
class FieldError {
  @Field()
  field: string
  @Field()
  message: string
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[]

  @Field(() => User, { nullable: true })
  user?: User
}

@Resolver()
export class UserResolver {
  // @Mutation(() => Boolean)
  // async forgotPassword(@Arg("email") email: string, @Ctx() ctx: MyContext) {
  //   // const person = await ctx.em.findOne(User, { email })
  //   return true
  // }
  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: MyContext) {
    // you are not logged in
    if (!ctx.req.session.userId) {
      return null
    }

    const user = await ctx.em.findOne(User, { id: ctx.req.session.userId })
    return user
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    // @Arg("username", () => String) username: string,
    // @Arg("password", () => String) password: string,
    @Ctx() ctx: MyContext
  ): Promise<UserResponse> {
    const errors = validateRegister(options)
    if (errors) {
      return { errors }
    }

    const hashedPassword = await argon2.hash(options.password)
    // const user = ctx.em.create(User, {
    //   username: options.username,
    //   password: hashedPassword,
    // })
    let user
    try {
      const result = await (ctx.em as EntityManager)
        .createQueryBuilder(User)
        .getKnexQuery()
        .insert({
          username: options.username,
          password: hashedPassword,
          email: options.email,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning("*")
      // await ctx.em.persistAndFlush(user)
      user = result[0]
    } catch (error) {
      if (error.detail.includes("already exists")) {
        // duplicate  username error
        return {
          errors: [
            {
              field: "username",
              message: "Username has already been taken",
            },
          ],
        }
      }
    }
    ctx.req.session.userId = user.id
    return {
      user,
    }
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string,
    // @Arg("username", () => String) username: string,
    // @Arg("password", () => String) password: string,
    @Ctx() ctx: MyContext
  ): Promise<UserResponse> {
    const user = await ctx.em.findOne(
      User,
      usernameOrEmail.includes("@")
        ? { email: usernameOrEmail }
        : { username: usernameOrEmail }
    )
    if (!user) {
      return {
        errors: [
          {
            field: "usernameOrEmail",
            message: "That username doesn't exist",
          },
        ],
      }
    }
    const isValid = await argon2.verify(user.password, password)
    if (!isValid) {
      return {
        errors: [
          {
            field: "password",
            message: "Incorrect password",
          },
        ],
      }
    }

    ctx.req.session.userId = user.id
    return {
      user,
    }
  }

  @Mutation(() => Boolean)
  logout(@Ctx() ctx: MyContext) {
    return new Promise((res) =>
      ctx.req.session.destroy((err) => {
        ctx.res.clearCookie(COOKIE_NAME)
        if (err) {
          console.log(err)
          res(false)
          return
        }
        res(true)
      })
    )
  }
}
