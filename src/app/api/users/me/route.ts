// this file is to get some data from the token
import { getDataFromToken } from "@/src/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import User from "@/src/models/userModel";
import { connect } from "@/src/dbConfig/dbConfig";
import next from "next";

connect();

export async function GET(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request); // this will throw an error if there is no token

    const user = await User.findById(userId).select("-password"); // findOne also works

    return NextResponse.json({ message: "User found", matchedUser: user });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
