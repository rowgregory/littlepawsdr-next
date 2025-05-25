import { NextRequest, NextResponse } from "next/server";
import WelcomeWienerDog from "@models/welcomeWienerDogModel";
import "@models/welcomeWienerProductModel";
import connectDB from "app/config/db";
import { parseStack } from "error-stack-parser-es/lite";
import { createLog } from "app/utils/logHelper";

export async function GET(req: NextRequest) {
  await connectDB();

  try {
    const welcomeWieners = await WelcomeWienerDog.find({}).populate({
      path: "associatedProducts",
      select: "name",
      model: "WelcomeWienerProduct",
    });

    return NextResponse.json({ welcomeWieners });
  } catch (error: any) {
    await createLog(
      "error",
      `Failed to fetch welcome wieners: ${error.message}`,
      {
        location: [
          "welcome-wiener route - GET /api/welcome-wiener/fetch-welcome-wieners",
        ],
        message: "Error fetching welcome wieners",
        errorLocation: parseStack(JSON.stringify(error)),
        errorMessage: error.message,
        errorName: error.name || "UnknownError",
        timestamp: new Date().toISOString(),
        url: req.url,
        method: req.method,
      }
    );

    return NextResponse.json(
      { message: "Database connection failed" },
      { status: 500 }
    );
  }
}
