import React, { InputHTMLAttributes } from 'react'
import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/form-control'
import { useField } from 'formik'
import { Input } from '@chakra-ui/input'

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & { name: string, label: string }

export const InputField: React.FC<InputFieldProps> = ({label, size, ...props}) => {
  const [field, {error}] = useField(props)  
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <Input {...props} {...field} id={field.name}  placeholder={props.placeholder }/>
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
}