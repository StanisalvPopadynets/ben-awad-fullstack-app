import React from "react"
import { withUrqlClient } from "next-urql"
import { Layout, NavBar } from "../components"
import { createUrqlClient } from "../utils"
import { usePostsQuery } from "../generated/graphql"
import { Link } from "@chakra-ui/layout"
import NextLink from "next/link"

const Index = () => {
  const [{ data }] = usePostsQuery()
  return (
    <Layout>
      <NextLink href="/create-post">
        <Link>create post</Link>
      </NextLink>
      <div>Hello NextJS</div>
      {!data ? (
        <div>loading...</div>
      ) : (
        data.posts.map((p) => <div key={p.createdAt}>{p.title}</div>)
      )}
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index)
