export type ShopToHelpCardProps = {
  obj: { img: string; textKey: string; linkKey: string }
}

export type DonationOptionsProps = {
  type: string
  setType: (type: string) => void
}

export type OneTimeDonationOptionBtnProps = {
  setInputs: Function
  num: number
  inputs: any
}

export type OneTimeDonationProgressTrackerProps = {
  step: { step1: boolean; step2: boolean; step3: boolean }
  setStep: any
  type: string
}

export type OneTimeStepOneProps = {
  setInputs: (inputs: Record<string, any>) => void // function to update inputs
  inputs: Record<string, any> // current form inputs
  handleInput: (event: React.ChangeEvent<HTMLInputElement>) => void // function to handle input changes
  errors: Record<string, string | undefined> // error messages for the inputs
  setErrors: (errors: Record<string, string | undefined>) => void // function to set errors
  setStep: any
}
export type OneTimeStepTwoProps = {
  inputs: Record<string, any> // current form inputs
  handleInput: (event: React.ChangeEvent<HTMLInputElement>) => void // function to handle input changes
  errors: Record<string, string | undefined> // error messages for the inputs
  setErrors: (errors: Record<string, string | undefined>) => void // function to set errors
  setStep: any
}
