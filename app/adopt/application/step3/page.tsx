'use client'

import React, { useEffect, useMemo, useCallback } from 'react'
import useStripePaymentForm from '@hooks/useStripePaymentForm'
import { useCreatePaymentMutation } from '@redux/services/adoptionApplicationFeeApi'
import AdoptFeePaymentForm from 'app/forms/AdoptFeePaymentForm'
import { RootState, useAppDispatch, useAppSelector } from '@redux/store'
import { createFormActions } from '@redux/features/formSlice'
import { useRouter } from 'next/navigation'
import { Confetti3D } from 'app/components/Confetti3D'

const Step3 = () => {
  const [createPayment] = useCreatePaymentMutation()
  const { adoptFeeForm } = useAppSelector((state: RootState) => state.form)
  const dispatch = useAppDispatch()
  const { push } = useRouter()

  // Memoize form actions to prevent handler recreation
  const formActions = useMemo(() => createFormActions('adoptFeeForm', dispatch), [dispatch])
  const { handleInput: rawHandleInput, handleToggle: rawHandleToggle } = formActions

  // Memoize handleInput and handleToggle callbacks
  const handleInput = useCallback(
    (args: { name: string; value: any }) => {
      rawHandleInput(args)
    },
    [rawHandleInput]
  )

  const handleToggle = useCallback(
    (args: { name: string; value: any }) => {
      rawHandleToggle(args)
    },
    [rawHandleToggle]
  )

  const { errorMessage, paymentMethod, isLoading, handleSubmit, handleCardInputChange, setIsLoading, showConfetti, setShowConfetti } =
    useStripePaymentForm(adoptFeeForm?.inputs)

  useEffect(() => {
    const savedForm = localStorage.getItem('adoptFeeForm')
    if (savedForm) {
      const parsedInputs = JSON.parse(savedForm)
      for (const [name, value] of Object.entries(parsedInputs)) {
        handleInput({ name, value })
      }
    }
  }, [handleInput]) // safe to include handleInput because it’s memoized

  useEffect(() => {
    if (!paymentMethod) return

    const payload = {
      paymentMethod,
      ...adoptFeeForm?.inputs
    }

    const createAsyncPayment = async () => {
      try {
        await createPayment(payload).unwrap()
        setShowConfetti(true)
        setTimeout(() => {
          document.cookie = 'adoptStep3Complete=true; path=/'
          push('/adopt/application/step4')
          setShowConfetti(false)
        }, 2250)
      } catch (error) {
        // Optionally handle errors here
      } finally {
        setIsLoading(false)
      }
    }

    createAsyncPayment()
  }, [paymentMethod, createPayment, adoptFeeForm?.inputs, push, setIsLoading, setShowConfetti])

  return (
    <div className="max-w-lg h-full">
      <h1 className="font-lg font-semibold mb-4">Payment</h1>
      <Confetti3D trigger={showConfetti} duration={3000} />
      <AdoptFeePaymentForm
        errorMessage={errorMessage}
        handleInput={handleInput}
        handleSubmit={handleSubmit}
        inputs={adoptFeeForm?.inputs}
        errors={adoptFeeForm?.errors}
        isLoading={isLoading}
        handleCardInputChange={handleCardInputChange}
        handleToggle={handleToggle}
      />
    </div>
  )
}

export default Step3
