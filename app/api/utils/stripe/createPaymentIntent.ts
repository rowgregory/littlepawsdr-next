import Stripe from "stripe";

export default async function createPaymentIntent(
  formData: any,
  customer: Stripe.Customer,
  stripe: Stripe,
  metadata: Record<string, string> = {}
) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(formData.totalPrice * 100),
    currency: "usd",
    customer: customer.id,
    metadata,
    payment_method: formData.paymentMethodId,
    confirm: true,
    automatic_payment_methods: {
      enabled: true,
      allow_redirects: "never",
    },
    setup_future_usage: formData.savePaymentMethod ? "off_session" : undefined,
  });

  return paymentIntent;
}
