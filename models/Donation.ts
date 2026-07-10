import mongoose, { Schema, type InferSchemaType } from "mongoose";

const DonationSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    amount: { type: Number, required: true }, // major currency unit (naira or dollars)
    currency: { type: String, enum: ["NGN", "USD"], required: true },
    provider: { type: String, enum: ["paystack", "flutterwave"], required: true },
    reference: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    campaign: { type: String, default: "solar-media" },
  },
  { timestamps: true }
);

export type Donation = InferSchemaType<typeof DonationSchema>;

export default mongoose.models.Donation ??
  mongoose.model("Donation", DonationSchema);
