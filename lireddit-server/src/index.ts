import { MikroORM } from "@mikro-orm/core"
import { __prod__ } from "./constants"
// import { Post } from "./entities/Post"
import mikroConfig from "./mikro-orm.config"
import express from "express"
import redis from 'redis'
import session from 'express-session'
import connectRedis from 'connect-redis'
import { ApolloServer } from "apollo-server-express"
import { buildSchema } from "type-graphql"

import { HelloResolver, PostResolver, UserResolver } from "./resolvers"

const main = async () => {
  const orm = await MikroORM.init(mikroConfig)
  
  await orm.getMigrator().up()
  
  const app = express()

  const RedisStore = connectRedis(session)
  const redisClient = redis.createClient()
  
  app.use(
    session({
      name: "qid",
      store: new RedisStore({ client: redisClient, disableTouch: true, }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365, // one year
        httpOnly: true,
        sameSite: 'lax',
        secure: __prod__ // only works in https
      },
      saveUninitialized: false,
      secret: 'zzxczxczxczxcz',
      resave: false,
    })
  )

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false
    }),
    context: ({ req, res }) => ({ em: orm.em, req, res })
  })

  apolloServer.applyMiddleware({ app })

  // const post = orm.em.create(Post, {title: "first one"})
  // await orm.em.persistAndFlush(post)

  // const posts = await orm.em.find(Post, {})
  // console.log(posts)

  app.listen(4000, () => console.log("Listening on port 4000"))
}

main().catch(err => {
  console.error(err)
})
