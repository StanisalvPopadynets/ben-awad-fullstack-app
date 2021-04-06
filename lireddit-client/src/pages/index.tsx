import React from "react"
import { withUrqlClient } from "next-urql"
import { NavBar } from "../components/NavBar"
import { createUrqlClient } from "../utils"
import { usePostsQuery } from "../generated/graphql"

const Index = () => {
  const [{ data }] = usePostsQuery()
  return (
    <React.Fragment>
      <NavBar />
      <div>Hello NextJS</div>
      {!data ? (
        <div>loading...</div>
      ) : (
        data.posts.map((p) => <div key={p.createdAt}>{p.title}</div>)
      )}
    </React.Fragment>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index)
