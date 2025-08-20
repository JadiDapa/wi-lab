import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

export const GET = async (
  req: NextRequest,
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> },
) => {
  const { filename } = await params;
  const filePath = path.join(process.cwd(), "uploads", filename);

  try {
    const file = await fs.readFile(filePath);
    return new NextResponse(file, {
      headers: { "Content-Type": "image/jpeg" },
    });
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
};
