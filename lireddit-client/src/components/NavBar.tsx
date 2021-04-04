import { Box, Flex, Link } from "@chakra-ui/layout"
import React from "react"
import NextLink from "next/link"

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  return (
    <Flex bg="#eceff1">
      <Box p={4} ml={"auto"}>
        <NextLink href="/login">
          <Link mr={4}>Login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link mr={4}>Register</Link>
        </NextLink>
      </Box>
    </Flex>
  )
}
