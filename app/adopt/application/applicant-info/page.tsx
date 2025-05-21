'use client'

import React, { FormEvent, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useForm from '@hooks/useForm'
import { ADOTION_APPLICATION_APPLICANT_INFO_FIELDS } from '@public/static-data/form-fields'
import { useCheckIfUserHasActiveAdoptionFeeSessionMutation } from '@redux/services/adoptionApplicationFeeApi'
import AdoptionApplicationApplicantInfoForm from 'app/forms/AdoptionApplicationApplicantInfoForm'
import validateApplicantInfo from 'app/validations/validateApplicantInfo'
import { Inputs } from 'app/types/form-types'
import { loadFormData, setStep, updateFormData } from '@redux/features/adoptionApplicationFeeSlice'
import { useDispatch } from 'react-redux'
import { RootState, useAppSelector } from '@redux/store'

const ApplicantInfo = () => {
  const dispatch = useDispatch()
  const { push } = useRouter()
  const adoptionApplicationFee = useAppSelector((state: RootState) => state.adoptionApplicationFee)

  useEffect(() => {
    dispatch(loadFormData())
    dispatch(setStep({ step1: true, step2: true, step3: false, step4: false }))
  }, [dispatch])

  // const { inputs, errors, handleInput, handleSelect, setErrors } = useForm(
  //   ADOTION_APPLICATION_APPLICANT_INFO_FIELDS,
  //   adoptionApplicationFee.formData
  // );

  const [checkIfUserHasActiveAdoptionFeeSession, { isLoading }] = useCheckIfUserHasActiveAdoptionFeeSessionMutation()

  // const onSubmit = useCallback(
  //   async (e: FormEvent<HTMLFormElement>, inputs: Inputs) => {
  //     e.preventDefault();
  //     const isValid = validateApplicantInfo(inputs, setErrors);

  //     if (!isValid) return;
  //     dispatch(updateFormData({ inputs }));

  //     await checkIfUserHasActiveAdoptionFeeSession(inputs)
  //       .unwrap()
  //       .then(({ message, token }: { message: string; token: string }) => {
  //         switch (message) {
  //           case 'INCORRECT_BYPASS_CODE':
  //             return setErrors((prev: any) => ({
  //               ...prev,
  //               ...{ bypassCode: 'Incorrect code' },
  //             }));
  //           case 'SEND_TO_PAYMENT':
  //             return push(`/adopt/application/payment`);
  //           case 'SEND_TO_APPLICATION':
  //             return push(`/adopt/application/${token}`);
  //           default:
  //             return;
  //         }
  //       })
  //       .catch((err: any) => console.log('ERROR: ', err));
  //   },
  //   [checkIfUserHasActiveAdoptionFeeSession, dispatch, push, setErrors]
  // );

  return (
    <div className="max-w-xl mx-auto grid grid-cols-12 p-3 gap-4 w-full px-5 md:px-6 lg:px-8 pt-12">
      <div className="col-span-12">
        {/* <AdoptionApplicationApplicantInfoForm
          onSubmit={onSubmit}
          handleInput={handleInput}
          handleSelect={handleSelect}
          inputs={inputs}
          errors={errors}
          isLoading={isLoading}
        /> */}
      </div>
    </div>
  )
}

export default ApplicantInfo
