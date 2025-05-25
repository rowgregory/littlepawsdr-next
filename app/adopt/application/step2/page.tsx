'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useValidateBypassCodeMutation } from '@redux/services/adoptionApplicationFeeApi'
import validateApplicantInfo from 'app/validations/validateApplicantInfo'
import { useDispatch } from 'react-redux'
import { RootState, useAppSelector } from '@redux/store'
import { createFormActions } from '@redux/features/formSlice'
import AdoptFeeApplicantInfoForm from 'app/forms/AdoptFeeApplicantInfoForm'
import { useRouter } from 'next/navigation'
import { Confetti3D } from 'app/components/Confetti3D'

const Step2 = () => {
  const dispatch = useDispatch()
  const { push } = useRouter()
  const [validateBypassCode, { isLoading }] = useValidateBypassCodeMutation()

  // Memoize createFormActions once per dispatch so handlers don’t change
  const formActions = React.useMemo(() => createFormActions('adoptFeeForm', dispatch), [dispatch])
  const { setErrors, handleInput: rawHandleInput } = formActions

  // Memoize handleInput callback to keep stable reference for useEffect deps
  const handleInput = useCallback(
    (args: { name: string; value: any }) => {
      rawHandleInput(args)
    },
    [rawHandleInput]
  )

  const { adoptFeeForm } = useAppSelector((state: RootState) => state.form)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    const savedForm = localStorage.getItem('adoptFeeForm')
    if (savedForm) {
      const parsedInputs = JSON.parse(savedForm)
      for (const [name, value] of Object.entries(parsedInputs)) {
        handleInput({ name, value })
      }
    }
  }, [handleInput]) // safe to include handleInput because it’s memoized

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const isValid = validateApplicantInfo(adoptFeeForm?.inputs, setErrors)
    if (!isValid) return

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
          setShowConfetti(true)
          setTimeout(() => {
            document.cookie = 'adoptStep2Complete=true; path=/'
            document.cookie = 'usedBypassCode=true; path=/'
            push('/adopt/application/step4')
            setShowConfetti(false)
          }, 2000)
          return
        }
      } else {
        document.cookie = 'adoptStep2Complete=true; path=/'
        push('/adopt/application/step3')
      }
    } catch (error) {
      // Handle error if needed
    }
  }

  return (
    <div className="max-w-lg h-full">
      <Confetti3D trigger={showConfetti} duration={3000} />
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
