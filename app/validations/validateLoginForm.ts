import { Inputs, SetErrors } from '../types/form-types'

interface ValidationErrors {
  [key: string]: string
}

const validateLoginForm = (inputs: Inputs, setErrors: SetErrors): boolean => {
  const newErrors: ValidationErrors = {}

  // Validate email
  if (!inputs?.email?.trim()) {
    newErrors.email = 'Email is required'
  } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(inputs.email)) {
    newErrors.email = 'Invalid email format'
  }

  // Validate password
  if (!inputs?.password?.trim()) {
    newErrors.password = 'Password is required'
  }

  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}

export default validateLoginForm
