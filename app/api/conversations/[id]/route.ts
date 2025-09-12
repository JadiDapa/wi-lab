import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MessageContentType } from "@prisma/client";
import { fileUpload } from "@/lib/file-upload";

declare global {
  var io: import("socket.io").Server;
}

// GET single message by id
export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    const result = await prisma.conversation.findUnique({
      where: { id },
      include: { users: true },
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong!", error },
      { status: 500 },
    );
  }
}

// UPDATE (edit) a message
export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const formData = await req.formData();

    const content = formData.get("content") as string | null;
    const contentType = formData.get("contentType") as string;
    const attachment = formData.get("attachment") as File | null;

    let filePath: string | null = null;
    if (attachment && attachment.name) {
      const filename = await fileUpload(attachment, "uploads");
      filePath = `${process.env.NEXT_PUBLIC_BASE_URL}/api/uploads/${filename}`;
    }

    const updated = await prisma.conversation.update({
      where: { id },
      data: {
        content,
        contentType: contentType as MessageContentType,
        attachment: filePath ?? null,
        edited: true,
      },
      include: {
        sender: { select: { id: true, fullName: true, avatarUrl: true } },
        conversation: true,
      },
    });

    global.io?.to(updated.conversationId).emit("message_edited", updated);

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong!", error },
      { status: 500 },
    );
  }
}

// DELETE (soft delete)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    const deleted = await prisma.conversation.update({
      where: { id },
      data: { deleted: true },
      include: {
        conversation: true,
      },
    });

    global.io?.to(deleted.conversationId).emit("message_deleted", deleted.id);

    return NextResponse.json(
      { success: true, id: deleted.id },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong!", error },
      { status: 500 },
    );
  }
}
