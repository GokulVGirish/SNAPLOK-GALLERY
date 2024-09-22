import { IMailer } from "../../entities/services/iMailer";
import { MailerConfig } from "../../entities/services/iMailer";
import { generateRandomOTP } from "./generateOtp";
const nodemailer = require("nodemailer");

const sendMail = async (
  email: string,
  content: string,
  type: "otp" | "link"
): Promise<{ success: boolean }> => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: MailerConfig.user,
      pass: MailerConfig.pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  let subject, text;
  if (type == "otp") {
    subject = "Signup Verification Mail from VitaMedica";
    text = `Your OTP is ${content}. Use this OTP to complete your signup process.`;
  } else {
    subject = "Password Reset Request";
    text = `Click on the following link to reset your password: ${content}`;
  }

  const mailOptions = {
    from: MailerConfig.user,
    to: email,
    subject: subject,
    text: text,
  };
  try {
    const response = await transporter.sendMail(mailOptions);
    console.log("Email sent:", response.response);
    return { success: true };
  } catch (error) {
    console.log("error sending email");
    return { success: false };
  }
};


class Mailer implements IMailer {
  async sendMail(email: string): Promise<{ otp: string; success: boolean }> {
    const otp = generateRandomOTP(4);
    const response = await sendMail(email, otp, "otp");
    console.log("otp is", otp);
    return { otp: otp, success: response.success };
  }
  async sendPasswordResetLink(
    email: string,
    link: string
  ): Promise<{ success: boolean }> {
    const response = await sendMail(email, link, "link");
    return { success: response.success };
  }
}
export default Mailer;