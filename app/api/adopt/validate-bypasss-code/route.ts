import { NextRequest, NextResponse } from "next/server";
import { createLog } from "app/utils/logHelper";
import { createJWT } from "app/utils/createJWT";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, bypassCode } = body;

    if (
      bypassCode &&
      process.env.BYPASS_CODE &&
      bypassCode === process.env.BYPASS_CODE
    ) {
      const { token, exp } = await createJWT(
        { email, bypass: true },
        7 * 24 * 60 * 60 // expires in 7 days
      );

      const response = NextResponse.json({
        success: true,
        message: "SEND_TO_APPLICATION",
      });

      response.cookies.set("adoptAppToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: "/",
      });

      response.cookies.set("feeExp", exp?.toString() ?? "", {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: exp ? exp - Math.floor(Date.now() / 1000) : 1800,
        path: "/",
      });

      return response;
    } else if (
      bypassCode &&
      process.env.BYPASS_CODE &&
      bypassCode !== process.env.BYPASS_CODE
    ) {
      return NextResponse.json({
        success: false,
        message: "INVALID_BYPASS_CODE",
      });
    }

    // No bypass code or invalid
    return NextResponse.json({ success: true, message: "SEND_TO_PAYMENT" });
  } catch (error: any) {
    await createLog("error", "Error processing bypass code", {
      functionName: "POST_BYPASS_CHECK",
      name: error.name,
      message: error.message,
      method: req.method,
      url: req.url,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { message: "Something went wrong", success: false },
      { status: 500 }
    );
  }
}
