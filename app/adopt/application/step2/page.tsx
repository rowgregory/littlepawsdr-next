'use client'

import React, { useEffect, useState, useMemo, ChangeEvent } from 'react'
import { useValidateBypassCodeMutation } from '@redux/services/adoptFeeApi'
import validateApplicantInfo from 'app/validations/validateApplicantInfo'
import { useDispatch } from 'react-redux'
import { RootState, useAppSelector } from '@redux/store'
import createFormActions from '@redux/features/form/formActions'
import AdoptFeeApplicantInfoForm from 'app/forms/AdoptFeeApplicantInfoForm'
import { useRouter } from 'next/navigation'
import { setShowConfetti } from '@redux/features/stripeSlice'

const Step2 = () => {
  const dispatch = useDispatch()
  const { push } = useRouter()
  const [validateBypassCode] = useValidateBypassCodeMutation()
  const [isLoading, setIsLoading] = useState(false)
  const { adoptFeeForm } = useAppSelector((state: RootState) => state.form)
  const { setErrors, handleInput } = useMemo(() => createFormActions('adoptFeeForm', dispatch), [dispatch])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const isValid = validateApplicantInfo(adoptFeeForm?.inputs, setErrors)
    if (!isValid) {
      setIsLoading(false)
      return
    }

    localStorage.setItem('adoptFeeForm', JSON.stringify(adoptFeeForm?.inputs))

    try {
      if (adoptFeeForm?.inputs?.bypassCode) {
        const response = await validateBypassCode({
          email: adoptFeeForm?.inputs?.email,
          bypassCode: adoptFeeForm?.inputs?.bypassCode
        }).unwrap()

        if (response.message === 'INVALID_BYPASS_CODE') {
          setErrors({ bypassCode: 'Invalid bypass code' })
          return
        }

        if (response.message === 'SEND_TO_APPLICATION') {
          dispatch(setShowConfetti())
          push('/adopt/application/step4')
          document.cookie = 'adoptStep2Complete=true; path=/'
          document.cookie = 'usedBypassCode=true; path=/'

          return
        }
      } else {
        document.cookie = 'adoptStep2Complete=true; path=/'
        push('/adopt/application/step3')
      }
    } catch {
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-lg h-full">
      <h1 className="font-lg font-semibold mb-4">Applicant Info</h1>
      <AdoptFeeApplicantInfoForm
        handleSubmit={handleSubmit}
        handleInput={handleInput}
        inputs={adoptFeeForm?.inputs}
        errors={adoptFeeForm?.errors}
        isLoading={isLoading}
      />
    </div>
  )
}

export default Step2
