import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { fileUpload } from "@/lib/file-upload";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const result = await prisma.user.findUnique({
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

    const email = formData.get("email") as string;
    const fullName = formData.get("fullName") as string;
    const role = (formData.get("role") as string) ?? null;
    const nim = formData.get("nim") as string;
    const nip = formData.get("nip") as string;
    const bio = formData.get("bio") as string;

    const avatarUrlFile = formData.get("avatarUrl") as File | null;

    let filePath: string | null = null;
    if (avatarUrlFile && avatarUrlFile.size > 0) {
      const uploadedFilename = await fileUpload(avatarUrlFile, "uploads");
      filePath = `${process.env.NEXT_PUBLIC_BASE_URL}/api/uploads/${uploadedFilename}`;
    }

    const result = await prisma.user.update({
      where: { id },
      data: {
        email: email ?? "",
        fullName: fullName ?? "",
        role: role as Role,
        nim: nim ?? "",
        nip: nip ?? "",
        bio: bio ?? "",
        ...(filePath ? { avatarUrl: filePath } : {}), // ✅ only update if new file uploaded
      },
      include: {
        teacher: true,
        students: true,
      },
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error: ", error.stack);
    }
    return NextResponse.json(
      { message: "Something went wrong!", error: error.message },
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
    const result = await prisma.user.delete({
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
