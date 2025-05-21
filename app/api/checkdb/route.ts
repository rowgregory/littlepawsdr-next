import connectDB from "../../config/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    return new NextResponse("Database connected successfully");
  } catch (error) {
    console.error("Database connection error:", error);
    return new NextResponse("Database connection failed", { status: 500 });
  }
}
