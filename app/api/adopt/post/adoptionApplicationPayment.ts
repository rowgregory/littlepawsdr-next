import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import handleDBConnection from "app/api/handleDBConnection";

// Retrieve the Stripe secret key from environment variables
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error(
    "Stripe secret key is not defined in the environment variables."
  );
}

const stripe = new Stripe(stripeSecretKey, { apiVersion: "2025-02-24.acacia" });

/**
 @desc    Payment for adoption application
 @route   POST /api/adopt/post?endpoint=ADOPTION_APPLICATION_PAYMENT
 @access  Public
*/
export async function adoptionApplicationPayment(req: NextRequest) {
  try {
    await handleDBConnection();
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }

  try {
    const formData = await req.json();

    console.log("formData: ", formData);

    // Check if the customer already exists
    const customers = await stripe.customers.list({ email: formData.email });
    let customer;

    if (customers.data.length > 0) {
      // Use the existing customer
      customer = customers.data[0];
    } else {
      // Create a new customer
      customer = await stripe.customers.create({
        email: formData.email,
        payment_method: formData.paymentMethodId,
        invoice_settings: {
          default_payment_method: formData.paymentMethodId,
        },
      });
    }

    console.log("CUSTOMER: ", customer.id);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: formData.totalAmount,
      currency: "usd",
      customer: customer.id,
      payment_method: formData.paymentMethodId,
      off_session: true,
      confirm: true,
    });

    console.log("PAYMENT INTENT: ", paymentIntent);

    return NextResponse.json({ message: "" }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: "" }, { status: 500 });
  }
}
