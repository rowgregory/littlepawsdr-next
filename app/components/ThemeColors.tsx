import React from 'react'

const colorNames = [
  { name: 'whisper', hex: '#f5f5f6' },
  { name: 'white', hex: '#FFF' },
  { name: 'amathystglow', hex: '#9b5de5' },
  { name: 'vibrantPeach', hex: '#ff9f6f' },
  { name: 'vibrantPink', hex: '#ff61a6' },
  { name: 'vibrantTeal', hex: '#4cb8b1' },
  { name: 'cybersky', hex: '#2fa3f2' },
  { name: 'azure', hex: '#3698ef' },
  { name: 'neonPink', hex: '#ff6b8e' },
  { name: 'neonYellow', hex: '#d8ff00' },
  { name: 'neonGreen', hex: '#39ff14' },
  { name: 'neonBlue', hex: '#1f51ff' },
  { name: 'slatestone', hex: '#6e6e73' },
  { name: 'ash', hex: '#919191' },
  { name: 'coolGray', hex: '#646464' },
  { name: 'graphite', hex: '#444444' },
  { name: 'storm', hex: '#4a4a4a' },
  { name: 'smoke', hex: '#4b4b4b' },
  { name: 'darkAsh', hex: '#3a3a3a' },
  { name: 'dusk', hex: '#3b3b3b' },
  { name: 'coal', hex: '#353535' },
  { name: 'eclipse', hex: '#00000080' },
  { name: 'charcoal', hex: '#161616' },
  { name: 'noir', hex: '#121212' },
  { name: 'deepslate', hex: '#1c1c1e' },
  { name: 'abyss', hex: '#1C1C1C' },
  { name: 'phantom', hex: '#181818' },
  { name: 'onyx', hex: '#181818' },
  { name: 'raven', hex: '#1A1A1A' },
  { name: 'carbon', hex: '#1f1f1f' },
  { name: 'shadow', hex: '#1d1d1f' },
  { name: 'jet', hex: '#333333' },
  { name: 'graphite', hex: '#222222' },
  { name: 'slate', hex: '#282828' },
  { name: 'obsidian', hex: '#282828' },
  { name: 'iron', hex: '#303030' },
  { name: 'charred', hex: '#383838' },
  { name: 'storm', hex: '#4a4a4a' },
  { name: 'midnight', hex: '#2a2a2e' },
  { name: 'vesper', hex: '#262A2F' }
]

const ThemeColors = () => {
  return (
    <div className="flex flex-col gap-2 absolute right-0 top-0">
      {colorNames.map((color, index) => (
        <div key={index} className="flex items-center gap-x-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color.hex }} />
          <span className="text-11 text-zinc-300">{color.name}</span>
        </div>
      ))}
    </div>
  )
}

export default ThemeColors
