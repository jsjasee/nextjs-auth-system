import { connect } from "@/src/dbConfig/dbConfig";
import User from "@/src/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import crypto from "node:crypto";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { password, confirmPassword, token } = reqBody; // it is okay to send the password in the request BODY in HTTPS requests.
    console.log(reqBody);

    // we need to hash the token again, since the token we received is the RAW token (see mailer.ts)
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // find the user based on the token and the token MUST NOT be expired yet aka greater than now
    const user = await User.findOne({
      forgotPasswordToken: hashedToken,
      forgotPasswordTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 },
      );
    }

    // check if the password match
    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 },
      );
    }

    // if password match, hash it!!
    const hashedPassword = await bcryptjs.hash(password, 10);

    // if user is found, update the user's password and flush out the forgot password token and expiry time
    user.password = hashedPassword;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordTokenExpiry = undefined;

    await user.save();

    return NextResponse.json(
      { message: "Password reset successfully" },
      {
        status: 200,
      },
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
