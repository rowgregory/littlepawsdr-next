"use server";

import { NextRequest, NextResponse } from "next/server.js";
import { URL } from "url";
import { checkIfUserHasActiveAdotionApplicationFeeSession } from "./checkIfUserHasActiveAdotionApplicationFeeSession";
import { adoptionApplicationPayment } from "./adoptionApplicationPayment";

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const query = url.searchParams.get("endpoint");
  console.log("QUYERY ", query);
  switch (query) {
    case "CHECK_ACTIVE_ADOTION_APPLICATION_FEE_SESSION":
      return checkIfUserHasActiveAdotionApplicationFeeSession(req);
    case "ADOPTION_APPLICATION_PAYMENT":
      return adoptionApplicationPayment(req);
    default:
      return NextResponse.json(
        { message: "Invalid endpoint" },
        { status: 400 }
      );
  }
}
