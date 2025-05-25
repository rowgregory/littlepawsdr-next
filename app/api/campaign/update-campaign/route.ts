import { Campaign } from "@models/campaignModel";
import connectDB from "app/config/db";
import deleteFileFromFirebase from "app/utils/deleteFileFromFirebase";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function PUT(req: NextRequest) {
  let session: mongoose.ClientSession | null = null;

  try {
    await connectDB();
    session = await mongoose.startSession();
    session.startTransaction();

    const body = await req.json();

    if (!body._id) {
      await session.endSession();
      return NextResponse.json(
        { message: "Missing campaignId", sliceName: "campaignApi" },
        { status: 400 }
      );
    }

    const campaign = await Campaign.findById(body._id)
      .select("coverPhotoName")
      .session(session);

    if (!campaign) {
      await session.abortTransaction();
      await session.endSession();
      return NextResponse.json(
        { message: "Campaign not found", sliceName: "campaignApi" },
        { status: 404 }
      );
    }

    const hasNewCoverPhoto =
      body.coverPhotoName &&
      campaign.coverPhotoName &&
      campaign.coverPhotoName !== body.coverPhotoName;

    if (hasNewCoverPhoto) {
      try {
        await deleteFileFromFirebase(campaign.coverPhotoName, "image");
      } catch (firebaseError) {
        await session.abortTransaction();
        await session.endSession();
        return NextResponse.json(
          {
            message: "Failed to delete old cover photo",
            error: firebaseError,
            sliceName: "campaignApi",
          },
          { status: 500 }
        );
      }
    }

    const updateData: Record<string, any> = { ...body };

    if (body.title) {
      updateData.customCampaignLink = body.title
        .substring(0, 6)
        .toUpperCase()
        .replace(/\s+/g, "");
    }

    const { _id, ...updateDataWithoutId } = updateData;

    await Campaign.findByIdAndUpdate(body._id, updateDataWithoutId, {
      session,
    });

    await session.commitTransaction();
    await session.endSession();

    return NextResponse.json({ sliceName: "campaignApi" }, { status: 200 });
  } catch (error) {
    if (session) {
      await session.abortTransaction();
      await session.endSession();
    }

    return NextResponse.json(
      { message: "Error updating campaign", error, sliceName: "campaignApi" },
      { status: 500 }
    );
  }
}
