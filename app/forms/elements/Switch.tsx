import { useRef } from 'react'

const Switch = ({ enabled, onChange }: { enabled: any; onChange: any }) => {
  const inputRef = useRef(null) as any
  return (
    <>
      <h3 className="text-17 text-ironMist font-semibold">Fit Mode</h3>
      <p className="text-sm text-ironMist dark:text-zinc-300 mt-3 mb-4">
        Toggle between cropping the image to fill the space (cover) or fitting it within the space without cropping (contain).
      </p>
      <button
        type="button"
        onClick={(e: any) => {
          e.preventDefault()
          inputRef?.current?.click()
        }}
        className={`relative w-24 h-12 flex items-center rounded-full transition-colors duration-300 bg-zinc-100 dark:bg-zinc-700`}
      >
        <span
          className={`absolute left-2 w-8 h-8 rounded-full shadow-lg transition-all duration-300 ${
            enabled ? 'translate-x-12 bg-azure dark:bg-amathystglow' : 'translate-x-0 bg-zinc-400 dark:bg-charcoal'
          }`}
        />
      </button>
      <input
        checked={enabled}
        name="maintainAspectRatio"
        ref={inputRef}
        type="checkbox"
        value={enabled}
        onChange={onChange}
        className="hidden"
      />
    </>
  )
}

export default Switch
