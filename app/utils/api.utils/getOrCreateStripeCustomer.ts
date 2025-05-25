const getOrCreateStripeCustomer = async (formData: any, stripe: any) => {
  const customers = await stripe.customers.list({ email: formData.email });
  if (customers.data.length > 0) return customers.data[0];

  return await stripe.customers.create({
    email: formData.email,
    name: `${formData.firstName} ${formData.lastName}`,
    payment_method: formData.paymentMethod.id,
    invoice_settings: { default_payment_method: formData.paymentMethod.id },
  });
};

export default getOrCreateStripeCustomer;
