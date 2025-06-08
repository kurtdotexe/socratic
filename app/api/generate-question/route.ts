import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { concept } = body;

    if (!concept) {
      return NextResponse.json(
        { error: "Concept is required" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      question: "What would you like to explore about " + concept + "?",
      options: ["Basic concepts", "Real-world applications", "Historical context", "Advanced topics"],
      correctAnswer: 0
    });
  } catch (error) {
    console.error("Error generating question:", error);
    return NextResponse.json(
      { error: "Error generating question" },
      { status: 500 }
    );
  }
} 