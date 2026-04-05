import { IPaymentMethod } from './entities/payment-method.types'

export type FormProps = {
  inputs: any
  errors: any
  handleInput: (e: any) => void
  handleSubmit: (e: any) => void
  onClose: () => void
  isUpdating: boolean
  isLoading: boolean
}

export type IPaymentForm = {
  savedCards: IPaymentMethod[]
  userName?: { firstName: string; lastName: string }
}
