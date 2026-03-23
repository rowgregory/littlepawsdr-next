import { EMAIL_REGEX } from 'app/utils/regex'

export const validatePaymentForm = (inputs, setErrors, isAuthed) => {
  const errs: Record<string, string> = {}
  if (!inputs?.firstName?.trim()) errs.firstName = 'Required'
  if (!inputs?.lastName?.trim()) errs.lastName = 'Required'
  if (!isAuthed) {
    if (!inputs?.email?.trim()) errs.email = 'Required'
    else if (!EMAIL_REGEX.test(inputs.email)) errs.email = 'Invalid email'
  }
  setErrors(errs)
  return Object.keys(errs).length === 0
}
