'use client';

import React, { useEffect } from 'react';
import useStripePaymentForm from '@hooks/useStripePaymentForm';
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
} from '@stripe/react-stripe-js';
// import { useRouter } from 'next/navigation';
import DonateInput from 'app/forms/elements/DonateInput';
import { RootState, useAppDispatch, useAppSelector } from '@redux/store';
import {
  loadFormData,
  setStep,
} from '@redux/features/adoptionApplicationFeeSlice';
import { useCreateAdoptionApplicationFeePaymentMutation } from '@redux/services/adoptionApplicationFeeApi';

const Payment = () => {
  const dispatch = useAppDispatch();
  // const { push } = useRouter();
  const { name, errorMessage, paymentMethod, handleInputChange, handleSubmit } =
    useStripePaymentForm();

  const adoptionApplicationFee = useAppSelector(
    (state: RootState) => state.adoptionApplicationFee
  );

  const [createPayment] = useCreateAdoptionApplicationFeePaymentMutation();

  useEffect(() => {
    if (paymentMethod) {
      console.log('PAYMENT METHOD: ', paymentMethod);
      // createPayment({ paymentMethod, name, ...adoptionApplicationFee.formData })
      //   .unwrap()
      //   .then((data: any) => console.log('data: ', data))
      //   .catch((err: any) => console.log('ERROR: ', err));
    }
  }, [paymentMethod, adoptionApplicationFee.formData, createPayment, name]);

  useEffect(() => {
    dispatch(loadFormData());
    dispatch(setStep({ step1: true, step2: true, step3: true, step4: false }));
  }, [dispatch]);

  return (
    <div className="max-w-xl mx-auto grid grid-cols-12 p-3 gap-4 w-full px-5 md:px-6 lg:px-8 pt-12">
      <form
        onSubmit={handleSubmit}
        className="col-span-12 flex flex-col gap-8 w-full"
      >
        <DonateInput
          name="name"
          type="text"
          textKey="Name on Card"
          value={name}
          placeholder="Card Holder"
          handleInput={handleInputChange}
          className=""
          errors={{}}
        />
        <div>
          <label className="text-sm mb-1">Card Number</label>
          <div className="stripe-element-container">
            <CardNumberElement />
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="w-full">
            <label className="text-sm mb-1">Expiration Date</label>
            <div className="stripe-element-container">
              <CardExpiryElement />
            </div>
          </div>
          <div className="w-full">
            <label className="text-sm mb-1">CVC</label>
            <div className="stripe-element-container">
              <CardCvcElement />
            </div>
          </div>
        </div>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        <button
          type="submit"
          className="mt-12 w-full py-2 font-QBold lg:rounded-2xl duration-200 bg-teal-400 text-white hover:shadow-lg"
        >
          Submit Payment
        </button>
      </form>
    </div>
  );
};

export default Payment;
