import User from "@models/userModel";
import { sliceAuth } from "@public/data/api.data";
import connectDB from "app/config/db";
import { createLog } from "app/utils/logHelper";
import { parseStack } from "error-stack-parser-es/lite";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await connectDB();

  const { email } = await req.json();

  try {
    const user = await User.findOne({ email });

    if (!user) {
      await createLog(
        "info",
        "Forgot password triggered for non-existent email (not revealing to client)",
        {
          location: ["auth route - POST /api/auth/forgot-password"],
          name: "UserNotFoundSafeResponse",
          email,
          timestamp: new Date().toISOString(),
          url: req.url,
          method: req.method,
        }
      );
      return NextResponse.json(
        {
          message: "An email has been sent if an account exists.",
          sliceName: sliceAuth,
        },
        { status: 200 }
      );
    }

    // TODO: Replace this with EmailOctopus integration to send an email to reset their password

    await createLog("info", "Forgot password email sent successfully", {
      location: ["auth route - POST /api/auth/forgot-password"],
      name: "ForgotPasswordSuccess",
      email,
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
    });

    return NextResponse.json(
      {
        message: "An email has been sent if an account exists.",
        sliceName: sliceAuth,
      },
      { status: 200 }
    );
  } catch (error: any) {
    await createLog("error", `Forgot password failed: ${error.message}`, {
      errorLocation: parseStack(JSON.stringify(error)),
      errorMessage: error.message,
      errorName: error.name || "UnknownError",
      email,
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
    });

    return NextResponse.json(
      {
        message: "Something went wrong. Please try again later.",
        sliceName: sliceAuth,
      },
      { status: 500 }
    );
  }
}
