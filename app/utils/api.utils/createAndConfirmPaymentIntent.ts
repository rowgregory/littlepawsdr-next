const createAndConfirmPaymentIntent = async (
  formData: any,
  customer: any,
  stripe: any
) => {
  return await stripe.paymentIntents.create({
    amount: 1500,
    currency: "usd",
    customer: customer.id,
    payment_method: formData.paymentMethod.id,
    off_session: true,
    confirm: true,
  });
};

export default createAndConfirmPaymentIntent;
