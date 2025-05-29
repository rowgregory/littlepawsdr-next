import React, { ChangeEvent, FC } from 'react'

interface AdoptFeeInputProps {
  label: string
  name: string
  value: string
  handleInput: (e: ChangeEvent<HTMLInputElement>) => void
  error?: string
  placeholder?: string
  required?: boolean
  inputClassName?: string
}

const AdoptFeeInput: FC<AdoptFeeInputProps> = ({
  label,
  name,
  value,
  handleInput,
  error,
  placeholder = '',
  required = false,
  inputClassName = ''
}) => {
  return (
    <div className="flex flex-col mb-4 w-full">
      <label className="text-sm mb-1" htmlFor={name}>
        {label}
        {required && '*'}
      </label>
      <input className={inputClassName} name={name} onChange={handleInput} type="text" alt={label} value={value || ''} placeholder={placeholder} />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}

export default AdoptFeeInput
