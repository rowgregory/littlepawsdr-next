import React, { FormEvent, useState } from 'react'
import DonateInput from '../../forms/elements/DonateInput'
import { CardCvcElement, CardExpiryElement, CardNumberElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { elementOptions } from '@public/static-data/stripe-data'

const OneTimeStepThree = () => {
  const stripe = useStripe()
  const elements = useElements()
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [name, setName] = useState<string>('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      console.log('!stripe || !elements: ', !stripe || !elements)
      return
    }

    const cardNumberElement = elements.getElement(CardNumberElement)
    const cardExpiryElement = elements.getElement(CardExpiryElement)
    const cardCvcElement = elements.getElement(CardCvcElement)

    if (!cardNumberElement || !cardExpiryElement || !cardCvcElement) {
      console.log('Missing one or more card elements')
      return
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardNumberElement,
      billing_details: {
        name
      }
    })

    if (error) {
      return setErrorMessage(error.message || 'An unexpected error occurred.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-full">
      <DonateInput
        name="name"
        type="text"
        textKey="Name on Card"
        value={name}
        placeholder="Card Holder"
        handleInput={(e: any) => setName(e.target.value)}
        className=""
        errors={{}}
      />
      <div>
        <label className="text-sm mb-1">Card Number</label>
        <div className="stripe-element-container">
          <CardNumberElement options={elementOptions} />
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="w-full">
          <label className="text-sm mb-1">Expiration Date</label>
          <div className="stripe-element-container">
            <CardExpiryElement options={elementOptions} />
          </div>
        </div>
        <div className="w-full">
          <label className="text-sm mb-1">CVC</label>
          <div className="stripe-element-container">
            <CardCvcElement options={elementOptions} />
          </div>
        </div>
      </div>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <button
        type="submit"
        disabled={!stripe}
        className="bg-teal-400 text-white px-16 h-24 flex items-center justify-center font-QBold text-3xl mx-auto my-16 rounded-2xl hover:bg-teal-500 duration-200 focus:outline-none uppercase"
      >
        Complete Donation
      </button>
    </form>
  )
}

export default OneTimeStepThree
