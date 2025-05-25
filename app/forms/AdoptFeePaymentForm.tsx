'use client'

import React, { FC } from 'react'
import { CardCvcElement, CardExpiryElement, CardNumberElement } from '@stripe/react-stripe-js'
import AwesomeIcon from 'app/components/common/AwesomeIcon'
import { chevronLeftIcon, paperPlaneIcon } from 'app/icons'
import Link from 'next/link'
import Spinner from 'app/components/common/Spinner'
import AdoptFeeInput from './elements/AdoptFeeInput'
import AdoptFeeCheckbox from './elements/AdoptFeeCheckbox'
import { Errors, Inputs } from 'app/types/form-types'

interface AdoptFeePaymentForm {
  handleSubmit: any
  inputs: Inputs
  errors: Errors
  errorMessage: string
  handleInput: any
  isLoading: boolean
  handleCardInputChange: any
  handleToggle: any
}

const elementOptions = {
  style: {
    base: {
      color: '#1c1c1c',
      fontSize: '14px',
      '::placeholder': {
        color: '#a0a0a0'
      }
    },
    invalid: {
      color: '#e00'
    }
  }
}

const AdoptFeePaymentForm: FC<AdoptFeePaymentForm> = ({
  handleSubmit,
  inputs,
  errors,
  errorMessage,
  handleInput,
  isLoading,
  handleCardInputChange,
  handleToggle
}) => {
  return (
    <form onSubmit={handleSubmit} className="w-full h-full flex flex-col justify-between">
      <div className="space-y-5">
        <AdoptFeeInput
          label="Name on Card"
          name="name"
          value={inputs?.name}
          onChange={handleInput}
          placeholder="Card Holder"
          inputClassName="user-input border-1 w-full border-zinc-200 py-1.5 px-4 focus:outline-none text-sm"
        />
        <div>
          <label className="text-sm mb-1">Card Number</label>
          <div className="stripe-element-container">
            <CardNumberElement options={elementOptions} onChange={handleCardInputChange} />
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="w-full">
            <label className="text-sm mb-1">Expiration Date</label>
            <div className="stripe-element-container">
              <CardExpiryElement options={elementOptions} onChange={handleCardInputChange} />
            </div>
          </div>
          <div className="w-full">
            <label className="text-sm mb-1">CVC</label>
            <div className="stripe-element-container">
              <CardCvcElement options={elementOptions} onChange={handleCardInputChange} />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-12">
        <div className="mb-16">
          <AdoptFeeCheckbox
            name="hasSavedPaymentMethod"
            value={inputs?.hasSavedPaymentMethod}
            handleToggle={handleToggle}
            label={`I agree to create an account with Little Paws Dachshund Rescue, which will securely store my payment method for future donations or purchases. I understand that I’ll receive an email to set up my login and can manage or delete my account at any time. View our Privacy Policy.`}
            error={errors?.hasSavedPaymentMethod}
          />
        </div>
        {errorMessage && <p className="text-red-500 font-medium text-13 mb-2">{errorMessage}</p>}
        <div className="flex gap-x-4">
          <Link
            href="/adopt/application/step2"
            className="flex items-center justify-center text-center py-1.5 px-4 text-black shadow-lg rounded-full active:shadow-sm group hover:tracking-wider w-[100px] active:translate-y-1 duration-200 text-15 h-[34.5px]"
          >
            <AwesomeIcon icon={chevronLeftIcon} className="text-black w-4 h-4 group-hover:-translate-x-1 duration-300" /> Back
          </Link>
          <button
            type="submit"
            className="flex items-center justify-center gap-x-1 text-center py-1.5 px-4 bg-black text-white shadow-xl rounded-full active:shadow-sm group w-[100px] active:translate-y-1 overflow-hidden duration-200 text-15 h-[34.5px]"
          >
            {isLoading ? (
              <Spinner fill="fill-white" wAndH="w-3 h-3" track="text-black" />
            ) : (
              <>
                Submit
                <AwesomeIcon icon={paperPlaneIcon} className="text-white w-3 h-3 group-hover:animate-takeoff duration-[1250ms]" />
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  )
}

export default AdoptFeePaymentForm
