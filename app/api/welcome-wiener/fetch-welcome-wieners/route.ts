import { NextRequest, NextResponse } from "next/server";
import WelcomeWienerDog from "@models/welcomeWienerDogModel";
import "@models/welcomeWienerProductModel";
import { URL } from "url";
import connectDB from "app/config/db";

export async function GET(req: NextRequest) {
  await connectDB();

  const url = new URL(req.url);
  const query = url.searchParams.get("endpoint");

  if (query === "FETCH_WELCOME_WIENERS") {
    try {
      const welcomeWieners = await WelcomeWienerDog.find({}).populate({
        path: "associatedProducts",
        select: "name",
        model: "WelcomeWienerProduct",
      });

      return NextResponse.json({ welcomeWieners });
    } catch (error) {
      console.error("Database connection error:", error);
      return new NextResponse("Database connection failed", { status: 500 });
    }
  }
}
