import { connect } from "@/src/dbConfig/dbConfig";
import User from "@/src/models/userModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { token } = reqBody; // we are assuming the frontend will make a request to the backend with the token in the request body, or another method is that the token could have been in the url params??
    console.log(token);

    // find the user based on the verify token AND when the verify token expiry where the expiry date is GREATER THAN now.
    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 },
      );
    }

    // if user is found, update the user's verified status to true and flush out the verified token and expiry time
    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;

    await user.save({ validateBeforeSave: false }); // save without validation? to prevent triggering the prehooks for the password hashing if there are any.

    return NextResponse.json(
      { message: "Email verified successfully" },
      {
        status: 200,
      },
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
