// 1. one way of verifying is have a url that verifies the token when user clicks on it? like
// domain.com/verifytoken/somerandomtoken (this is better for server/backend component)
// this way we can extract the token from the params, like the backend code previously with the [] ?

// 2. another way is to send the token in the email, and have the user click on the link in the email - this way is to extract using window.location.search (this is for client / frontend component)
// domain.com/verifytoken?token=somerandomtoken

import nodemailer from "nodemailer";
import User from "@/src/models/userModel";
import bcryptjs from "bcryptjs";

export const sendEmail = async (
  email: string,
  emailType: string,
  userId: string,
) => {
  try {
    // create a hashed token
    const hashedToken = await bcryptjs.hash(userId.toString(), 10); // generate some random string so that we can match it later? is there a flow chart or framework etc...?? why do we need this??

    // usually we put the "VERIFY" and "RESET" in an enum and check against that enum.
    if (emailType === "VERIFY") {
      // find the user and add the token to the user document.
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000, // this is in milliseconds
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000, // this is in milliseconds
      });
    }

    // create a transport
    const transport = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: Number(process.env.MAIL_PORT),
      auth: {
        user: process.env.MAILTRAP_USER, // do i need to set up my process.env using dotenv like in express for nextjs?
        pass: process.env.MAILTRAP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.MAILTRAP_FROM,
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: `<p>Click <a href="${
        process.env.DOMAIN
      }/${emailType === "VERIFY" ? "verifyemail" : "resetpassword"}?token=${hashedToken}">here</a> to ${
        emailType === "VERIFY" ? "verify your email" : "reset your password"
      }</p>`,
    };
    // so the path should be something like /verifyemail?token=${hashedToken}

    // send the email
    const mailresponse = await transport.sendMail(mailOptions);

    return mailresponse; // optional to return mailresponse!
  } catch (error: any) {
    throw new Error(error.message);
  }
};
