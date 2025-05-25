import React, { FC } from 'react'

interface AdoptFeeInputProps {
  label: string
  name: string
  value: string
  onChange: (input: { name: string; value: string }) => void
  error?: string
  placeholder?: string
  required?: boolean
  inputClassName?: string
}

const AdoptFeeInput: FC<AdoptFeeInputProps> = ({
  label,
  name,
  value,
  onChange,
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
      <input
        className={inputClassName}
        name={name}
        onChange={(e) => onChange({ name: e.target.name, value: e.target.value })}
        type="text"
        alt={label}
        value={value || ''}
        placeholder={placeholder}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}

export default AdoptFeeInput
