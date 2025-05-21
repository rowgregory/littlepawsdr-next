import { useState, FormEvent } from "react";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { PaymentMethod } from "@stripe/stripe-js";

const useStripePaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(
    null
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      console.log("Stripe or Elements not loaded.");
      return;
    }

    const cardNumberElement = elements.getElement(CardNumberElement);
    const cardExpiryElement = elements.getElement(CardExpiryElement);
    const cardCvcElement = elements.getElement(CardCvcElement);

    if (!cardNumberElement || !cardExpiryElement || !cardCvcElement) {
      console.log("Missing card elements.");
      return;
    }

    const { error, paymentMethod: method } = await stripe.createPaymentMethod({
      type: "card",
      card: cardNumberElement,
      billing_details: { name },
    });

    if (error) {
      setErrorMessage(error.message || "An error occurred.");
    } else {
      setPaymentMethod(method);
      setErrorMessage("");
    }
  };

  return {
    name,
    errorMessage,
    paymentMethod,
    handleInputChange,
    handleSubmit,
  };
};

export default useStripePaymentForm;
