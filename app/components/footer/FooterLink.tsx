import React from 'react'
import Icon from '../common/Icon'
import { chevronRightIcon } from 'app/lib/font-awesome/icons'
import Link from 'next/link'

const FooterLink = ({ obj }: { obj: any }) => {
  return (
    <Link href={obj.linkKey} className="flex items-center cursor-pointer">
      <Icon icon={chevronRightIcon} className="text-teal-400 mr-3 w-3 h-3" />
      <p className="text-white text-sm font-QLight tracking-wide">{obj.textKey}</p>
    </Link>
  )
}

export default FooterLink
