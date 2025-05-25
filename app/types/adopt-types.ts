import { ChangeEvent, ReactNode } from "react";

type SectionProps = {
  title: string;
  text: string;
  text2?: string;
  children?: ReactNode;
};

type CustomerInfoProps = {
  firstName: string;
  lastName: string;
  email: string;
  state: string;
  bypassCode: string;
};

interface Inputs {
  firstName?: string;
  lastName?: string;
  email?: string;
  state?: string;
  bypassCode?: string;
}

interface Errors {
  firstName?: string;
  lastName?: string;
  email?: string;
  state?: string;
  bypassCode?: string;
}

interface ApplicantInfoFormProps {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleInput: (input: { name: string; value: string }) => void;
  inputs: Inputs;
  errors: Errors;
  isLoading: boolean;
}

interface ProgressStepsProps {
  step1?: boolean;
  step2?: boolean;
  step3?: boolean;
  step4?: boolean;
}

type StepState = {
  step1: boolean;
  step2: boolean;
  step3: boolean;
  step4: boolean;
};

interface AdoptionApplicationFeeStatePayload {
  loading: boolean;
  success: boolean;
  error: string | false | null;
  message: string | null;
  adoptionApplicationFees: [] | any;
}

export type {
  SectionProps,
  CustomerInfoProps,
  ApplicantInfoFormProps,
  ProgressStepsProps,
  StepState,
  AdoptionApplicationFeeStatePayload,
};
