import { IPaymentMethod } from './entities/payment-method.types'

export interface CheckoutFormInputs {
  // identity
  firstName?: string
  lastName?: string
  email?: string

  // shipping
  useSavedAddress?: boolean
  addressLine1?: string
  addressLine2?: string
  city?: string
  state?: string
  zipPostalCode?: string

  // payment
  selectedCardId?: string | null
  useNewCard?: boolean
  saveCard?: boolean
  coverFees?: boolean
  cardComplete?: boolean

  // submission lifecycle
  loading?: boolean
  error?: string | null
  processingStatus?: string
}

export interface IStep4Payment {
  inputs: CheckoutFormInputs | undefined
  setForm: (data: Partial<CheckoutFormInputs>) => void
  onBack: () => void
  onSubmit: (e: { preventDefault: () => void }) => void | Promise<void>
  savedCards: IPaymentMethod[]
  processingFee: number
  finalAmount: number
}
