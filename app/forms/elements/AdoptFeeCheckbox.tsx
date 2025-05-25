import React, { FC, useRef } from 'react'

interface AdoptFeeCheckboxProps {
  name: string
  value: string
  label: string
  handleToggle: any
  error?: string
}

const AdoptFeeCheckbox: FC<AdoptFeeCheckboxProps> = ({ name, value, label, handleToggle, error }) => {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="relative">
      <div className="flex gap-x-4">
        <div
          onClick={() => inputRef.current?.click()}
          className={`w-9 h-9 border-2 border-[#121212] duration-150 cursor-pointer flex items-center justify-center rounded-full`}
        >
          {value && <div className="w-6 h-6 bg-[#121212] rounded-full"></div>}
        </div>
        <div className="text-13 flex-1">{label}</div>
        <input ref={inputRef} type="checkbox" name={name} id={name} onChange={handleToggle} value={value || 'off'} className="hidden" />
      </div>
      {error && <div className="absolute text-13 text-red-500 left-12 -bottom-4 mt-2">{error}</div>}
    </div>
  )
}

export default AdoptFeeCheckbox
