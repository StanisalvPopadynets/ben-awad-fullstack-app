import React, { TextareaHTMLAttributes } from "react"
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/form-control"
import { useField } from "formik"
import { Textarea } from "@chakra-ui/textarea"

type InputFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string
  name: string
}

export const TextArea: React.FC<InputFieldProps> = ({ label, ...props }) => {
  const [field, { error }] = useField(props)
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <Textarea {...field} {...props} id={field.name} />
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  )
}
