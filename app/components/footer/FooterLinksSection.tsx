import { footerSections } from '@public/static-data/footer-data'
import React from 'react'
import FooterLink from './FooterLink'
import FooterBtn from './FooterBtn'
import FooterLocationText from './FooterLocationText'

const FooterLinksSection = () => {
  return footerSections.map((section, i) => (
    <div key={i} className="col-span-12 sm:col-span-3">
      <h4 className="text-2xl mb-5 font-QBold">{section?.title}</h4>
      <div className="flex flex-col gap-3">
        {section.type === 'link' && section.data.map((obj, j) => <FooterLink key={j} obj={obj} />)}
        {section.type === 'button' && section.data.map((obj, j) => <FooterBtn key={j} obj={obj} />)}
        {section.type === 'location' && section.data.map((obj, j) => <FooterLocationText key={j} obj={obj} />)}
      </div>
    </div>
  ))
}

export default FooterLinksSection
