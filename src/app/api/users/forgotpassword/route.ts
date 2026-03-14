import { connect } from "@/src/dbConfig/dbConfig";
import User from "@/src/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "@/src/helpers/mailer";

connect();

// this function just checks if the user exists for the /forgotpassword route
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email } = reqBody; // ALWAYS check the frontend, the axios request line to see what is the request body, it comes after the route, like "/api/users/forgotpassword"

    console.log(reqBody);

    // check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      console.log("user does not exist!");
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 400 },
      );
    }

    // if user does exist, then we generate a token and send it to the user's email address.
    await sendEmail(email, "RESET", user._id);

    return NextResponse.json(
      { message: "Email sent successfully", success: true },
      {
        status: 200,
      },
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
