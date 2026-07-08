import AddPaymentMethodModal from 'app/components/modals/AddPaymentMethodModal'

export const dynamic = 'force-dynamic'

export default async function MemberLayout({ children }) {
  return (
    <>
      <AddPaymentMethodModal /> {children}
    </>
  )
}
