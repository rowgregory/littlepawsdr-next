import { NextResponse } from "next/server";
import { Campaign } from "@models/campaignModel";
import connectDB from "app/config/db";
import { startSession } from "mongoose";
import { createLog } from "app/utils/logHelper";

// GET /api/campaign/fetch-campaigns
export async function GET() {
  let session;

  try {
    await connectDB();
    session = await startSession();

    // Optional: start a transaction if you want read consistency, but not mandatory for reads
    // session.startTransaction();

    // Fetch campaigns with populated fields
    const campaigns = await Campaign.find({})
      .populate([{ path: "auction", populate: [{ path: "settings" }] }])
      .session(session);

    const totalGrossCampaignRevenue = campaigns.reduce(
      (total, campaign) => total + (campaign.totalCampaignRevenue || 0),
      0
    );

    // Optional: await session.commitTransaction();

    session.endSession();

    return NextResponse.json(
      { campaigns, totalGrossCampaignRevenue, sliceName: "campaignApi" },
      { status: 200 }
    );
  } catch (error: any) {
    if (session) {
      try {
        // Optional: abort transaction if started
        // await session.abortTransaction();
        session.endSession();
      } catch {}
    }
    await createLog("error", "Error fetching campaigns", {
      functionName: "GET_FETCH_CAMPAIGNS",
      name: error.name,
      message: error.message,
      location: ["campaign/fetch-campaigns GET"],
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { message: "Error fetching campaigns", sliceName: "campaignApi" },
      { status: 500 }
    );
  }
}
