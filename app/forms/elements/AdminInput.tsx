import React, { FC } from 'react'

const AdminInput: FC<{ value: any; handleInput: any; error: any; name: string; capitalName: string; type?: string }> = ({
  value,
  handleInput,
  error,
  name,
  capitalName,
  type
}) => {
  return (
    <div className="relative w-full">
      <input
        type={type || 'text'}
        name={name}
        value={value || ''}
        onChange={handleInput}
        className={`h-[56px] peer bg-white dark:bg-charcoal border border-gray-300 dark:border-iron rounded-md pt-5 pb-1 px-4 w-full text-shadow dark:text-white focus:outline-none focus:ring-2 focus:ring-amathystglow placeholder-transparent`}
        placeholder={capitalName}
      />
      <label
        htmlFor={name}
        className={`absolute left-4 top-2.5 text-gray-400 text-sm transition-all 
  ${
    value
      ? 'top-2 text-xs text-amathystglow'
      : 'peer-placeholder-shown:top-[17px] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-xs peer-focus:text-amathystglow'
  }`}
      >
        {capitalName}
      </label>
      {error && <div className="text-xs text-red-500 absolute -bottom-5 right-0">{error}</div>}
    </div>
  )
}

export default AdminInput
