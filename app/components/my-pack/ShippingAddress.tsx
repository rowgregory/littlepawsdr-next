import { fadeUp } from 'app/lib/constants/motion.constants'
import { MapPin, Pencil } from 'lucide-react'
import { motion } from 'framer-motion'
import { formatDate } from 'app/utils/_date.utils'
import { EmptyState } from './EmptyState'
import { UpdateAddressModal } from 'app/components/modals/UpdateAddressModal'

export function ShippingAddress({ setAddressModalOpen, user, addressModalOpen }) {
  return (
    <motion.section variants={fadeUp} initial="hidden" animate="show" custom={1} aria-labelledby="address-heading">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <span className="block w-6 h-px bg-primary-light dark:bg-primary-dark shrink-0" aria-hidden="true" />
          <h2
            id="address-heading"
            className="text-xs font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark"
          >
            Shipping Address
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setAddressModalOpen(true)}
          className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest uppercase px-3 py-1.5 border border-border-light dark:border-border-dark hover:border-primary-light dark:hover:border-primary-dark text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
          aria-label={user?.address ? 'Edit shipping address' : 'Add shipping address'}
        >
          <Pencil className="w-3 h-3 shrink-0" aria-hidden="true" />
          {user?.address ? 'Edit' : 'Add'}
        </button>
      </div>

      {user?.address ? (
        <div className="border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark">
          <div className="flex items-start gap-3 p-5">
            <MapPin className="w-4 h-4 text-primary-light dark:text-primary-dark shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="font-quicksand font-black text-sm text-text-light dark:text-text-dark">
                {user.address.name}
              </p>
              <p className="text-xs font-mono text-muted-light dark:text-muted-dark mt-1 leading-relaxed">
                {user.address.addressLine1}
                {user.address.addressLine2 && `, ${user.address.addressLine2}`}
                <br />
                {user.address.city}, {user.address.state} {user.address.zipPostalCode}
              </p>
            </div>
          </div>
          {user.address.updatedAt && (
            <div className="px-5 py-2.5 border-t border-border-light dark:border-border-dark">
              <p className="text-[10px] font-mono text-muted-light/60 dark:text-muted-dark/60">
                Last updated {formatDate(user.address.updatedAt)}
              </p>
            </div>
          )}
        </div>
      ) : (
        <EmptyState message="No shipping address on file." />
      )}

      <UpdateAddressModal
        open={addressModalOpen}
        onClose={() => setAddressModalOpen(false)}
        address={user?.address ?? null}
      />
    </motion.section>
  )
}
