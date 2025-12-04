'use client'

import React, { useState } from 'react'
import CardPreview from 'app/components/ecard-studio/CardPreview'
import Actions from 'app/components/ecard-studio/Actions'
import Messages from 'app/components/ecard-studio/Messages'
import Themes from 'app/components/ecard-studio/Themes'
import Backgrounds from 'app/components/ecard-studio/Backgrounds'
import Typography from 'app/components/ecard-studio/Typography'
import Icons from 'app/components/ecard-studio/Icons'
import EmailPreviewDrawer from 'app/components/ecard-studio/EmailPreviewDrawer'

const ECardPersonalizer = () => {
  const [cardData, setCardData] = useState({
    message: 'Happy Gotcha Day!',
    subMessage: 'Another year of belly rubs and tail wags!',
    recipientName: 'Friend',
    senderName: 'Your Name',
    theme: 'gotcha-day',
    background: 'gradient-sunset',
    textColor: '#ffffff',
    fontSize: 'large',
    font: 'elegant',
    icon: 'gift'
  })
  const [previewFullSize, setPreviewFullSize] = useState(false)

  console.log('cardDta: ', cardData)
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">eCard Studio</h1>
          <p className="text-gray-600">Create beautiful personalized greeting cards</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Card Preview */}
          <div className="space-y-6">
            <CardPreview cardData={cardData} />

            <Actions setPreviewFullSize={setPreviewFullSize} />
          </div>

          {/* Customization Panel */}
          <div className="space-y-6">
            {/* Messages */}
            <Messages cardData={cardData} setCardData={setCardData} />

            {/* Themes */}
            <Themes cardData={cardData} setCardData={setCardData} />

            {/* Backgrounds */}
            <Backgrounds cardData={cardData} setCardData={setCardData} />

            {/* Typography */}
            <Typography cardData={cardData} setCardData={setCardData} />

            {/* Icons */}
            <Icons cardData={cardData} setCardData={setCardData} />

            <EmailPreviewDrawer cardData={cardData} isOpen={previewFullSize} onClose={() => setPreviewFullSize(false)} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ECardPersonalizer
