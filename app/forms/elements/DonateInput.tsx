import { FormInputProps } from 'app/types/form-types'
import React, { FC } from 'react'

const styles = {
  div: 'flex flex-col w-full',
  label: 'text-sm mb-1',
  input: 'border-1 w-full border-[#e4e4e7] h-[39px] px-4 focus:outline-none placeholder:text-sm placeholder:text-[#747474] font-medium',
  p: 'text-sm text-red-500 font-semibold'
}

const DonateInput: FC<FormInputProps> = (p) => {
  return (
    <div className={`${p.className} ${styles.div}`}>
      <label htmlFor={p.name} className={`${styles.label}`}>
        {p.textKey}
      </label>
      <input
        name={p.name}
        id={p.name}
        type={p.type}
        value={p.value || ''}
        onChange={p.handleInput}
        placeholder={p.placeholder}
        className={`${styles.input}`}
      />
      {p?.errors?.[p?.name] && p?.errors?.[p?.name] && <p className={`${styles?.p}`}>{p?.errors?.[p?.name]}</p>}
    </div>
  )
}

export default DonateInput
