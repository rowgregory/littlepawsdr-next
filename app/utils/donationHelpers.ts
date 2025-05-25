import validateDonationIdentity from "app/validations/validateDonationIdentity";

const handleStepOne = (e: any, inputs: any, setErrors: any, setStep: any) => {
  e.preventDefault();

  if (
    inputs.donationAmount === 0 &&
    (+inputs.otherAmount <= 0.99 || inputs.otherAmount === undefined)
  ) {
    setErrors((prev: any) => ({
      ...prev,
      donationAmount: "Amount needs to be greater than or equal to 1",
    }));
  } else {
    setErrors({});
    setStep((prev: any) => ({ ...prev, step1: false, step2: true }));
  }
};

const handleStepTwo = (e: any, inputs: any, setErrors: any, setStep: any) => {
  e.preventDefault();
  const isValid = validateDonationIdentity(inputs, setErrors);
  if (!isValid) return;

  setStep((prev: any) => ({ ...prev, step2: false, step3: true }));
};

export { handleStepOne, handleStepTwo };
