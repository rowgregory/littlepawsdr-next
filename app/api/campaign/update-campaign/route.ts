import { Campaign } from "@models/campaignModel";
import connectDB from "app/config/db";
import deleteFileFromFirebase from "app/utils/deleteFileFromFirebase";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    if (!body._id) {
      return NextResponse.json(
        { message: "Missing campaignId", sliceName: "campaignApi" },
        { status: 400 }
      );
    }

    const campaign = await Campaign.findById(body._id).select("coverPhotoName");

    if (!campaign) {
      return NextResponse.json(
        { message: "Campaign not found", sliceName: "campaignApi" },
        { status: 404 }
      );
    }

    if (
      body.coverPhotoName &&
      campaign.coverPhotoName &&
      campaign.coverPhotoName !== body.coverPhotoName
    ) {
      await deleteFileFromFirebase(campaign.coverPhotoName, "image");
    }

    const updateData: Record<string, any> = { ...body };

    if (body.title) {
      updateData.title = body.title;
      updateData.customCampaignLink = body.title
        .substring(0, 6)
        .toUpperCase()
        .replace(/\s+/g, "");
    }

    const { _id, ...updateDataWithoutId } = updateData;

    await Campaign.findByIdAndUpdate(body._id, updateDataWithoutId);

    return NextResponse.json({ sliceName: "campaignApi" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error updating campaign", error, sliceName: "campaignApi" },
      { status: 500 }
    );
  }
}
