import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ModuleVisibility } from "@prisma/client";
import { fileUpload } from "@/lib/file-upload";

export async function GET() {
  try {
    const result = await prisma.moduleFile.findMany({
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

    const moduleId = formData.get("moduleId") as string; // TODO: replace with session user
    const url = formData.get("url") as File;
    const filename = (formData.get("filename") as string) ?? null;
    const uploadedById = (formData.get("uploadedById") as string) ?? "TEXT";

    let filePath: string | null = null;
    if (url && url instanceof File && url.name) {
      const uploadedFilename = await fileUpload(url, "uploads");
      filePath = `${process.env.NEXT_PUBLIC_BASE_URL}/api/uploads/${uploadedFilename}`;
    }

    if (!filePath) {
      throw new Error("File upload failed or no file provided.");
    }

    const result = await prisma.moduleFile.create({
      data: {
        moduleId,
        url: filePath,
        filename: filename,
        uploadedById,
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
