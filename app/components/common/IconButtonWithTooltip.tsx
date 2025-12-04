import React from 'react'
import { LucideIcon } from 'lucide-react'

type Props = {
  icon: LucideIcon
  label: string
  onClick?: () => void
}

const IconButtonWithTooltip: React.FC<Props> = ({ icon: Icon, label, onClick }) => {
  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className="p-2 rounded-full hover:bg-gray-100 transition-all transform hover:-translate-y-0.5 hover:scale-105 duration-150 ease-in-out"
        aria-label={label}
      >
        <Icon className="w-5 h-5 text-gray-700" />
      </button>
      <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-10">
        {label}
      </div>
    </div>
  )
}

export default IconButtonWithTooltip
