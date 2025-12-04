import { Gift, X, Star, Archive, Trash2, Reply, Forward, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react'
import { getFontClass, getFontSize, icons, getBackgroundClass } from './CardPreview'

const EmailPreviewDrawer = ({ cardData, isOpen, onClose }: { cardData: any; isOpen: boolean; onClose: () => void }) => {
  const IconComponent = icons.find((i) => i.id === cardData.icon)?.component || Gift

  // Format date for realistic email timestamp
  const formatEmailDate = () => {
    const now = new Date()
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }
    return now.toLocaleDateString('en-US', options)
  }

  return (
    <div className="">
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-white/80 transition-all duration-700 z-40 ${isOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-4xl bg-white shadow-2xl transform transition-transform duration-700 z-50 flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Gmail-style Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b bg-white">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-2">
              <Archive className="w-4 h-4 text-gray-600 cursor-pointer hover:text-gray-800" />
              <Trash2 className="w-4 h-4 text-gray-600 cursor-pointer hover:text-gray-800" />
              <Star className="w-4 h-4 text-gray-600 cursor-pointer hover:text-yellow-400" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ChevronLeft className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">1 of 1</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <MoreVertical className="w-4 h-4 text-gray-600 cursor-pointer hover:text-gray-800" />
          </div>
        </div>

        {/* Email Header */}
        <div className="flex-shrink-0 px-6 py-4 border-b bg-white">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h2 className="text-xl font-medium text-gray-900 mb-2">🎉 You've received a special eCard!</h2>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">LP</div>
                  <div>
                    <div className="font-medium text-gray-900">Little Paws Dachshund Rescue</div>
                    <div className="text-gray-500">&lt;no-reply@littlepawsdr.org&gt;</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right text-sm text-gray-500">
              <div>{formatEmailDate()}</div>
              <div className="flex items-center gap-2 mt-2">
                <Reply className="w-4 h-4 cursor-pointer hover:text-gray-700" />
                <Forward className="w-4 h-4 cursor-pointer hover:text-gray-700" />
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <span className="font-medium">To:</span>{' '}
            {cardData.recipientsEmail || `${cardData.recipientName?.toLowerCase().replace(' ', '.')}@email.com`}
          </div>
        </div>

        {/* Email Body */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="px-6 py-8 min-h-full">
            {/* Email Content Container */}
            <div className="bg-white rounded-lg shadow-sm border max-w-2xl mx-auto">
              {/* Email Body Text */}
              <div className="p-6 text-gray-700 leading-relaxed">
                <p className="mb-4">Hi {cardData.recipientName || 'there'},</p>
                <p className="mb-6">Someone special has sent you a personalized eCard! We hope this brings a smile to your day.</p>
              </div>

              {/* eCard Container */}
              <div className="px-6 pb-6">
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 bg-gray-50">
                  <div className="text-center text-sm text-gray-600 mb-4 font-medium">✨ Your Personal eCard ✨</div>

                  {/* Actual Card */}
                  <div
                    className={`${getBackgroundClass(
                      cardData.background
                    )} rounded-xl p-8 aspect-[4/3] flex flex-col items-center justify-center text-center shadow-lg relative overflow-hidden`}
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
                </div>
              </div>

              {/* Email Footer */}
              <div className="px-6 pb-6 text-gray-600 text-sm leading-relaxed">
                <p className="mb-4">
                  We hope you enjoyed this special message! If you'd like to send your own personalized eCards to support our rescue mission, visit
                  our website.
                </p>

                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg mb-4">
                  <p className="text-blue-800 font-medium mb-1">About Little Paws Dachshund Rescue</p>
                  <p className="text-blue-700 text-sm">
                    We're dedicated to rescuing, rehabilitating, and rehoming dachshunds in need. Every eCard purchase helps support our mission to
                    give these wonderful dogs a second chance at happiness.
                  </p>
                </div>

                <p className="text-gray-500 text-xs border-t pt-4 mt-4">
                  This eCard was sent through Little Paws Dachshund Rescue's eCard system.
                  <br />
                  Questions? Contact us at support@littlepawsdr.org
                  <br />© 2024 Little Paws Dachshund Rescue. All rights reserved.
                </p>
              </div>
            </div>

            {/* Gmail-style action buttons */}
            <div className="flex justify-center gap-3 mt-8 pb-8">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors font-medium">Reply</button>
              <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors font-medium">
                Forward
              </button>
              <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors font-medium">
                Send Your Own eCard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmailPreviewDrawer
