import React from "react"
import { useRouter } from "next/router"
import { Formik, Form } from "formik"
import { Box } from "@chakra-ui/layout"
import { Button } from "@chakra-ui/button"
import { useRegisterMutation } from "../generated/graphql"
import { InputField, Wrapper } from "../components"
import { createUrqlClient, toErrorMap } from "../utils"
import { withUrqlClient } from "next-urql"

interface RegisterProps {}

const Register: React.FC<RegisterProps> = ({}) => {
  const router = useRouter()
  const [, register] = useRegisterMutation()

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const res = await register(values)
          if (res.data.register?.errors) {
            setErrors(toErrorMap(res.data.register.errors))
          } else if (res.data?.register.user) {
            router.push("/")
          }
        }}
      >
        {({ values, handleChange, isSubmitting }) => (
          <Form>
            <InputField
              name="username"
              placeholder="username"
              label="Username"
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
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  )
}

export default withUrqlClient(createUrqlClient)(Register)
