import { IconDefinition } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { FC, memo, MouseEventHandler } from 'react'

interface AwesomeIconProps {
  icon: IconDefinition
  className: string
  onClick?: MouseEventHandler<SVGSVGElement>
  style?: any
}

const AwesomeIcon: FC<AwesomeIconProps> = ({ icon, className, onClick, style }) => {
  return <FontAwesomeIcon onClick={onClick} icon={icon} className={className} style={style} />
}

export default memo(AwesomeIcon)
