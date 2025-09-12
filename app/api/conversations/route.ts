import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const result = await prisma.conversation.findMany({
      orderBy: {
        id: "desc",
      },
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong!", error },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { users } = body;

    if (!users || !Array.isArray(users) || users.length < 2) {
      return NextResponse.json(
        { message: "At least two users are required" },
        { status: 400 },
      );
    }

    // 🔎 Check if a conversation already exists with exactly these users
    const existingConv = await prisma.conversation.findFirst({
      where: {
        users: {
          every: { id: { in: users } }, // all provided users are in the conversation
        },
      },
      include: { users: true },
    });

    if (existingConv) {
      return NextResponse.json(existingConv, { status: 200 });
    }

    // 🚀 If not exists, create
    const result = await prisma.conversation.create({
      data: {
        users: {
          connect: users.map((id: string) => ({ id })),
        },
      },
      include: { users: true },
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating conversation: ", error);
    return NextResponse.json(
      { message: "Something went wrong!", error: (error as Error).message },
      { status: 500 },
    );
  }
}
