import type { Metadata } from "next";
import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, isValidAdminSession } from "@/lib/adminAuth";
import { connectToDatabase } from "@/lib/mongodb";
import Donation from "@/models/Donation";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { DonorTable, type DonationRow } from "@/components/admin/DonorTable";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin | The Communion Center",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!isValidAdminSession(token)) {
    return <AdminLoginForm />;
  }

  let donations: DonationRow[] = [];
  try {
    await connectToDatabase();
    const docs = await Donation.find().sort({ createdAt: -1 }).lean();
    donations = JSON.parse(JSON.stringify(docs));
  } catch (err) {
    console.error("[admin] MongoDB connection failed:", err);
  }

  return <DonorTable donations={donations} />;
}
