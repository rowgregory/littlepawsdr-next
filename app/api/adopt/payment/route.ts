import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createLog } from "app/utils/logHelper";
import createAdoptionApplicationFee from "../../../utils/api.utils/adopt/createAdoptionApplicationFee";
import startMongoSession from "app/utils/api.utils/startMonogoSession";
import getOrCreateStripeCustomer from "app/utils/api.utils/getOrCreateStripeCustomer";
import findOrCreateUser from "app/utils/api.utils/findOrCreateUser";
import savePaymentProfileIfNeeded from "app/utils/api.utils/savePaymentProfileIfNeeded";
import createAndConfirmPaymentIntent from "app/utils/api.utils/createAndConfirmPaymentIntent";
import setAdoptionFeeCookies from "app/utils/api.utils/adopt/setAdoptionFeeCookies";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error(
    "Stripe secret key is not defined in the environment variables."
  );
}

const stripe = new Stripe(stripeSecretKey, { apiVersion: "2025-02-24.acacia" });

export async function POST(req: NextRequest) {
  const session = await startMongoSession();

  try {
    const formData = await req.json();

    const customer = await getOrCreateStripeCustomer(formData, stripe);
    const user = await findOrCreateUser(formData, session);
    await savePaymentProfileIfNeeded(formData, user, customer, session, stripe);

    const paymentIntent = await createAndConfirmPaymentIntent(
      formData,
      customer,
      stripe
    );

    const newSession = await createAdoptionApplicationFee(formData);

    const response = NextResponse.json(
      { message: "Payment processed successfully" },
      { status: 200 }
    );

    setAdoptionFeeCookies(response, newSession.token, newSession.exp);

    await session.commitTransaction();
    session.endSession();

    return response;
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();

    await createLog("error", "Error processing adoption payment", {
      functionName: "POST_ADOPTION_APPLICATION_PAYMENT",
      name: error.name,
      message: error.message,
      location: ["adopt/payment route - POST /api/adopt/payment"],
      method: "POST",
      url: "/api/adopt/payment",
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { message: "Failed to process payment" },
      { status: 500 }
    );
  }
}
