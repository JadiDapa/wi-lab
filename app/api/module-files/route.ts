import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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

    const moduleId = formData.get("moduleId") as string;
    const filename = formData.get("filename") as string;
    const file = formData.get("file") as File;
    const uploadedById = formData.get("uploadedBy") as string;

    let filePath: string | null = null;

    if (file && file.name) {
      const filename = await fileUpload(file, "uploads");
      filePath = `${process.env.NEXT_PUBLIC_BASE_URL}/api/images/${filename}`;
    }

    const result = await prisma.moduleFile.create({
      data: {
        moduleId: moduleId,
        filename: filename,
        url: filePath ?? "",
        uploadedById: uploadedById,
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
