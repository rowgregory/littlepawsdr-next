'use client'

import { useEffect, useState, useRef } from 'react'

interface TypewriterProps {
  sentence: string
  speed?: number
  className?: string
  showCursor?: boolean
  onComplete?: () => void
}

export const Typewriter = ({ sentence, speed = 50, className, showCursor = true, onComplete }: TypewriterProps) => {
  const [displayText, setDisplayText] = useState('')
  const [done, setDone] = useState(false)
  const indexRef = useRef(0)

  useEffect(() => {
    indexRef.current = 0

    const timer = setInterval(() => {
      if (indexRef.current < sentence.length) {
        setDisplayText(sentence.slice(0, indexRef.current + 1))
        indexRef.current++
      } else {
        clearInterval(timer)
        setDone(true)
        onComplete?.()
      }
    }, speed)

    return () => {
      clearInterval(timer)
      setDisplayText('')
      setDone(false)
    }
  }, [sentence, speed, onComplete])

  return (
    <span className={className}>
      {displayText}
      {showCursor && (
        <span aria-hidden="true" className={`inline-block w-0.5 h-[1em] ml-0.5 align-middle bg-current ${done ? 'animate-pulse' : 'opacity-100'}`} />
      )}
    </span>
  )
}
