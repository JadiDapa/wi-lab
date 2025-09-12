import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function GET() {
  try {
    const result = await prisma.user.findMany({
      orderBy: {
        id: "desc",
      },
      include: {
        teacher: true,
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

    const { email, fullName, role, nim, nip, department, bio, avatarUrl } =
      body;

    const result = await prisma.user.create({
      data: {
        email: email ?? "",
        fullName: fullName ?? "",
        role: role as Role,
        nim: nim ?? "",
        nip: nip ?? "",
        department: department ?? "",
        bio: bio ?? "",
        avatarUrl: avatarUrl ?? "",
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
