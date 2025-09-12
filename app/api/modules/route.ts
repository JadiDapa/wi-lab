import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ModuleVisibility } from "@prisma/client";

export async function GET() {
  try {
    const result = await prisma.module.findMany({
      orderBy: {
        createdAt: "desc",
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
    // Parse JSON body
    const body = await req.json();

    const { title, slug, description, visibility, authorId } = body;

    const result = await prisma.module.create({
      data: {
        title: title ?? "",
        slug: slug ?? "",
        description: description ?? "",
        visibility: visibility as ModuleVisibility,
        authorId: authorId ?? "",
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
