import { NextRequest, NextResponse } from "next/server";
import handleDBConnection from "app/api/handleDBConnection";
import AdoptionApplicationBypassCode from "@models/adoptionApplicationBypassCodeModel";
import { filterActiveAdoptionFees } from "../utils/filterActiveAdoptionFees";
import createAdoptionApplicationFee from "../utils/createAdoptionApplicationFee";

/**
 @desc    Check if user has an active adotion application fee session
 @route   POST /api/adopt/post?endpoint=CHECK_ACTIVE_ADOTION_APPLICATION_FEE_SESSION
 @access  Public
*/
export async function checkIfUserHasActiveAdotionApplicationFeeSession(
  req: NextRequest
) {
  try {
    await handleDBConnection();
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }

  try {
    const formData = await req.json();
    if (formData.bypassCode) {
      const codeRecord = await AdoptionApplicationBypassCode.findOne();
      const codeMatched = formData.bypassCode === codeRecord?.bypassCode;

      if (codeMatched) {
        const activeSession = await filterActiveAdoptionFees(formData.email);
        if (activeSession) {
          return NextResponse.json(
            { message: "Active Session", token: activeSession.token },
            { status: 200 }
          );
        }

        const createdAdoptionFee = await createAdoptionApplicationFee(formData);

        return NextResponse.json(
          {
            message: "SEND_TO_APPLICATION",
            token: createdAdoptionFee.token,
          },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { message: "INCORRECT_BYPASS_CODE" },
          { status: 200 }
        );
      }
    }

    const activeSession = await filterActiveAdoptionFees(formData.email);

    if (activeSession) {
      return NextResponse.json(
        { message: "Active Session", token: activeSession.token },
        { status: 200 }
      );
    }
    console.log("No Active Session");
    return NextResponse.json({ message: "SEND_TO_PAYMENT" }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: "" }, { status: 200 });
  }
}
