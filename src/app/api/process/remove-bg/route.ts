import { isValidUrl } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import axios from "axios";

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          code: "UNAUTHORIZED",
          error: "User not authenticated!",
        },
        { status: 401 }
      );
    }

    // get db user
    const dbUser = await db.user.findUnique({
      where: { user_id: user.id },
    });
    if (!dbUser) {
      return NextResponse.json(
        {
          success: false,
          code: "UNAUTHORIZED",
          error: "User not authenticated!",
        },
        { status: 401 }
      );
    }

    // check for credits
    const requiredCredits = 20;
    if (dbUser.credits < requiredCredits)
      return NextResponse.json(
        {
          success: false,
          code: "INSUFFICIENT_CREDITS",
          message: "Insufficient credits!",
        },
        { status: 402 }
      );

    const formData = await request.json();
    const imageUrl = formData["image_url"];

    // check if valid image URL
    if (!imageUrl || !isValidUrl(imageUrl)) {
      return NextResponse.json(
        { success: false, code: "INVALID_DATA", message: "Invalid image URL" },
        { status: 400 }
      );
    }

    // runpod call
    const url = process.env.RUNPOD_URL! + "/runsync";
    const RUNPOD_API_KEY = process.env.RUNPOD_API_KEY!;

    const input = {
      input: {
        image_url: imageUrl,
        process_type: "REMOVE_BACKGROUND",
        settings: {},
      },
    };

    const response = await axios.post(url, input, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RUNPOD_API_KEY}`,
      },
    });
   

    // update user credits
    await db.user.update({
      where: { user_id: user.id },
      data: { credits: dbUser.credits - requiredCredits },
    });

    return NextResponse.json(
      { success: true, message: "Operation was successfull!", data: response.data },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error);
    console.log(error.response);
    return NextResponse.json(
      {
        success: false,
        code: "SERVER_ERROR",
        message: error.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
