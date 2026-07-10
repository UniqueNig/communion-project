import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { connectToDatabase } from "@/lib/mongodb";
import Donation from "@/models/Donation";
import { initializePaystackTransaction } from "@/lib/payments/paystack";
import { initializeFlutterwavePayment } from "@/lib/payments/flutterwave";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { name, email, amount, currency } = body as {
    name?: string;
    email?: string;
    amount?: number;
    currency?: string;
  };

  if (!name || typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  }
  if (!email || typeof email !== "string" || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }
  if (currency !== "NGN" && currency !== "USD") {
    return NextResponse.json({ error: "Unsupported currency." }, { status: 400 });
  }
  const minAmount = currency === "NGN" ? 100 : 1;
  if (typeof amount !== "number" || !Number.isFinite(amount) || amount < minAmount) {
    return NextResponse.json({ error: "Please enter a valid amount." }, { status: 400 });
  }

  try {
    await connectToDatabase();
  } catch {
    return NextResponse.json(
      { error: "Giving isn't set up yet. Please check back shortly." },
      { status: 503 }
    );
  }

  const reference = `tcc-${randomUUID()}`;
  const provider = currency === "NGN" ? "paystack" : "flutterwave";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const trimmedName = name.trim();
  const trimmedEmail = email.trim().toLowerCase();

  await Donation.create({
    name: trimmedName,
    email: trimmedEmail,
    amount,
    currency,
    provider,
    reference,
    status: "pending",
  });

  try {
    if (provider === "paystack") {
      const data = await initializePaystackTransaction({
        email: trimmedEmail,
        amountNGN: amount,
        reference,
        callbackUrl: `${siteUrl}/give/solar-media/callback?provider=paystack`,
      });
      return NextResponse.json({ url: data.authorization_url });
    }

    const data = await initializeFlutterwavePayment({
      email: trimmedEmail,
      name: trimmedName,
      amountUSD: amount,
      reference,
      redirectUrl: `${siteUrl}/give/solar-media/callback?provider=flutterwave`,
    });
    return NextResponse.json({ url: data.link });
  } catch (err) {
    await Donation.updateOne({ reference }, { status: "failed" });
    const message =
      err instanceof Error ? err.message : "Payment initialization failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
