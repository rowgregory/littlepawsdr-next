import React, { FC } from 'react'

interface Option {
  value: string
  text: string
  taxRate: number
}

interface AdoptFeeSelectProps {
  label: string
  name: string
  value: string
  onChange: (input: { name: string; value: string }) => void
  error?: string
  required?: boolean
  options: Option[]
  selectClassName?: string
}

const AdoptFeeSelect: FC<AdoptFeeSelectProps> = ({
  label,
  name,
  value,
  onChange,
  error,
  required = false,
  options,
  selectClassName = ''
}) => {
  return (
    <div className="flex flex-col mb-4 w-full">
      <label className="text-sm mb-1" htmlFor={name}>
        {label}
        {required && '*'}
      </label>
      <select
        className={selectClassName}
        name={name}
        id={name}
        value={value}
        onChange={(e) => onChange({ name: e.target.name, value: e.target.value })}
      >
        <option value="">Select an option</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.text}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}

export default AdoptFeeSelect
