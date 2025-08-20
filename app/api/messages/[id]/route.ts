import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MessageContentType } from "@prisma/client";
import { fileUpload } from "@/lib/file-upload";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const result = await prisma.message.findUnique({
      where: {
        id: id,
      },
    });
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error: ", error.stack);
    }
    return NextResponse.json(
      { message: "Something went wrong!", error },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const formData = await req.formData();

    const senderId = formData.get("senderId") as string;
    const recipientId = formData.get("recipientId") as string;
    const content = formData.get("content") as string;
    const contentType = formData.get("contentType") as string;
    const attachment = formData.get("attachment") as File | null;
    const readAt = formData.get("readAt") as string | null;
    const edited = formData.get("edited") === "true";

    let filePath: string | null = null;

    if (attachment && attachment.name) {
      const filename = await fileUpload(attachment, "uploads");
      filePath = `${process.env.NEXT_PUBLIC_BASE_URL}/api/images/${filename}`;
    }

    const result = await prisma.message.update({
      where: {
        id: id,
      },
      data: {
        senderId,
        recipientId,
        content,
        contentType: contentType as MessageContentType,
        attachment: filePath ?? null,
        readAt: readAt ?? null,
        edited: edited ?? false,
      },
    });
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error: ", error.stack);
    }
    return NextResponse.json(
      { message: "Something went wrong!", error },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const result = await prisma.message.delete({
      where: {
        id: id,
      },
    });
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error: ", error.stack);
    }
    return NextResponse.json(
      { message: "Something went wrong!", error },
      { status: 500 },
    );
  }
}
