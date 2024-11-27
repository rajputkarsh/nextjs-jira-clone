import { HTTP_STATUS } from "@/constants/api";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export function GET(req: Request, { params }: { params: { userId: string } }) {
  try {
    const { userId } = params;
    return NextResponse.json({ userId }, { status: HTTP_STATUS.OK.STATUS });
  } catch (error) {
    return NextResponse.json(
      { message: HTTP_STATUS.INTERNAL_SERVER_ERROR.MESSAGE },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR.STATUS }
    );
  }
}
