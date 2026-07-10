import { connectToDatabase } from "@/lib/mongodb";
import Donation from "@/models/Donation";

export const CAMPAIGN_GOAL_NGN = 10_000_000;

export async function getCampaignProgress() {
  const usdRate = Number(process.env.USD_TO_NGN_RATE) || 1600;

  try {
    await connectToDatabase();

    const totals = await Donation.aggregate([
      { $match: { status: "success", campaign: "solar-media" } },
      { $group: { _id: "$currency", total: { $sum: "$amount" } } },
    ]);

    const ngn = totals.find((t) => t._id === "NGN")?.total ?? 0;
    const usd = totals.find((t) => t._id === "USD")?.total ?? 0;

    const raisedNGN = ngn + usd * usdRate;
    const percent = Math.min(100, Math.round((raisedNGN / CAMPAIGN_GOAL_NGN) * 100));

    return { raisedNGN, goalNGN: CAMPAIGN_GOAL_NGN, percent, usdRate };
  } catch {
    // MONGODB_URI not configured yet, or DB unreachable. Show an empty
    // thermometer rather than crashing the page.
    return { raisedNGN: 0, goalNGN: CAMPAIGN_GOAL_NGN, percent: 0, usdRate };
  }
}
