import React from "react"
import { useRouter } from "next/router"
import { Formik, Form } from "formik"
import { withUrqlClient } from "next-urql"
import { Box } from "@chakra-ui/layout"
import { Button } from "@chakra-ui/button"
import { useLoginMutation } from "../generated/graphql"
import { InputField, Wrapper } from "../components"
import { createUrqlClient, toErrorMap } from "../utils"

interface LoginProps {}

const Login: React.FC<LoginProps> = ({}) => {
  const router = useRouter()
  const [, login] = useLoginMutation()

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ usernameOrEmail: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const res = await login(values)
          if (res.data.login?.errors) {
            setErrors(toErrorMap(res.data.login.errors))
          } else if (res.data?.login.user) {
            router.push("/")
          }
        }}
      >
        {({ values, handleChange, isSubmitting }) => (
          <Form>
            <InputField
              name="usernameOrEmail"
              placeholder="username or email"
              label="Username or Email"
            />
            <Box mt="4">
              <InputField
                name="password"
                placeholder="password"
                label="Password"
                type="password"
              />
            </Box>
            <Button
              type="submit"
              mt="4"
              colorScheme="teal"
              isLoading={isSubmitting}
            >
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  )
}

export default withUrqlClient(createUrqlClient)(Login)
