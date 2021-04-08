import "reflect-metadata"
import express from "express"
// import { MikroORM } from "@mikro-orm/core"
import { createConnection } from "typeorm"
import cors from "cors"
// import redis from "redis"
import Redis from "ioredis"
import session from "express-session"
import connectRedis from "connect-redis"
import { ApolloServer } from "apollo-server-express"
import { buildSchema } from "type-graphql"
import { COOKIE_NAME, __prod__ } from "./constants"
// import mikroConfig from "./mikro-orm.config"

import { HelloResolver, PostResolver, UserResolver } from "./resolvers"
import { Post, User } from "./entities"

const main = async () => {
  const conn = createConnection({
    type: "postgres",
    database: "lireddit2",
    username: "postgres",
    password: "postgres",
    logging: true,
    synchronize: true,
    entities: [Post, User],
  })

  // const orm = await MikroORM.init(mikroConfig)
  // await orm.getMigrator().up()

  const app = express()

  const RedisStore = connectRedis(session)
  // const redisClient = redis.createClient()
  const redis = new Redis()
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  )

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({ client: redis, disableTouch: true }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365, // one year
        httpOnly: true,
        sameSite: "lax",
        secure: __prod__, // only works in https
      },
      saveUninitialized: false,
      secret: "zzxczxczxczxcz",
      resave: false,
    })
  )

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({ req, res, redis }),
  })

  apolloServer.applyMiddleware({
    app,
    cors: false,
  })

  // const post = orm.em.create(Post, {title: "first one"})
  // await orm.em.persistAndFlush(post)

  // const posts = await orm.em.find(Post, {})
  // console.log(posts)

  app.listen(4000, () => console.log("Listening on port 4000"))
}

main().catch((err) => {
  console.error(err)
})
