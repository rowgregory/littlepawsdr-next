const SUBSCRIPTION_PRICE_IDS: Record<number, string> = {
  15: "price_15usd_example",
  25: "price_25usd_example",
  50: "price_50usd_example",
  100: "price_100usd_example",
  250: "price_250usd_example",
};

const VALID_TYPES = ["donation", "ecard", "merch", "auction", "dog-boost"];

export function validateRequest(data: any) {
  const { email, type, amount, donationType, subscriptionTier } = data;

  if (!email || typeof email !== "string") {
    throw new Error("Email is required and must be a string");
  }

  if (!VALID_TYPES.includes(type)) {
    throw new Error("Invalid type");
  }

  if (type === "donation") {
    if (donationType !== "subscription" && donationType !== "one-time") {
      throw new Error("Donation type must be 'subscription' or 'one-time'");
    }

    if (donationType === "subscription") {
      if (!SUBSCRIPTION_PRICE_IDS[subscriptionTier]) {
        throw new Error("Invalid subscription tier");
      }
    }

    if (donationType === "one-time") {
      if (typeof amount !== "number" || isNaN(amount) || amount <= 0) {
        throw new Error(
          "Amount must be a positive number for one-time donations"
        );
      }
    }
  } else {
    // All non-donation purchases must have a positive amount
    if (typeof amount !== "number" || isNaN(amount) || amount <= 0) {
      throw new Error("Amount must be a positive number");
    }

    // donationType or subscriptionTier should not be included for non-donations
    if (donationType || subscriptionTier) {
      throw new Error(
        `${type} purchases should not include donationType or subscriptionTier`
      );
    }
  }
}
