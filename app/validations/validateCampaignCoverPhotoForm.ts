import { Inputs, SetErrors } from 'app/types/form-types'

interface ValidationErrors {
  [key: string]: string
}

const validateCampaignCoverPhotoForm = (inputs: Inputs, setErrors: SetErrors): boolean => {
  const newErrors: ValidationErrors = {}

  if (!inputs?.coverPhoto?.trim()) {
    newErrors.coverPhoto = 'Cover photo is required'
  }

  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}

export default validateCampaignCoverPhotoForm
