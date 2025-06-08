import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { cookies } from "next/headers";

async function handleSignOut() {
  const session = await getServerSession(authOptions);

  const cookieStore = cookies();
  cookieStore.delete("next-auth.session-token");
  cookieStore.delete("next-auth.callback-url");
  cookieStore.delete("next-auth.csrf-token");

  return NextResponse.json({ success: true });
}

export async function GET() {
  return handleSignOut();
}

export async function POST() {
  return handleSignOut();
}