import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fileUpload } from "@/lib/file-upload";
import { MessageContentType } from "@prisma/client";

export async function GET() {
  try {
    const result = await prisma.message.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        sender: { select: { id: true, fullName: true, avatarUrl: true } },
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
    const formData = await req.formData();

    const senderId = formData.get("senderId") as string;
    const conversationId = formData.get("conversationId") as string;
    const contentType = formData.get("contentType") as MessageContentType;
    const content = formData.get("content") as string;

    let attachment: string | null = null;

    // Handle FILE or IMAGE
    const file = formData.get("attachment");
    if (file instanceof File) {
      const filename = await fileUpload(file, "uploads");
      attachment = `${process.env.NEXT_PUBLIC_BASE_URL}/api/uploads/${filename}`;
    }

    const message = await prisma.message.create({
      data: {
        senderId,
        conversationId,
        content,
        contentType,
        attachment,
      },
      include: {
        sender: { select: { id: true, fullName: true, avatarUrl: true } },
      },
    });

    // Emit via socket.io
    if (globalThis.io) {
      globalThis.io.to(conversationId).emit("message", message);
    } else {
      console.warn("No global io instance available to emit message");
    }

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Error: ", error);
    return NextResponse.json(
      { message: "Something went wrong!", error: (error as Error).message },
      { status: 500 },
    );
  }
}
