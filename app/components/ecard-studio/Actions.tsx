import { Download, ShoppingCart, Eye, Send } from 'lucide-react'
import IconButtonWithTooltip from '../common/IconButtonWithTooltip'
import { FC } from 'react'

const handleDownload = () => {
  console.log('Download triggered')
}

const handleAddToCart = () => {
  console.log('Add to cart triggered')
}

const handleSend = () => {
  console.log('Send eCard triggered')
}

const Actions: FC<{ setPreviewFullSize: any }> = ({ setPreviewFullSize }) => {
  const actions = [
    { label: 'Preview Full Size', icon: Eye, onClick: () => setPreviewFullSize(true) },
    { label: 'Download', icon: Download, onClick: handleDownload },
    { label: 'Add to Cart', icon: ShoppingCart, onClick: handleAddToCart },
    { label: 'Send eCard', icon: Send, onClick: handleSend }
  ]
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-[512px]">
      <div className="flex justify-end">
        {actions.map((action) => (
          <IconButtonWithTooltip key={action.label} icon={action.icon} label={action.label} onClick={action.onClick} />
        ))}
      </div>
    </div>
  )
}

export default Actions
