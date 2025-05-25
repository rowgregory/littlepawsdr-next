import User from "@models/userModel";
import connectDB from "app/config/db";
import { createLog } from "app/utils/logHelper";
import { parseStack } from "error-stack-parser-es/lite";
import { NextRequest, NextResponse } from "next/server";
import argon2 from "argon2";
import { SignJWT } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_here";

export async function POST(req: NextRequest) {
  await connectDB();

  const { email, password, cameFromAuction, customCampaignLink } =
    await req.json();

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      await createLog("warn", "USER EXISTS", { email });
      return NextResponse.json(
        {
          message: "An account with this email already exists",
          sliceName: "authApi",
        },
        { status: 400 }
      );
    }

    // Hash password with argon2
    const hashedPassword = await argon2.hash(password);

    // Create new user
    const user = new User({
      email,
      password: hashedPassword,
      cameFromAuction,
      customCampaignLink,
    });
    await user.save();

    // Create JWT token using jose
    const secret = new TextEncoder().encode(JWT_SECRET);

    const token = await new SignJWT({
      id: user._id.toString(),
      email: user.email,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(secret);

    await createLog("info", "USER REGISTERED AND LOGGED IN", {
      email,
      userId: user._id.toString(),
      timestamp: new Date().toISOString(),
    });

    const response = NextResponse.json(
      { message: "User registered and logged in", sliceName: "authApi" },
      { status: 200 }
    );

    response.cookies.set("adoptAppToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: "/",
    });

    return response;
  } catch (error: any) {
    await createLog("error", "ERROR REGISTER", {
      errorLocation: parseStack(JSON.stringify(error)),
      errorMessage: error.message,
      errorName: error.name || "UnknownError",
      email,
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
    });

    return NextResponse.json(
      { message: "Error registering user", sliceName: "authApi" },
      { status: 500 }
    );
  }
}
