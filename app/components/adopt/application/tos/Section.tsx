import { SectionProps } from 'app/types/adopt-types';
import { FC } from 'react';

const Section: FC<SectionProps> = ({ title, text, text2, children }) => {
  return (
    <div className="mb-3.5">
      <h5 className="font-QBold mb-1">{title}</h5>
      <p>{text}</p>
      {text2 && <p className="mt-3.5">{text2}</p>}
      {children}
    </div>
  );
};

export default Section;
