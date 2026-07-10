import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Donation from "@/models/Donation";
import { verifyFlutterwaveTransaction } from "@/lib/payments/flutterwave";

export async function POST(request: Request) {
  const secretHash = process.env.FLUTTERWAVE_WEBHOOK_SECRET_HASH;
  const signature = request.headers.get("verif-hash");

  if (!secretHash || !signature || signature !== secretHash) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const event = await request.json();

  if (event.event === "charge.completed" && event.data?.status === "successful") {
    const transactionId = event.data.id;
    const reference: string | undefined = event.data.tx_ref;
    if (transactionId && reference) {
      await connectToDatabase();
      try {
        const verified = await verifyFlutterwaveTransaction(transactionId);
        if (verified.status === "successful" && verified.tx_ref === reference) {
          await Donation.updateOne(
            { reference, status: { $ne: "success" } },
            { status: "success" }
          );
        }
      } catch {
        // Verification call failed; Flutterwave will retry the webhook.
      }
    }
  }

  return NextResponse.json({ received: true });
}
