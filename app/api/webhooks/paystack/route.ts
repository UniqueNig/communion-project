import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectToDatabase } from "@/lib/mongodb";
import Donation from "@/models/Donation";
import { verifyPaystackTransaction } from "@/lib/payments/paystack";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");
  const secret = process.env.PAYSTACK_SECRET_KEY;

  if (!secret || !signature) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const expected = crypto.createHmac("sha512", secret).update(rawBody).digest("hex");
  const valid =
    expected.length === signature.length &&
    crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));

  if (!valid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody);

  if (event.event === "charge.success") {
    const reference: string | undefined = event.data?.reference;
    if (reference) {
      await connectToDatabase();
      try {
        const verified = await verifyPaystackTransaction(reference);
        if (verified.status === "success") {
          await Donation.updateOne(
            { reference, status: { $ne: "success" } },
            { status: "success" }
          );
        }
      } catch (err) {
        // Verification call failed; Paystack will retry the webhook.
        console.error("[webhook:paystack] verification failed:", err);
      }
    }
  }

  return NextResponse.json({ received: true });
}
