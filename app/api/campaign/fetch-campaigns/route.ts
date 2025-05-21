import { NextResponse } from "next/server";
import { Campaign } from "@models/campaignModel";
import connectDB from "app/config/db";

// GET /api/campaign/fetch-campaigns
export async function GET() {
  try {
    // Connect to the database
    await connectDB();

    // Fetch all campaigns
    const campaigns = await Campaign.find({}).populate([
      { path: "auction", populate: [{ path: "settings" }] },
    ]);

    const totalGrossCampaignRevenue = campaigns.reduce(
      (total, campaign) => total + campaign.totalCampaignRevenue,
      0
    );

    // Return the campaigns
    return NextResponse.json(
      { campaigns, totalGrossCampaignRevenue, sliceName: "campaignApi" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return NextResponse.json(
      { message: "Error fetching campaigns", sliceName: "campaignApi" },
      { status: 500 }
    );
  }
}
