import AdoptionFee from 'models/adoptionFeeModel'
import { createJWT } from 'app/utils/createJWT'
import { JWTPayload } from 'jose'
import mongoose from 'mongoose'

const createAdoptionApplicationFee = async (formData: any, orderId: mongoose.Types.ObjectId, session: mongoose.ClientSession) => {
  try {
    const expiresInSeconds = 7 * 24 * 60 * 60

    // Prepare JWT payload
    const payload: JWTPayload = {
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email
    }

    // Create the token with expiration
    const { token, exp } = await createJWT(payload, expiresInSeconds)

    // Pass session as option correctly
    const [fee] = await AdoptionFee.create(
      [
        {
          orderId,
          firstName: formData.firstName,
          lastName: formData.lastName,
          emailAddress: formData.email,
          state: formData.state,
          token,
          exp,
          ...(formData.bypassCode && { bypassCode: formData.bypassCode })
        }
      ],
      { session }
    )

    // Note: create() with array returns array of docs, so destructure it:
    return fee
  } catch (err: any) {
    return {
      message: 'Error creating adoption application fee'
    }
  }
}

export default createAdoptionApplicationFee
