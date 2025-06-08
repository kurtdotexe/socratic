import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isValid = await compare(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { 
        message: "Signed in successfully",
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in signin:", error);
    return NextResponse.json(
      { error: "Error signing in" },
      { status: 500 }
    );
  }
}
