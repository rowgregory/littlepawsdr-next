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
