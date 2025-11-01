import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in to load from cloud" },
        { status: 401 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        gameSaves: {
          orderBy: {
            updatedAt: "desc",
          },
          take: 1,
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (!user.gameSaves || user.gameSaves.length === 0) {
      return NextResponse.json(
        { success: false, message: "No saved game found" },
        { status: 404 }
      );
    }

    const latestSave = user.gameSaves[0];

    return NextResponse.json({
      success: true,
      saveData: latestSave.saveData,
      version: latestSave.version,
      updatedAt: latestSave.updatedAt,
    });
  } catch (error) {
    console.error("[API /load] Error:", error);
    return NextResponse.json(
      { error: "Failed to load game data" },
      { status: 500 }
    );
  }
}
