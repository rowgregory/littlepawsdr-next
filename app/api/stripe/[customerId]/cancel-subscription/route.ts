// app/api/cancel-subscription/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createLog } from "app/utils/logHelper";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error(
    "Stripe secret key is not defined in the environment variables."
  );
}

const stripe = new Stripe(stripeSecretKey, { apiVersion: "2025-02-24.acacia" });

export async function POST(req: NextRequest) {
  try {
    const { subscriptionId } = await req.json();

    if (!subscriptionId) {
      return NextResponse.json(
        { message: "Subscription ID is required" },
        { status: 400 }
      );
    }

    // Set subscription to cancel at the end of the current period
    const updatedSubscription = await stripe.subscriptions.update(
      subscriptionId,
      {
        cancel_at_period_end: true,
      }
    );

    return NextResponse.json({
      message: "Subscription will cancel at period end",
      subscription: updatedSubscription,
    });
  } catch (error: any) {
    await createLog("error", "Error canceling Stripe subscription", {
      functionName: "POST_CANCEL_SUBSCRIPTION",
      name: error.name,
      message: error.message,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { message: "Failed to cancel subscription" },
      { status: 500 }
    );
  }
}
