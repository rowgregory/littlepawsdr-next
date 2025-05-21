export const convertToCents = (amount: number): number => {
  // Ensure the amount is a number and is not negative
  if (isNaN(amount) || amount < 0) {
    throw new Error("Invalid amount. It should be a positive number.");
  }

  // Convert to cents
  return Math.round(amount * 100);
};
