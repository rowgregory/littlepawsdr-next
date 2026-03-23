import AddPaymentMethodModal from 'app/components/modals/AddPaymentMethodModal'

export default async function MemberLayout({ children }) {
  return (
    <>
      <AddPaymentMethodModal /> {children}
    </>
  )
}
