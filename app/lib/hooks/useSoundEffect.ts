import { useEffect, useRef } from 'react'

export const useSoundEffect = (soundFilePath: string, playSound: boolean) => {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (soundFilePath) {
      audioRef.current = new Audio(soundFilePath)
    }
  }, [soundFilePath])

  const play = () => {
    if (playSound && audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(() => {})
    }
  }

  return { play }
}
