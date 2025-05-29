import { useState, FormEvent, useEffect } from 'react'
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js'

const useStripePaymentForm = (inputs: any, createCheckout: any, push: any) => {
  const stripe = useStripe()
  const elements = useElements()
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Remove aria-hidden from Stripe elements to fix accessibility warning
  useEffect(() => {
    if (!elements) return

    // Use MutationObserver to watch for aria-hidden being added
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'aria-hidden') {
          const target = mutation.target as HTMLElement
          if (target.classList.contains('__PrivateStripeElement-input') || target.tagName === 'INPUT') {
            target.removeAttribute('aria-hidden')
          }
        }
      })
    })

    // Also remove any existing aria-hidden attributes
    const removeAriaHidden = () => {
      const stripeInputs = document.querySelectorAll('.__PrivateStripeElement-input, input[aria-hidden]')
      stripeInputs.forEach((input) => {
        input.removeAttribute('aria-hidden')
      })
    }

    // Initial cleanup
    setTimeout(removeAriaHidden, 100)
    setTimeout(removeAriaHidden, 500) // Try again after a longer delay

    // Start observing for future changes
    observer.observe(document.body, {
      attributes: true,
      subtree: true,
      attributeFilter: ['aria-hidden']
    })

    return () => {
      observer.disconnect()
    }
  }, [elements])

  const handleCardInputChange = (event: any) => {
    // event is from Stripe, check for errors here
    if (event.error) {
      setErrorMessage(event.error.message)
    } else {
      setErrorMessage('')
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) {
      console.log('Stripe or Elements not loaded.')
      return
    }

    if (!inputs?.name) {
      return setErrorMessage('Card holder name required')
    }

    const cardNumberElement = elements.getElement(CardNumberElement)
    const cardExpiryElement = elements.getElement(CardExpiryElement)
    const cardCvcElement = elements.getElement(CardCvcElement)

    if (!cardNumberElement || !cardExpiryElement || !cardCvcElement) {
      console.log('Missing card elements.')
      return
    }

    setIsLoading(true)

    try {
      // Step 1: Create payment method
      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardNumberElement,
        billing_details: { name: inputs.name }
      })

      if (pmError || !paymentMethod) {
        return setErrorMessage(pmError?.message || 'Failed to create payment method.')
      }

      // Step 2: Send to backend to create PaymentIntent
      const payload = {
        paymentMethodId: paymentMethod.id,
        ...inputs,
        name: inputs.name,
        hasSavedPaymentMethod: inputs.hasSavedPaymentMethod,
        email: inputs.email,
        adoptFee: {
          firstName: inputs.firstName,
          lastName: inputs.lastName,
          email: inputs.email,
          state: inputs.state,
          bypassCode: inputs.bypassCode
        }
      }

      await createCheckout(payload).unwrap()
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong.')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    errorMessage,
    isLoading,
    handleSubmit,
    handleCardInputChange
  }
}

export default useStripePaymentForm
