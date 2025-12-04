import { Type } from 'lucide-react'
import React, { FC } from 'react'

const Messages: FC<{ cardData: any; setCardData: any }> = ({ cardData, setCardData }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-0">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Type className="w-5 h-5" />
        Messages
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Main Message</label>
          <input
            type="text"
            value={cardData.message}
            onChange={(e) => setCardData({ ...cardData, message: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your main message"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sub Message</label>
          <input
            type="text"
            value={cardData.subMessage}
            onChange={(e) => setCardData({ ...cardData, subMessage: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your sub message"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
            <input
              type="text"
              value={cardData.recipientName}
              onChange={(e) => setCardData({ ...cardData, recipientName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
            <input
              type="text"
              value={cardData.senderName}
              onChange={(e) => setCardData({ ...cardData, senderName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Messages
