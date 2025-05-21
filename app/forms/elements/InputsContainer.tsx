import { InputsContainerProps } from 'app/types/form-types';
import React, { FC } from 'react';

const InputsContainer: FC<InputsContainerProps> = ({ children, title }) => {
  return (
    <div className="border-4 border-zinc-100 p-5">
      <h3 className="font-Kuunari text-xl mb-8">{title}</h3>
      <div className="grid grid-cols-12 gap-10">{children}</div>
    </div>
  );
};

export default InputsContainer;
