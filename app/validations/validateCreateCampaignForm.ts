import { Inputs, SetErrors } from 'app/types/form-types'

interface ValidationErrors {
  [key: string]: string
}
const validateCreateCampaignForm = (inputs: Inputs, setErrors: SetErrors): boolean => {
  const newErrors: ValidationErrors = {}

  if (!inputs?.title?.trim()) {
    newErrors.title = 'Title is required'
  }

  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}

export default validateCreateCampaignForm
