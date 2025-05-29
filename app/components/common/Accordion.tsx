import useAccordion from '@hooks/useAccordion'
import React, { FC, ReactNode } from 'react'
import Icon from './Icon'
import { minusIcon, plusIcon } from 'app/lib/font-awesome/icons'

interface AccordionProps {
  title: string
  children: ReactNode
  initiallyOpen?: boolean
}

const Accordion: FC<AccordionProps> = ({ title, children, initiallyOpen }) => {
  const { isOpen, toggleAccordion } = useAccordion({ initiallyOpen })

  return (
    <div className="border rounded-md overflow-hidden w-full">
      <button onClick={toggleAccordion} className="flex justify-between items-center w-full p-4 bg-teal-400 text-white focus:outline-none">
        <span className="font-QBold">{title}</span>
        <Icon icon={isOpen ? minusIcon : plusIcon} />
      </button>
      <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
        <div className="p-4 bg-white">{children}</div>
      </div>
    </div>
  )
}

export default Accordion
