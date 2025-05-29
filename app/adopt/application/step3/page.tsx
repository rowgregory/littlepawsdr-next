'use client'

import React, { useEffect, useMemo, useCallback, ChangeEvent } from 'react'
import AdoptFeePaymentForm from 'app/forms/AdoptFeePaymentForm'
import { RootState, useAppDispatch, useAppSelector } from '@redux/store'
import createFormActions from '@redux/features/form/formActions'
import { useRouter } from 'next/navigation'
import { useCreateCheckoutMutation } from '@redux/services/stripeApi'
import useStripePaymentForm from '@hooks/useStripePaymentForm'

const Step3 = () => {
  const [createCheckout] = useCreateCheckoutMutation()
  const { adoptFeeForm } = useAppSelector((state: RootState) => state.form)
  const dispatch = useAppDispatch()
  const { push } = useRouter()

  // Memoize form actions with dispatch and formName as dependencies
  const { handleToggle, handleInput } = useMemo(() => createFormActions('adoptFeeForm', dispatch), [dispatch])

  // Memoize handleInput to receive event and dispatch the action properly
  const handleToggleCb = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      handleToggle(e)
    },
    [handleToggle]
  )

  // Custom hook for Stripe payment form
  const { errorMessage, isLoading, handleSubmit, handleCardInputChange } = useStripePaymentForm(adoptFeeForm?.inputs, createCheckout, push)

  // Load saved form inputs from localStorage on mount
  useEffect(() => {
    const savedForm = localStorage.getItem('adoptFeeForm')
    if (savedForm) {
      const parsedInputs = JSON.parse(savedForm)
      // Because handleInput expects a ChangeEvent, create a mock event here
      for (const [name, value] of Object.entries(parsedInputs)) {
        handleInput({ target: { name, value } } as ChangeEvent<HTMLInputElement>)
      }
    }
  }, [handleInput])

  return (
    <div className="max-w-lg h-full">
      <h1 className="font-lg font-semibold mb-4">Payment</h1>
      <AdoptFeePaymentForm
        errorMessage={errorMessage}
        handleInput={handleInput}
        handleSubmit={handleSubmit}
        inputs={adoptFeeForm?.inputs}
        errors={adoptFeeForm?.errors}
        isLoading={isLoading}
        handleCardInputChange={handleCardInputChange}
        handleToggle={handleToggleCb}
      />
    </div>
  )
}

export default Step3
