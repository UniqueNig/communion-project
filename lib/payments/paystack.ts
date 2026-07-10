const PAYSTACK_BASE = "https://api.paystack.co";

export async function initializePaystackTransaction({
  email,
  amountNGN,
  reference,
  callbackUrl,
}: {
  email: string;
  amountNGN: number;
  reference: string;
  callbackUrl: string;
}) {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      amount: Math.round(amountNGN * 100), // kobo
      currency: "NGN",
      reference,
      callback_url: callbackUrl,
    }),
  });

  const data = await res.json();
  if (!res.ok || !data.status) {
    throw new Error(data.message ?? "Paystack initialization failed");
  }
  return data.data as {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export async function verifyPaystackTransaction(reference: string) {
  const res = await fetch(
    `${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`,
    { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` } }
  );
  const data = await res.json();
  if (!res.ok || !data.status) {
    throw new Error(data.message ?? "Paystack verification failed");
  }
  return data.data as {
    status: string;
    reference: string;
    amount: number;
    currency: string;
  };
}
