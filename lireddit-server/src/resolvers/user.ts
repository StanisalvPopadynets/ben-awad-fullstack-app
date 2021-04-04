import { User } from "../entities"
import { MyContext } from "src/types"
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql"
import argon2 from "argon2"
import { EntityManager } from "@mikro-orm/postgresql"

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string
  @Field()
  password: string
}

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
    if (!(options.username.length > 2)) {
      return {
        errors: [
          {
            field: "username",
            message: "Username length must be greated than two",
          },
        ],
      }
    }

    if (!(options.password.length >= 6)) {
      return {
        errors: [
          {
            field: "password",
            message: "Password length must be greated than or equal to six",
          },
        ],
      }
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
    @Arg("options") options: UsernamePasswordInput,
    // @Arg("username", () => String) username: string,
    // @Arg("password", () => String) password: string,
    @Ctx() ctx: MyContext
  ): Promise<UserResponse> {
    const user = await ctx.em.findOne(User, { username: options.username })
    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: "That username doesn't exist",
          },
        ],
      }
    }
    const isValid = await argon2.verify(user.password, options.password)
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
}
