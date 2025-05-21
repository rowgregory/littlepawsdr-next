import AdoptionFee from "@models/adoptionFeeModel";
import { SignJWT, jwtVerify } from "jose";

const generateToken = async (
  payload: { name: string; email: string },
  expiresIn: string
) => {
  const secret = new TextEncoder().encode(
    process.env.JWT_SECRET ?? "12345hjkl"
  );

  const match = expiresIn.match(/^(\d+)([dhms])$/);
  let expirationSeconds = 60 * 60 * 24 * 7; // Default to 7 days

  if (match) {
    const [, value, unit] = match;
    const multipliers: Record<string, number> = {
      s: 1,
      m: 60,
      h: 3600,
      d: 86400,
    };

    const multiplier = multipliers[unit];
    if (multiplier) {
      expirationSeconds = parseInt(value) * multiplier;
    }
  }

  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + expirationSeconds)
    .sign(secret);
};

const createAdoptionApplicationFee = async (formData: any) => {
  try {
    const token = await generateToken(
      {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
      },
      "7d"
    );

    const fee = await AdoptionFee.create({
      firstName: formData.firstName,
      lastName: formData.lastName,
      emailAddress: formData.email,
      state: formData.state,
      ...(formData.bypassCode && { bypassCode: formData.bypassCode }),
      token,
    });

    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET ?? "12345hjkl"
    );
    const { payload } = await jwtVerify(token, secret);

    fee.exp = payload.exp ?? null;

    return await fee.save();
  } catch (err: any) {
    return {
      message: "Error creating adoption application fee",
    };
  }
};

export default createAdoptionApplicationFee;
