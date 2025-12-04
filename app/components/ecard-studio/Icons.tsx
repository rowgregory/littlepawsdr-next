import React, { FC } from 'react'
import { Sparkles, Heart, Gift, Star, Sun, Moon, Flower, Coffee, Music } from 'lucide-react'

const icons = [
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

const Icons: FC<{ cardData: any; setCardData: any }> = ({ cardData, setCardData }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Icon</h3>
      <div className="grid grid-cols-5 gap-3">
        {icons.map((icon) => {
          const IconComp = icon.component
          return (
            <button
              key={icon.id}
              onClick={() => setCardData({ ...cardData, icon: icon.id })}
              className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                cardData.icon === icon.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <IconComp className="w-6 h-6 mx-auto text-gray-600" />
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default Icons
