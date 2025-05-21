import Image from 'next/image'
import React, { FC } from 'react'

interface PitureProps {
  src: string
  className: string
  priority: boolean
  imgRef?: any
  onClick?: () => void
}

const Picture: FC<PitureProps> = ({ src, className, priority = false, imgRef, onClick }) => {
  return (
    <Image
      onClick={onClick}
      ref={imgRef}
      src={src}
      alt="Little Paws Dachshund Rescue"
      width="0"
      height="0"
      sizes="100vw"
      className={className}
      priority={priority}
    />
  )
}

export default Picture
