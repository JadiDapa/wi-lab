import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fileUpload } from "@/lib/file-upload";
import { MessageContentType } from "@prisma/client";

export async function GET() {
  try {
    const result = await prisma.message.findMany({
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
    const formData = await req.formData();

    const senderId = formData.get("senderId") as string;
    const recipientId = formData.get("recipientId") as string;
    const content = formData.get("content") as string;
    const contentType = formData.get("contentType") as string;
    const attachment = formData.get("attachment") as File | null;
    const readAt = formData.get("readAt") as string | null;

    let filePath: string | null = null;

    if (attachment && attachment.name) {
      const filename = await fileUpload(attachment, "uploads");
      filePath = `${process.env.NEXT_PUBLIC_BASE_URL}/api/images/${filename}`;
    }

    const result = await prisma.message.create({
      data: {
        senderId,
        recipientId,
        content,
        contentType: contentType as MessageContentType,
        attachment: filePath ?? null,
        readAt: readAt ?? null,
      },
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error: ", error);
    return NextResponse.json(
      { message: "Something went wrong!", error: (error as Error).message },
      { status: 500 },
    );
  }
}
