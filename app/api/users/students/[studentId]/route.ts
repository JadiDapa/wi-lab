// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// export async function GET(
//   request: Request,
//   { params }: { params: Promise<{ studentId: string }> },
// ) {
//   try {
//     const { studentId } = await params;
//     const result = await prisma.user.findUnique({
//       where: {
//         studentId: studentId,
//       },
//       include: {
//         conversations: {
//           include: {
//             users: true,
//             messages: {
//               take: 20, // 👈 only last 20 messages
//               orderBy: { createdAt: "desc" },
//             },
//           },
//         },
//       },
//     });
//     return NextResponse.json(result, { status: 200 });
//   } catch (error) {
//     if (error instanceof Error) {
//       console.log("Error: ", error.stack);
//     }
//     return NextResponse.json(
//       { message: "Something went wrong!", error },
//       { status: 500 },
//     );
//   }
// }
