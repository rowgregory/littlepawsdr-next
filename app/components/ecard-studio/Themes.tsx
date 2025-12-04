import React, { FC } from 'react'
import { Sparkles, Heart, Gift, Flower, Coffee, Music } from 'lucide-react'

const iconMap = {
  gift: Gift,
  heart: Heart,
  sparkles: Sparkles,
  flower: Flower,
  coffee: Coffee,
  music: Music
} as const

type IconKey = keyof typeof iconMap

const themes: {
  id: string
  theme: string
  icon: IconKey
  color: string
  message: string
  subMessage: string
}[] = [
  {
    id: 'gotcha-day',
    theme: 'Gotcha Day',
    icon: 'gift',
    color: '#ff6b9d',
    message: 'Happy Gotcha Day!',
    subMessage: 'Another year of belly rubs and tail wags!'
  },
  {
    id: 'puppy-love',
    theme: 'Puppy Love',
    icon: 'heart',
    color: '#ff4757',
    message: 'Puppy Love!',
    subMessage: 'From one dog lover to another — much love.'
  },
  {
    id: 'zoomies',
    theme: 'Zoomies!',
    icon: 'sparkles',
    color: '#ffa726',
    message: 'Time for Zoomies!',
    subMessage: 'Let’s run wild and celebrate big!'
  },
  {
    id: 'walkies',
    theme: 'Walkies',
    icon: 'flower',
    color: '#26c6da',
    message: 'Let’s Go for a Walk',
    subMessage: 'Sniff the flowers, chase a squirrel, feel the breeze.'
  },
  {
    id: 'snuggle',
    theme: 'Snuggle Time',
    icon: 'coffee',
    color: '#8d4e85',
    message: 'Snuggle Up!',
    subMessage: 'Perfect time for a blanket and a dachshund cuddle.'
  },
  {
    id: 'bark-beats',
    theme: 'Bark Beats',
    icon: 'music',
    color: '#667eea',
    message: 'Paw-some Tunes!',
    subMessage: 'Turn up the doggy jams and dance your tail off!'
  }
]

const Themes: FC<{ cardData: any; setCardData: any }> = ({ cardData, setCardData }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-0 z-10">
      <h3 className="text-lg font-semibold mb-4">Themes</h3>
      <div className="grid grid-cols-3 gap-3">
        {themes.map((theme) => {
          const IconComp = iconMap[theme.icon]
          return (
            <button
              key={theme.id}
              onClick={() => setCardData({ ...cardData, theme: theme.id, icon: theme.icon, message: theme.message, subMessage: theme.subMessage })}
              className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                cardData.theme === theme.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <IconComp className="w-6 h-6 mx-auto mb-1" style={{ color: theme.color }} />
              <span className="text-xs font-medium">{theme.theme}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default Themes
