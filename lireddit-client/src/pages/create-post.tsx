import React, { useEffect } from "react"
import { Button } from "@chakra-ui/button"
import { Box } from "@chakra-ui/layout"
import { Form, Formik } from "formik"
import { InputField, Layout, TextArea } from "../components"
import { useCreatePostMutation, useMeQuery } from "../generated/graphql"
import { useRouter } from "next/router"
import { withUrqlClient } from "next-urql"
import { createUrqlClient, useIsAuth } from "../utils"

interface CreatePostProps {}

const CreatePost: React.FC<CreatePostProps> = ({}) => {
  const router = useRouter()
  const [{ data, fetching }] = useMeQuery()
  const [, createPost] = useCreatePostMutation()
  useIsAuth()
  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: "", text: "" }}
        onSubmit={async (values, { setErrors }) => {
          const { error } = await createPost({ input: values })
          if (!error) {
            router.push("/")
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="title" placeholder="title" label="Title" />
            <Box mt={4}>
              <TextArea name="text" placeholder="text..." label="Body" />
            </Box>

            <Button
              type="submit"
              mt="4"
              colorScheme="teal"
              isLoading={isSubmitting}
            >
              Create Post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient)(CreatePost)
