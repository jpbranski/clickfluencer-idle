import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in to save to cloud" },
        { status: 401 }
      );
    }

    const saveData = await request.json();

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Upsert the game save
    const gameSave = await prisma.gameSave.upsert({
      where: {
        userId: user.id,
      },
      update: {
        saveData,
        version: { increment: 1 },
      },
      create: {
        userId: user.id,
        saveData,
        version: 1,
      },
    });

    return NextResponse.json({
      success: true,
      version: gameSave.version,
      updatedAt: gameSave.updatedAt,
    });
  } catch (error) {
    console.error("[API /save] Error:", error);
    return NextResponse.json(
      { error: "Failed to save game data" },
      { status: 500 }
    );
  }
}
