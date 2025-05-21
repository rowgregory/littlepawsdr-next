import { Auction, Campaign } from "@models/campaignModel";
import connectDB from "app/config/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { title } = await req.json();

    const auction = await Auction.create({});

    const customCampaignLink = title
      .substring(0, 6)
      .toUpperCase()
      .replace(/\s+/g, "");

    const campaign = await Campaign.create({
      auction: auction._id,
      title: title,
      customCampaignLink,
    });

    await Auction.findByIdAndUpdate(
      auction?._id,
      { campaign: campaign?._id },
      { new: true }
    );

    return NextResponse.json(
      { campaignId: campaign?._id, sliceName: "campaignApi" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating campaign", sliceName: "campaignApi" },
      { status: 500 }
    );
  }
}
