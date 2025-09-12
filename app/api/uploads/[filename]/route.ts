import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";
import mime from "mime-types";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> },
) => {
  const { filename } = await params;
  const filePath = path.join(process.cwd(), "uploads", filename);

  try {
    const file = await fs.readFile(filePath);

    // detect mime type (fallback to octet-stream)
    const mimeType = mime.lookup(filename) || "application/octet-stream";

    return new NextResponse(file, {
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `inline; filename="${filename}"`, // 👈 inline = show in browser if possible
      },
    });
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
};
