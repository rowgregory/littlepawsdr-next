import React, { FC } from 'react'

const fonts = [
  { id: 'elegant', name: 'Elegant', class: 'font-serif' },
  { id: 'modern', name: 'Modern', class: 'font-sans' },
  { id: 'playful', name: 'Playful', class: 'font-mono' },
  { id: 'script', name: 'Script', class: 'font-serif italic' }
]

const Typography: FC<{ cardData: any; setCardData: any }> = ({ cardData, setCardData }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-0 z-30">
      <h3 className="text-lg font-semibold mb-4">Typography</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Font Style</label>
          <div className="grid grid-cols-2 gap-2">
            {fonts.map((font) => (
              <button
                key={font.id}
                onClick={() => setCardData({ ...cardData, font: font.id })}
                className={`p-2 text-sm border rounded-lg transition-colors ${font.class} ${
                  cardData.font === font.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {font.name}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
          <select
            value={cardData.fontSize}
            onChange={(e) => setCardData({ ...cardData, fontSize: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
            <option value="extra-large">Extra Large</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={cardData.textColor}
              onChange={(e) => setCardData({ ...cardData, textColor: e.target.value })}
              className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
            />
            <input
              type="text"
              value={cardData.textColor}
              onChange={(e) => setCardData({ ...cardData, textColor: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Typography
