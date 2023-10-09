import prisma from "@/lib/Prismadb";
import { NextResponse } from "next/server";

export const GET = async () => {
  const Messages = await prisma.message.findMany();
  console.log(Messages);
  return NextResponse.json(Messages, { status: 200 });
};
