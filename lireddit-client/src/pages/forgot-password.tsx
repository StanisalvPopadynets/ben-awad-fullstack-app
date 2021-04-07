import React, { useState } from "react"
import { Button } from "@chakra-ui/button"
import { Box, Flex } from "@chakra-ui/layout"
import { Form, Formik } from "formik"
import { withUrqlClient } from "next-urql"
import { InputField, Wrapper } from "../components"
import { createUrqlClient } from "../utils"
import { useForgotPasswordMutation } from "../generated/graphql"

const ForgotPassword: React.FC<{}> = ({}) => {
  const [complete, setComplete] = useState(false)
  const [, forgotPassword] = useForgotPasswordMutation()

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: "" }}
        onSubmit={async (values, { setErrors }) => {
          const res = await forgotPassword(values)
          setComplete(true)
        }}
      >
        {({ isSubmitting }) =>
          complete ? (
            <Box>
              if an account with that email exists, reset password link will be
              sent
            </Box>
          ) : (
            <Form>
              <InputField
                name="email"
                placeholder="email"
                label="Email"
                type="email"
              />
              <Button
                type="submit"
                mt="4"
                colorScheme="teal"
                isLoading={isSubmitting}
              >
                Forgot Password
              </Button>
            </Form>
          )
        }
      </Formik>
    </Wrapper>
  )
}

export default withUrqlClient(createUrqlClient)(ForgotPassword)
