import { FormInputProps } from 'app/types/form-types';
import React, { FC } from 'react';

const styles = {
  div: 'flex flex-col w-full',
  label: 'text-sm mb-1',
  input:
    'bg-white border-2 w-full border-[#cdcdcd] py-2.5 px-4 focus:outline-none',
  p: 'text-sm text-red-500 font-semibold',
};

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
      {p.errors[p.name] && p.errors[p.name] && (
        <p className={`${styles.p}`}>{p.errors[p.name]}</p>
      )}
    </div>
  );
};

export default DonateInput;
