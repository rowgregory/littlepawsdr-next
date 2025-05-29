import { sendScheduledEcards } from "app/api/utils/ecard/sendScheduledEcards";
import { createLog } from "app/utils/logHelper";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await sendScheduledEcards();
    return NextResponse.json({
      message: "Send scheduled ecards cron job executed",
      result,
    });
  } catch (error: any) {
    await createLog("error", "Failed to run cron job", {
      functionName: "SEND_ECARDS_CRON",
      timestamp: new Date().toISOString(),
      errorName: error.name,
      errorMessage: error.message,
    });

    return NextResponse.json(
      { error: "Failed to run cron job", message: error.message },
      { status: 500 }
    );
  }
}
