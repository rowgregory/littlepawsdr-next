import AdoptionFee from "@models/adoptionFeeModel";
import { createJWT } from "app/utils/createJWT";
import { JWTPayload } from "jose";

const createAdoptionApplicationFee = async (formData: any) => {
  try {
    const expiresInSeconds = 7 * 24 * 60 * 60;

    // Prepare JWT payload
    const payload: JWTPayload = {
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
    };

    // Create the token with expiration
    const { token, exp } = await createJWT(payload, expiresInSeconds);

    const fee = await AdoptionFee.create({
      firstName: formData.firstName,
      lastName: formData.lastName,
      emailAddress: formData.email,
      state: formData.state,
      token,
      exp,
      ...(formData.bypassCode && { bypassCode: formData.bypassCode }),
    });

    return fee;
  } catch (err: any) {
    return {
      message: "Error creating adoption application fee",
    };
  }
};

export default createAdoptionApplicationFee;
