import { Inputs, SetErrors } from 'app/types/form-types'

interface ValidationErrors {
  [key: string]: string
}
const validateDonationIdentity = (inputs: Inputs, setErrors: SetErrors): boolean => {
  const newErrors: ValidationErrors = {}
  if (!inputs?.email) {
    newErrors.email = 'Email Required'
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(inputs?.email)) {
    newErrors.email = 'Invalid email address'
  }

  if (!inputs?.firstName) {
    newErrors.firstName = 'First Name Required'
  } else if (inputs?.firstName.length > 50) {
    newErrors.firstName = 'Must be 50 characters or less'
  }

  if (!inputs?.lastName) {
    newErrors.lastName = 'Last Name Required'
  } else if (inputs?.lastName.length > 50) {
    newErrors.lastName = 'Must be 50 characters or less'
  }

  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}

export default validateDonationIdentity
