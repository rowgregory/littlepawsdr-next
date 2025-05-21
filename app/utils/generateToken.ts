import { SignJWT } from "jose";

const generateToken = async (payload: any) => {
  const secretKey = process.env.JWT_SECRET;
  try {
    // Create a new JWT signer with the payload
    const jwt = new SignJWT(payload);

    // Set the JWT algorithm (use 'HS256' or any algorithm you prefer)
    const token = await jwt
      .setProtectedHeader({ alg: "HS256" }) // Set algorithm
      .sign(new TextEncoder().encode(secretKey)); // Sign the token with the secret key

    return token;
  } catch (error) {
    console.error("Error generating token:", error);
    throw new Error("Failed to generate token");
  }
};

export default generateToken;
