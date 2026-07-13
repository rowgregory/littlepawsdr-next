import { fadeUp } from 'app/lib/constants/motion.constants'
import { setOpenAddPaymentMethodModal } from 'app/lib/store/slices/uiSlice'
import { store } from 'app/lib/store/store'
import { motion } from 'framer-motion'
import { CheckCircle, CreditCard, Plus } from 'lucide-react'
import { EmptyState } from './EmptyState'

export function PaymentMethods({
  paymentMethods,
  setDefaultSuccess,
  handleSetDefaultPaymentMethod,
  handleDeletePaymentMethod,
  deleteError
}) {
  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      animate="show"
      custom={2}
      aria-labelledby="payment-methods-heading"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <span className="block w-6 h-px bg-primary-light dark:bg-primary-dark shrink-0" aria-hidden="true" />
          <h2 className="text-xs font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">
            Saved Payment Methods
          </h2>
        </div>
        <button
          type="button"
          onClick={() => store.dispatch(setOpenAddPaymentMethodModal())}
          className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest uppercase px-3 py-1.5 border border-border-light dark:border-border-dark hover:border-primary-light dark:hover:border-primary-dark text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
        >
          <Plus className="w-3 h-3 shrink-0" aria-hidden="true" />
          Add Card
        </button>
      </div>
      {paymentMethods?.length === 0 ? (
        <EmptyState message="No saved payment methods." />
      ) : (
        <ul
          className="grid grid-cols-1 xs:grid-cols-2 gap-px bg-border-light dark:bg-border-dark border border-border-light dark:border-border-dark"
          role="list"
        >
          {paymentMethods?.map((pm) => (
            <li key={pm.id} className="bg-bg-light dark:bg-bg-dark p-4">
              <div className="flex items-center gap-3 min-w-0 mb-3">
                <div className="shrink-0 w-10 h-7 flex items-center justify-center border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
                  <CreditCard className="w-4 h-4 text-muted-light dark:text-muted-dark" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-quicksand font-black text-sm text-text-light dark:text-text-dark capitalize">
                      {pm.cardBrand} •••• {pm.cardLast4}
                    </p>
                    {pm.isDefault && (
                      <span className="text-[9px] font-black tracking-widest uppercase px-1.5 py-0.5 bg-primary-light/10 dark:bg-primary-dark/10 text-primary-light dark:text-primary-dark shrink-0">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark mt-0.5">
                    {pm.cardholderName && `${pm.cardholderName} · `}Expires{' '}
                    {pm.cardExpMonth.toString().padStart(2, '0')}/{pm.cardExpYear}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 pl-13">
                {!pm.isDefault && (
                  <>
                    {setDefaultSuccess === pm.id ? (
                      <div className="flex items-center gap-1.5">
                        <CheckCircle className="w-3 h-3 text-green-500 shrink-0" aria-hidden="true" />
                        <span className="text-[9px] font-mono tracking-widest uppercase text-green-500">
                          Default updated
                        </span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSetDefaultPaymentMethod(pm.id)}
                        aria-label={`Set ${pm.cardBrand} ending in ${pm.cardLast4} as default`}
                        className="text-[9px] font-mono tracking-widest uppercase px-2.5 py-1.5 border border-border-light dark:border-border-dark hover:border-primary-light dark:hover:border-primary-dark text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
                      >
                        Set Default
                      </button>
                    )}
                  </>
                )}
                <button
                  type="button"
                  onClick={() => handleDeletePaymentMethod(pm.id)}
                  aria-label={`Delete ${pm.cardBrand} ending in ${pm.cardLast4}`}
                  className="text-[9px] font-mono tracking-widest uppercase px-2.5 py-1.5 border border-border-light dark:border-border-dark hover:border-red-500 dark:hover:border-red-400 text-muted-light dark:text-muted-dark hover:text-red-500 dark:hover:text-red-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                >
                  Delete
                </button>
              </div>
              {deleteError[pm.id] && (
                <p className="text-[10px] font-mono text-red-500 dark:text-red-400 mt-2 pl-13 leading-relaxed">
                  {deleteError[pm.id]}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </motion.section>
  )
}
