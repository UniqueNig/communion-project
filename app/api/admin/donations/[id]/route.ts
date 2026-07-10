import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, isValidAdminSession } from "@/lib/adminAuth";
import { connectToDatabase } from "@/lib/mongodb";
import Donation from "@/models/Donation";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!isValidAdminSession(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await connectToDatabase();
  } catch (err) {
    console.error("[admin/donations] MongoDB connection failed:", err);
    return NextResponse.json({ error: "Database unavailable." }, { status: 503 });
  }

  await Donation.deleteOne({ _id: id });
  return NextResponse.json({ ok: true });
}
