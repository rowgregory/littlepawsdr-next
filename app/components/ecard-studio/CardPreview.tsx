'use client'

import React, { FC } from 'react'
import { Image, Sparkles, Heart, Gift, Star, Sun, Moon, Flower, Coffee, Music } from 'lucide-react'

export const getBackgroundClass = (bg: string) => {
  const bgMap: any = {
    'gradient-sunset': 'bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600',
    'gradient-ocean': 'bg-gradient-to-br from-blue-400 via-cyan-500 to-teal-600',
    'gradient-forest': 'bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600',
    'gradient-lavender': 'bg-gradient-to-br from-purple-400 via-pink-400 to-red-400',
    'gradient-golden': 'bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500',
    'gradient-night': 'bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900'
  }
  return bgMap[bg] || bgMap['gradient-sunset']
}

export const getFontClass = (font: string) => {
  const fontMap: any = {
    elegant: 'font-serif',
    modern: 'font-sans',
    playful: 'font-mono',
    script: 'font-serif italic'
  }
  return fontMap[font] || 'font-serif'
}

export const getFontSize = (size: string) => {
  const sizeMap: any = {
    small: 'text-2xl',
    medium: 'text-3xl',
    large: 'text-4xl',
    'extra-large': 'text-5xl'
  }
  return sizeMap[size] || 'text-4xl'
}

export const icons = [
  { id: 'gift', component: Gift },
  { id: 'heart', component: Heart },
  { id: 'star', component: Star },
  { id: 'sparkles', component: Sparkles },
  { id: 'sun', component: Sun },
  { id: 'moon', component: Moon },
  { id: 'flower', component: Flower },
  { id: 'coffee', component: Coffee },
  { id: 'music', component: Music }
]

const CardPreview: FC<{ cardData: any }> = ({ cardData }) => {
  const IconComponent = icons.find((i) => i.id === cardData.icon)?.component || Gift

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-0">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Image className="w-5 h-5" />
        Card Preview
      </h2>

      <div className="relative">
        <div
          className={`${getBackgroundClass(
            cardData.background
          )} rounded-2xl p-8 aspect-[4/3] flex flex-col items-center justify-center text-center shadow-xl transform hover:scale-105 transition-transform duration-300`}
        >
          {/* Decorative elements */}
          <div className="absolute top-4 left-4 opacity-20">
            <IconComponent className="w-8 h-8" style={{ color: cardData.textColor }} />
          </div>
          <div className="absolute top-4 right-4 opacity-20">
            <IconComponent className="w-8 h-8" style={{ color: cardData.textColor }} />
          </div>
          <div className="absolute bottom-4 left-4 opacity-20">
            <IconComponent className="w-6 h-6" style={{ color: cardData.textColor }} />
          </div>
          <div className="absolute bottom-4 right-4 opacity-20">
            <IconComponent className="w-6 h-6" style={{ color: cardData.textColor }} />
          </div>

          {/* Main content */}
          <div className="z-10 space-y-4">
            <IconComponent className="w-16 h-16 mx-auto mb-4 drop-shadow-lg" style={{ color: cardData.textColor }} />

            <h1
              className={`${getFontSize(cardData.fontSize)} ${getFontClass(cardData.font)} font-bold drop-shadow-lg`}
              style={{ color: cardData.textColor }}
            >
              {cardData.message}
            </h1>

            <p className={`text-lg ${getFontClass(cardData.font)} drop-shadow-md opacity-90`} style={{ color: cardData.textColor }}>
              {cardData.subMessage}
            </p>

            <div className="pt-4 border-t border-white/20">
              <p className={`text-sm ${getFontClass(cardData.font)} drop-shadow-md`} style={{ color: cardData.textColor }}>
                To: {cardData.recipientName}
              </p>
              <p className={`text-sm ${getFontClass(cardData.font)} drop-shadow-md mt-1`} style={{ color: cardData.textColor }}>
                From: {cardData.senderName}
              </p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-40 text-[10px] text-white pointer-events-none select-none tracking-wide">
          Little Paws Dachshund Rescue
        </div>
      </div>
    </div>
  )
}

export default CardPreview
