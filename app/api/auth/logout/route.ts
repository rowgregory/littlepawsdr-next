import User from "@models/userModel";
import { createLog } from "app/utils/logHelper";
import { NextRequest, NextResponse } from "next/server";
import { parseStack } from "error-stack-parser-es/lite";

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    await User.findByIdAndUpdate(body._id, {
      online: false,
      token: null,
      resetPasswordToken: null,
      lastLoginTime: body.updatedAt, // use provided updatedAt if sent, else fetch user updatedAt if needed
      onlineStatus: "OFFLINE",
    });

    const response = NextResponse.json(
      { sliceName: "authApi" },
      { status: 200 }
    );

    // Clear the adoptAppToken cookie
    response.cookies.set("adoptAppToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (err: any) {
    await createLog("error", "USER_LOGOUT_PRIVATE", {
      errorLocation: parseStack(JSON.stringify(err)),
      errorMessage: err.message,
      errorName: err.name || "UnknownError",
      user: { id: null, email: null }, // you can get this from req if you extract user before
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
    });

    return NextResponse.json(
      {
        message: "Error signing user out",
        sliceName: "authApi",
      },
      { status: 500 }
    );
  }
}
