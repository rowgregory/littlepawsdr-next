import { useState, FormEvent, useEffect } from "react";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { PaymentMethod } from "@stripe/stripe-js";

const useStripePaymentForm = (inputs: any) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false); // Add confetti state

  // Remove aria-hidden from Stripe elements to fix accessibility warning
  useEffect(() => {
    if (!elements) return;

    // Use MutationObserver to watch for aria-hidden being added
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "aria-hidden"
        ) {
          const target = mutation.target as HTMLElement;
          if (
            target.classList.contains("__PrivateStripeElement-input") ||
            target.tagName === "INPUT"
          ) {
            target.removeAttribute("aria-hidden");
          }
        }
      });
    });

    // Also remove any existing aria-hidden attributes
    const removeAriaHidden = () => {
      const stripeInputs = document.querySelectorAll(
        ".__PrivateStripeElement-input, input[aria-hidden]"
      );
      stripeInputs.forEach((input) => {
        input.removeAttribute("aria-hidden");
      });
    };

    // Initial cleanup
    setTimeout(removeAriaHidden, 100);
    setTimeout(removeAriaHidden, 500); // Try again after a longer delay

    // Start observing for future changes
    observer.observe(document.body, {
      attributes: true,
      subtree: true,
      attributeFilter: ["aria-hidden"],
    });

    return () => {
      observer.disconnect();
    };
  }, [elements]);

  const handleCardInputChange = (event: any) => {
    // event is from Stripe, check for errors here
    if (event.error) {
      setErrorMessage(event.error.message);
    } else {
      setErrorMessage("");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      console.log("Stripe or Elements not loaded.");
      return;
    }

    if (!inputs?.name) {
      return setErrorMessage("Card holder name required");
    }

    const cardNumberElement = elements.getElement(CardNumberElement);
    const cardExpiryElement = elements.getElement(CardExpiryElement);
    const cardCvcElement = elements.getElement(CardCvcElement);

    if (!cardNumberElement || !cardExpiryElement || !cardCvcElement) {
      console.log("Missing card elements.");
      return;
    }

    setIsLoading(true);

    const { error, paymentMethod: method } = await stripe.createPaymentMethod({
      type: "card",
      card: cardNumberElement,
      billing_details: { name: inputs.name },
    });

    if (error) {
      setErrorMessage(error.message || "An error occurred.");
      setIsLoading(false);
    } else {
      setPaymentMethod(method);
      setErrorMessage("");
    }
  };

  return {
    errorMessage,
    paymentMethod,
    isLoading,
    showConfetti,
    handleSubmit,
    handleCardInputChange,
    setIsLoading,
    setShowConfetti,
  };
};

export default useStripePaymentForm;
