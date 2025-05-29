import { ChangeEvent, Dispatch, FormEvent, ReactNode, SetStateAction } from 'react'

export type Inputs = {
  [key: string]: any
}

export type Errors = {
  [key: string]: string
}

export type SetErrors = (errors: Errors) => void

export type DonateInputProps = {
  name: string
  type: string | undefined
  textKey: string
  handleInput: any
  className?: string
  placeholder?: string
  errors?: any
  value?: any
}

export type RegisterFormNavigationProps = {
  handleNextStep?: any
  inputs?: any
  prevLinkKey?: string
}

export type CheckboxProps = {
  name: string
  textKey: string
  handleInput: any
  className?: string
  placeholder?: string
  value: any
  errors?: any
}

export type CheckboxWithAssociatedInputsProps = {
  obj: {
    name: string
    textKey: string
    value: any
    inputs: any
  }
  handleToggle: (event: ChangeEvent<HTMLInputElement>) => void
  inputs: Record<string, boolean | string>
  handleInput: (event: ChangeEvent<HTMLInputElement>) => void
}

export type SelectProps = {
  name: string
  textKey: string
  handleSelect: any
  options: Array<string> | undefined
  className?: string
  errors?: any
  value?: any
}

export type OneTimeStepThreeProps = {
  name: string
  errorMessage: string
  setName: Dispatch<SetStateAction<string>>
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void
  stripe: any
}

export type InputsContainerProps = {
  children: ReactNode
  title: string
}

export interface SetErrorsProps {
  formName: string
  errors: Errors
}

export interface SetInputProps {
  formName: string
  data: any
}

export interface HandleInputProps {
  formName: string
  name: string
  value: any
}

export interface PhotoDropZoneProps {
  inputRef: any
  image: string
  name: string
  maintainAspectRatio: boolean
  handleDrop: any
  loading: boolean
  handleFileChange: any
}
