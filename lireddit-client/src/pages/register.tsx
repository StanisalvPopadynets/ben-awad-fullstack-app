import React from 'react'
import { Formik, Form } from 'formik'
import { InputField, Wrapper } from '../components'
import { Box } from '@chakra-ui/layout'
import { Button } from '@chakra-ui/button'

interface RegisterProps {

}

const Register: React.FC<RegisterProps> = ({}) => {

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{username: '', password: ''}}
        onSubmit={(values) => {
          console.log(values)
        }}
      >
        {({values, handleChange, isSubmitting}) => (
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
            <Button type="submit" mt="4" colorScheme="teal" isLoading={isSubmitting}>Register</Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  )
}

export default Register