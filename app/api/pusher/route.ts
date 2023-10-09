import prisma from "@/lib/Prismadb";
import { NextRequest, NextResponse } from "next/server";
import Pusher from "pusher";

export const POST = async (req: NextRequest, res: NextResponse) => {
  const body = await req.json();
  const { newMessage }: { newMessage: string } = body;
  console.log(newMessage);
  const Message = await prisma.message.create({
    data: {
      message: newMessage,
      user: {
        connect: {
          email: "harshil2@gmail.com",
        },
      },
    },
  });

  const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.PUSHER_APP_KEY!,
    secret: process.env.PUSHER_APP_SECRET!,
    cluster: process.env.PUSHER_APP_CLUSTER!,
    useTLS: true,
  });

  pusher.trigger("my-channel", "my-event", {
    message: newMessage,
  });
  console.log(Message);
  return NextResponse.json(Message, { status: 200 });
};
