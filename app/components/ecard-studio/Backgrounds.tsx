import { Palette } from 'lucide-react'
import React, { FC } from 'react'

const backgrounds = [
  { id: 'gradient-sunset', name: 'Sunset', preview: 'bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600' },
  { id: 'gradient-ocean', name: 'Ocean', preview: 'bg-gradient-to-br from-blue-400 via-cyan-500 to-teal-600' },
  { id: 'gradient-forest', name: 'Forest', preview: 'bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600' },
  { id: 'gradient-lavender', name: 'Lavender', preview: 'bg-gradient-to-br from-purple-400 via-pink-400 to-red-400' },
  { id: 'gradient-golden', name: 'Golden', preview: 'bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500' },
  { id: 'gradient-night', name: 'Night', preview: 'bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900' }
]

const Backgrounds: FC<{ cardData: any; setCardData: any }> = ({ cardData, setCardData }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-0 z-20">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Palette className="w-5 h-5" />
        Backgrounds
      </h3>
      <div className="grid grid-cols-3 gap-3">
        {backgrounds.map((bg) => (
          <button
            key={bg.id}
            onClick={() => setCardData({ ...cardData, background: bg.id })}
            className={`relative h-16 rounded-lg border-2 transition-all hover:scale-105 ${bg.preview} ${
              cardData.background === bg.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
            }`}
          >
            <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-medium bg-black/20 rounded-lg">{bg.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default Backgrounds
