import { connect } from "@/src/dbConfig/dbConfig"; // @ is the project's root directory, my-app? so its my-app/src/....
import User from "@/src/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;

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

    // check if password is correct
    const validPassword = await bcryptjs.compare(password, user.password);

    if (!validPassword) {
      console.log("password is wrong!");
      return NextResponse.json({ error: "Invalid password" }, { status: 400 });
    }

    // once everything is verified, we create a token, encrypt and send this into user cookies (the refresh and access token.)

    // create token data (payload)
    const tokenData = {
      id: user._id, // you can technically find everything with the _id but can include more data if you wish
      username: user.username,
      email: user.email,
    };

    // create token (this takes time so use await)
    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "1d",
    });

    // we haven't send the response yet.
    const response = NextResponse.json(
      {
        message: "Login successful", // this message is a compulsory field - no, only the first field aka the json and the status is important. these fields in the json aka the first {} just determines what the frontend people can access.
        success: true,
      },
      { status: 200 },
    );

    // set cookie to the response
    response.cookies.set("token", token, {
      httpOnly: true,
    });

    // now we return the response.
    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
