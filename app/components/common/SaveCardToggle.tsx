import { setInputs } from 'app/lib/store/slices/formSlice'
import { store, useFormSelector } from 'app/lib/store/store'
import { useSession } from 'next-auth/react'

type Props = {
  formName: string
}

export function SaveCardToggle({ formName }: Props) {
  const session = useSession()
  const isAuthed = session.status === 'authenticated'
  const form = useFormSelector()
  const inputs = form?.[formName]?.inputs
  const checked = !!inputs?.saveCard

  if (!isAuthed || (inputs?.selectedCardId && !inputs?.useNewCard)) return null

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => store.dispatch(setInputs({ formName, data: { saveCard: !checked } }))}
      className="w-full flex items-center justify-between px-3.5 py-3 border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark hover:border-primary-light dark:hover:border-primary-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
    >
      <div className="text-left">
        <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-text-light dark:text-text-dark">Save card for future donations</p>
        <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark mt-0.5">One-click checkout next time</p>
      </div>
      <div
        aria-hidden="true"
        className={`relative shrink-0 w-10 h-5 ml-4 transition-colors duration-200 ${checked ? 'bg-primary-light dark:bg-primary-dark' : 'bg-border-light dark:bg-border-dark'}`}
      >
        <span className={`absolute top-0.5 w-4 h-4 bg-white transition-transform duration-200 ${checked ? 'translate-x-0.5' : '-translate-x-4.5'}`} />
      </div>
    </button>
  )
}
