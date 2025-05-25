import { SignJWT } from "jose";
import { nanoid } from "nanoid";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function createJWT(
  payload: object,
  expiresInSeconds: number
): Promise<{ token: string; exp: number }> {
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;

  const token = await new SignJWT({ ...payload, exp })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(exp)
    .setIssuedAt()
    .setJti(nanoid())
    .sign(secret);

  return { token, exp };
}
