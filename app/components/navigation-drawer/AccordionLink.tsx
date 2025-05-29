import { useState } from 'react'
import { sideLinkData } from '@public/static-data/sidenavData'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
// import Link from 'next/link';
// import Accordion from '../Accordion';

const AccordionLinks = ({ closeMenu, pathname }: any) => {
  const [index, setIndex] = useState(0)

  return sideLinkData?.map((obj: any, i: number) => (
    <div key={i}>
      <button onClick={() => setIndex(i === index ? -1 : i)} className="w-full p-0">
        <div className="duration-300 text-[#cbd7db] text-sm font-medium tracking-[0.1rem] grid grid-cols-[0.25fr,3fr,0.1fr] items-center text-left gap-2 px-5 py-3 uppercase hover:no-underline hover:bg-[#213242] focus:text-[#cbd7db] focus:no-underline focus:bg-[#213242]">
          {obj.icon}
          {obj?.title}
          <FontAwesomeIcon icon={faChevronRight} className={`${i === index ? 'rotate-90' : 'rotate-0'} duration-300`} />
        </div>
      </button>
      {/* <Accordion toggle={i === index}>
        <div className="d-flex flex-column border-t-4 border-solid border-[#15222e]">
          {obj?.links.map((link: any, l: number) => (
            <div
              className="pl-9 bg-[#213242] flex items-center hover:bg-[#1b2a39]"
              key={l}
            >
              <Link
                className={`${
                  pathname === link.linkKey ? 'bg-[#213242]' : ''
                } duration-300 text-[#cbd7db] text-sm font-medium tracking-[0.1rem] w-full flex items-center text-left px-5 gap-2 py-3 uppercase
                 hover:no-underline focus:text-[#cbd7db] focus:no-underline focus:bg-[#213242]`}
                href={link.linkKey}
                onClick={() => closeMenu()}
              >
                {link.linkText}
              </Link>
            </div>
          ))}
        </div>
      </Accordion> */}
    </div>
  ))
}

export default AccordionLinks
