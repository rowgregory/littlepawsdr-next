import { URL_REGEX } from 'app/utils/regex'

export const validateProductForm = (inputs: any, setErrors: (errors: any) => void): boolean => {
  const errors: Record<string, string> = {}

  if (!inputs?.name?.trim()) {
    errors.name = 'Name is required'
  }

  if (!inputs?.description?.trim()) {
    errors.description = 'Description is required'
  }

  if (inputs?.price == null || inputs.price < 0) {
    errors.price = 'A valid price is required'
  }

  if (inputs?.shippingPrice == null || inputs.shippingPrice < 0) {
    errors.shippingPrice = 'A valid shipping price is required'
  }

  if (inputs?.images[0] && !URL_REGEX.test(inputs.images[0].trim())) {
    errors.image = 'Image must be a valid URL'
  }

  setErrors(errors)
  return Object.keys(errors).length === 0
}
