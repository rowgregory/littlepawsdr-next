import { NextResponse } from "next/server";
import connectDB from "app/config/db";
import { Auction, Campaign } from "@models/campaignModel";
// import AdoptionFee from "@models/adoptionFeeModel";
// import Donation from "@models/donationModel";
// import WelcomeWienerOrder from "@models/welcomeWienerOrderModel";
// import ProductOrder from "@models/productOrderModel";

export async function GET() {
  try {
    await connectDB();

    // const campaigns = await Campaign.find()
    //   .populate([{ path: "auction", select: "settings" }])
    //   .sort({ createdAt: -1 });

    // const campaignsForAdminView = campaigns.map((campaign) => ({
    //   totalCampaignRevenue: parseFloat(
    //     campaign.totalCampaignRevenue.toFixed(2)
    //   ),
    //   title: campaign.title,
    //   _id: campaign._id,
    //   startDate: campaign.auction.settings.startDate,
    // }));

    // const totalAdoptionFeeResult = await AdoptionFee.aggregate([
    //   {
    //     $group: {
    //       _id: null,
    //       totalAdoptionFee: { $sum: "$feeAmount" },
    //     },
    //   },
    // ]);

    // const totalAdoptionFee = totalAdoptionFeeResult.length
    //   ? totalAdoptionFeeResult[0].totalAdoptionFee
    //   : 0;

    // const totalAdoptionFeesCount = await AdoptionFee.countDocuments();

    // const donationCount = await Donation.countDocuments();

    // // Calculate the total donation amount
    // const totalDonationAmount = await Donation.aggregate([
    //   { $group: { _id: null, totalAmount: { $sum: "$donationAmount" } } },
    // ]);

    // // Count the total number of WelcomeWienerOrder documents
    // const welcomeWienerOrderCount = await WelcomeWienerOrder.countDocuments();

    // // Calculate the total price of all orders
    // const totalWelcomeWienerOrdersAmount = await WelcomeWienerOrder.aggregate([
    //   { $group: { _id: null, totalAmount: { $sum: "$totalPrice" } } },
    // ]);

    // const productOrderCount = await ProductOrder.countDocuments();

    // // Calculate the total price of all orders
    // const totalProductOrdersAmount = await ProductOrder.aggregate([
    //   { $group: { _id: null, subtotal: { $sum: "$subtotal" } } },
    // ]);

    return NextResponse.json(
      {
        // campaignsForAdminView,
        // totalGrossCampaignRevenue,
        // totalAdoptionFee,
        // totalAdoptionFeesCount,
        // donationCount,
        // totalDonationAmount: totalDonationAmount[0]?.totalAmount || 0,
        // welcomeWienerOrderCount,
        // totalWelcomeWienerOrdersAmount:
        //   totalWelcomeWienerOrdersAmount[0]?.totalAmount || 0,
        // productOrderCount,
        // totalProductOrdersAmount: totalProductOrdersAmount[0]?.subtotal || 0,
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { message: "Error fetching campaigns.", sliceName: "dashboardApi" },
      { status: 500 }
    );
  }
}
