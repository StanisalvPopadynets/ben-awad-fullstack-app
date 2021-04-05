import { Box, Flex, Link } from "@chakra-ui/layout"
import React from "react"
import NextLink from "next/link"
import { useLogoutMutation, useMeQuery } from "../generated/graphql"
import { Button } from "@chakra-ui/button"

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ data, fetching }] = useMeQuery()
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation()

  let body = null

  if (fetching) {
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link mr={4}>Login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link mr={4}>Register</Link>
        </NextLink>
      </>
    )
  } else {
    body = (
      <Flex>
        <Box mr={2}>{data.me.username}</Box>
        <Button
          isLoading={logoutFetching}
          onClick={() => logout()}
          color="gray.800"
          variant="link"
        >
          Logout
        </Button>
      </Flex>
    )
  }
  return (
    <Flex bg="#eceff1">
      <Box p={4} ml={"auto"}>
        {body}
      </Box>
    </Flex>
  )
}
