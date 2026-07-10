import Link from "next/link";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { connectToDatabase } from "@/lib/mongodb";
import Donation from "@/models/Donation";
import { verifyPaystackTransaction } from "@/lib/payments/paystack";
import { verifyFlutterwaveTransaction } from "@/lib/payments/flutterwave";

export const dynamic = "force-dynamic";

type ResolvedSearchParams = {
  provider?: string;
  reference?: string;
  trxref?: string;
  tx_ref?: string;
  transaction_id?: string;
};

type Status = "success" | "pending" | "failed";

async function resolveStatus(params: ResolvedSearchParams): Promise<Status> {
  await connectToDatabase();

  if (params.provider === "paystack") {
    const reference = params.reference ?? params.trxref;
    if (!reference) return "failed";
    try {
      const verified = await verifyPaystackTransaction(reference);
      if (verified.status === "success") {
        await Donation.updateOne(
          { reference, status: { $ne: "success" } },
          { status: "success" }
        );
        return "success";
      }
      return "failed";
    } catch {
      return "pending";
    }
  }

  if (params.provider === "flutterwave") {
    const reference = params.tx_ref;
    const transactionId = params.transaction_id;
    if (!reference || !transactionId) return "failed";
    try {
      const verified = await verifyFlutterwaveTransaction(transactionId);
      if (verified.status === "successful" && verified.tx_ref === reference) {
        await Donation.updateOne(
          { reference, status: { $ne: "success" } },
          { status: "success" }
        );
        return "success";
      }
      return "failed";
    } catch {
      return "pending";
    }
  }

  return "failed";
}

const CONTENT: Record<
  Status,
  { icon: typeof CheckCircle2; color: string; title: string; body: string }
> = {
  success: {
    icon: CheckCircle2,
    color: "text-gold-400",
    title: "Thank you for your gift!",
    body: "Your partnership has been received. A confirmation has been sent to your email. May God bless you richly for standing with TCC.",
  },
  pending: {
    icon: Clock,
    color: "text-violet-400",
    title: "We're confirming your payment",
    body: "Your payment is being processed. This can take a minute. Refresh this page shortly, or check your email for confirmation.",
  },
  failed: {
    icon: XCircle,
    color: "text-red-400",
    title: "We couldn't confirm this payment",
    body: "If an amount was debited from your account, please contact us with your reference so we can help. Otherwise, feel free to try again.",
  },
};

export default async function CallbackPage({
  searchParams,
}: {
  searchParams: Promise<ResolvedSearchParams>;
}) {
  const params = await searchParams;
  const status = await resolveStatus(params);
  const { icon: Icon, color, title, body } = CONTENT[status];

  return (
    <div className="min-h-screen bg-background bg-mesh-dawn text-foreground flex items-center justify-center px-6">
      <div className="glass-panel rounded-3xl p-10 max-w-md text-center">
        <Icon className={`mx-auto ${color}`} size={48} />
        <h1 className="mt-6 font-display text-2xl font-bold">{title}</h1>
        <p className="mt-3 text-foreground/70">{body}</p>
        <Link
          href="/give/solar-media"
          className="mt-8 inline-block rounded-full bg-linear-to-r from-gold-500 to-gold-600 px-6 py-3 font-display font-semibold text-charcoal-950"
        >
          Back to the project page
        </Link>
      </div>
    </div>
  );
}
