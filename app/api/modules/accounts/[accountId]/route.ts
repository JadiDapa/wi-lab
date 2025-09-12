import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ accountId: string }> },
) {
  try {
    const { accountId } = await params;
    const result = await prisma.module.findMany({
      where: {
        authorId: accountId,
      },
      include: {
        author: {
          select: {
            fullName: true,
          },
        },
        files: true,
      },
      orderBy: {
        createdAt: "desc",
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
