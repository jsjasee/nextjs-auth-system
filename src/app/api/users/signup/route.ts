import { connect } from "@/src/dbConfig/dbConfig"; // @ is the project's root directory, my-app? so its my-app/src/....
import User from "@/src/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/src/helpers/mailer";

connect();

// post request. it is async because database is in another continent, takes time.
export async function POST(request: NextRequest) {
  // you can also pass in response as the params here? like express or use NextResponse? - NOPE, res is NOT a param that is passed in. have to manually return NextResponse.
  try {
    const reqBody = await request.json();
    const { username, email, password } = reqBody;

    console.log(reqBody);

    // do some validation here - check if user already exists
    const user = await User.findOne({ email });

    if (user && user.isVerified) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 },
      );
    }

    // resend the user the verification email IF the token expires and they try to sign up with the same email again.
    if (user && !user.isVerified) {
      // Resend verification email with fresh token
      await sendEmail(email, "VERIFY", user._id);
      return NextResponse.json({ message: "Verification email resent" });
    }

    // hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // save to database
    const savedUser = await newUser.save();
    console.log(savedUser);

    // send the email for user verification
    await sendEmail(email, "VERIFY", savedUser._id);

    return NextResponse.json(
      {
        message: "User created successfully",
        success: true,
        savedUser,
      },
      { status: 201 },
    ); // what do i need to have in next reponse? need status? - just need the json AND the status, whatever you put the in the json aka the first params is not important.
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
