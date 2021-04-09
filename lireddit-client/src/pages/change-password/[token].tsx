import React, { useState } from "react"
import { NextPage } from "next"
import { useRouter } from "next/router"
import { Form, Formik } from "formik"
import { Button } from "@chakra-ui/button"
import { InputField, Wrapper } from "../../components"
import { useChangePasswordMutation } from "../../generated/graphql"
import { createUrqlClient, toErrorMap } from "../../utils"
import { Box, Flex, Link } from "@chakra-ui/layout"
import { withUrqlClient } from "next-urql"
import NextLink from "next/link"

const ChangePassword: NextPage<{}> = () => {
  const router = useRouter()
  const [, changePassword] = useChangePasswordMutation()

  const [tokenError, setTokenError] = useState("")
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ newPassword: "" }}
        onSubmit={async (values, { setErrors }) => {
          const res = await changePassword({
            newPassword: values.newPassword,
            token:
              typeof router.query.token === "string" ? router.query.token : "",
          })
          if (res.data.changePassword?.errors) {
            const errorMap = toErrorMap(res.data.changePassword.errors)
            if ("token" in errorMap) {
              setTokenError(errorMap.token)
            }
            setErrors(errorMap)
          } else if (res.data?.changePassword.user) {
            router.push("/")
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="newPassword"
              placeholder="new password"
              label="New Password"
              type="password"
            />
            {tokenError ? (
              <Flex>
                <Box mr={2} color="red.400">
                  {tokenError}
                </Box>
                <NextLink href="/forgot-password">
                  <Link>Reset the password</Link>
                </NextLink>
              </Flex>
            ) : null}
            <Button
              type="submit"
              mt="4"
              colorScheme="teal"
              isLoading={isSubmitting}
            >
              Change Password
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  )
}

export default withUrqlClient(createUrqlClient)(ChangePassword)
