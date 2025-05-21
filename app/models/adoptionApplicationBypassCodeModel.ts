import mongoose from "mongoose";

const adoptionApplicationBypassCodeSchema = new mongoose.Schema(
  {
    bypassCode: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const AdoptionApplicationBypassCode =
  mongoose.models.AdoptionApplicationBypassCode ||
  mongoose.model(
    "AdoptionApplicationBypassCode",
    adoptionApplicationBypassCodeSchema
  );

export default AdoptionApplicationBypassCode;
