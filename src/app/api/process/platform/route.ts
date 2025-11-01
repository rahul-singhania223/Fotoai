import { NextRequest, NextResponse } from "next/server";
import { isValidUrl } from "@/lib/utils";
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
    const dimensions = formData["dimension"];
    const format = formData["format"];

    const isValidFormData =
      dimensions && format && imageUrl && isValidUrl(imageUrl);
    if (!isValidFormData) {
      return NextResponse.json(
        { success: false, code: "INVALID_DATA", message: "Invalid form data" },
        { status: 400 }
      );
    }

    const url = process.env.RUNPOD_URL! + "/runsync";
    const RUNPOD_API_KEY = process.env.RUNPOD_API_KEY!;

    const input = {
      input: {
        image_url: imageUrl,
        process_type: "PLATFORM",
        settings: {
          dimensions,
          format,
        },
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
      { success: true, message: "Operation was successfull!", data: response },
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
