import React, { Fragment, useState } from 'react'
import OneTimeDonationProgressTracker from './OneTimeDonationProgressTracker'
// import OneTimeStepOne from './OneTimeStepOne'
// import { ONE_TIME_DONATION_FIELDS } from '@public/static-data/form-fields'
// import { ONE_TIME_DONATION_INITIAL_STATE } from '@public/static-data/form-initial-states'
// import OneTimeStepTwo from './OneTimeStepTwo'
import OneTimeStepThree from './OneTimeStepThree'
// import { useAppDispatch } from '@redux/store'
// import createFormActions from '@redux/features/form/formActions'

const OneTimeDonation = ({ type }: { type: string }) => {
  const [step, setStep] = useState({ step1: true, step2: false, step3: false })
  // const [errors, setErrors] = useState<{}>({})
  // const dispatch = useAppDispatch()
  // const { setInputs, handleInput } = createFormActions('oneTimeDonationForm', dispatch)

  return (
    <Fragment>
      <OneTimeDonationProgressTracker step={step} setStep={setStep} type={type} />
      {/* {step.step1 && (
        <OneTimeStepOne
          setInputs={setInputs}
          inputs={inputs}
          handleInput={handleInput}
          setErrors={setErrors}
          setStep={setStep}
        />
      )}
      {step.step2 && (
        <OneTimeStepTwo
          inputs={inputs}
          handleInput={handleInput}
          errors={errors}
          setErrors={setErrors}
          setStep={setStep}
        />
      )} */}
      {step.step3 && <OneTimeStepThree />}
    </Fragment>
  )
}

export default OneTimeDonation
