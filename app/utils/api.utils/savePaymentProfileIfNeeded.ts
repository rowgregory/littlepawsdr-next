import PaymentProfile from "@models/paymentProfileModel";

const savePaymentProfileIfNeeded = async (
  formData: any,
  user: any,
  customer: any,
  session: any,
  stripe: any
) => {
  if (!formData.hasSavedPaymentMethod) return;

  const paymentMethod = await stripe.paymentMethods.retrieve(
    formData.paymentMethod.id
  );

  const existingProfile = await PaymentProfile.findOne({
    user: user._id,
    stripePaymentMethodId: formData.paymentMethod.id,
  }).session(session);

  if (!existingProfile) {
    const paymentProfile = new PaymentProfile({
      user: user._id,
      stripeCustomerId: customer.id,
      stripePaymentMethodId: formData.paymentMethod.id,
      last4: paymentMethod.card?.last4,
      brand: paymentMethod.card?.brand,
      expMonth: paymentMethod.card?.exp_month,
      expYear: paymentMethod.card?.exp_year,
      isDefault: true,
    });
    await paymentProfile.save({ session });
  }
};

export default savePaymentProfileIfNeeded;
