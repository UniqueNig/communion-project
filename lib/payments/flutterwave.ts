const FLW_BASE = "https://api.flutterwave.com/v3";

export async function initializeFlutterwavePayment({
  email,
  name,
  amountUSD,
  reference,
  redirectUrl,
}: {
  email: string;
  name: string;
  amountUSD: number;
  reference: string;
  redirectUrl: string;
}) {
  const res = await fetch(`${FLW_BASE}/payments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tx_ref: reference,
      amount: amountUSD,
      currency: "USD",
      redirect_url: redirectUrl,
      customer: { email, name },
      customizations: {
        title: "TCC Solar & Media Project",
        description: "Partnership gift toward TCC's solar & media upgrade",
      },
    }),
  });

  const data = await res.json();
  if (!res.ok || data.status !== "success") {
    throw new Error(data.message ?? "Flutterwave initialization failed");
  }
  return data.data as { link: string };
}

export async function verifyFlutterwaveTransaction(transactionId: string) {
  const res = await fetch(`${FLW_BASE}/transactions/${transactionId}/verify`, {
    headers: { Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}` },
  });
  const data = await res.json();
  if (!res.ok || data.status !== "success") {
    throw new Error(data.message ?? "Flutterwave verification failed");
  }
  return data.data as { status: string; tx_ref: string; amount: number; currency: string };
}
