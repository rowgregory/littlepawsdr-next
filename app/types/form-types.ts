import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  ReactNode,
  SetStateAction,
} from "react";

type Inputs = {
  [key: string]: any;
};

type Errors = {
  [key: string]: string;
};

type UseFormHook = {
  inputs: Inputs;
  errors: Errors;
  handleInput: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelect: (e: ChangeEvent<HTMLSelectElement>) => void;
  handleToggle: (event: ChangeEvent<HTMLInputElement>) => void;
  setInputs: Dispatch<SetStateAction<Inputs>>;
  setErrors: Dispatch<SetStateAction<Errors>>;
};

type FormInputProps = {
  name: string;
  type: string | undefined;
  textKey: string;
  handleInput: any;
  className?: string;
  placeholder?: string;
  errors?: any;
  value?: any;
};

type RegisterFormNavigationProps = {
  handleNextStep?: any;
  inputs?: any;
  prevLinkKey?: string;
};

type CheckboxProps = {
  name: string;
  textKey: string;
  handleInput: any;
  className?: string;
  placeholder?: string;
  value: any;
  errors?: any;
};

type CheckboxWithAssociatedInputsProps = {
  obj: {
    name: string;
    textKey: string;
    value: any;
    inputs: any;
  };
  handleToggle: (event: ChangeEvent<HTMLInputElement>) => void;
  inputs: Record<string, boolean | string>;
  handleInput: (event: ChangeEvent<HTMLInputElement>) => void;
};

type SelectProps = {
  name: string;
  textKey: string;
  handleSelect: any;
  options: Array<string> | undefined;
  className?: string;
  errors?: any;
  value?: any;
};

type OneTimeStepThreeProps = {
  name: string;
  errorMessage: string;
  setName: Dispatch<SetStateAction<string>>;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  stripe: any;
};

type InputsContainerProps = {
  children: ReactNode;
  title: string;
};

export type {
  Inputs,
  Errors,
  UseFormHook,
  FormInputProps,
  RegisterFormNavigationProps,
  CheckboxProps,
  CheckboxWithAssociatedInputsProps,
  SelectProps,
  OneTimeStepThreeProps,
  InputsContainerProps,
};
