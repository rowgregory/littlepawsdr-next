import PaymentProfile from 'models/paymentProfileModel'

const savePaymentProfileIfNeeded = async (formData: any, user: any, customer: any, session: any, stripe: any) => {
  if (!formData.hasSavedPaymentMethod || !formData.paymentMethodId) return null

  const paymentMethodId = formData.paymentMethodId

  // Check if already saved
  const existingProfile = await PaymentProfile.findOne({
    user: user._id,
    stripePaymentMethodId: paymentMethodId
  }).session(session)

  if (existingProfile) return existingProfile

  // Attach payment method to customer (if not already)
  await stripe.paymentMethods.attach(paymentMethodId, {
    customer: customer.id
  })

  await stripe.customers.update(customer.id, {
    invoice_settings: {
      default_payment_method: paymentMethodId
    }
  })

  const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId)

  const paymentProfile = new PaymentProfile({
    user: user._id,
    stripeCustomerId: customer.id,
    stripePaymentMethodId: paymentMethodId,
    last4: paymentMethod.card?.last4,
    brand: paymentMethod.card?.brand,
    expMonth: paymentMethod.card?.exp_month,
    expYear: paymentMethod.card?.exp_year,
    isDefault: true
  })

  await paymentProfile.save({ session })

  return paymentProfile
}

export default savePaymentProfileIfNeeded
