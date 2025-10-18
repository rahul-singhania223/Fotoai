import { isValidUrl } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import runpod from "@/config/runpod";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

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
    if (!runpod)
      return NextResponse.json(
        {
          success: false,
          code: "RUNPOD_ERROR",
          message: "Runpod not initialized",
        },
        { status: 500 }
      );

    const input = {
      input: {
        image_url: imageUrl,
        process_type: "REMOVE_BG",
        settings: {},
      },
    };

    const response = await runpod.runSync(input);
    if (!response)
      return NextResponse.json(
        {
          success: false,
          code: "RUNPOD_ERROR",
          message: "Operation failed!",
          data: response,
        },
        { status: 500 }
      );

    // update user credits
    await db.user.update({
      where: { user_id: user.id },
      data: { credits: dbUser.credits - requiredCredits },
    });

    return NextResponse.json(
      { success: true, message: "Operation was successfull!", data: response },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error.message);
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
