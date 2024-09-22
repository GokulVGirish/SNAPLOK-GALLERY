import dotenv from "dotenv";
dotenv.config();

export interface IMailer {
  sendMail(email: string): Promise<{ otp: string; success: boolean }>;
  sendPasswordResetLink(
    email: string,
    link: string
  ): Promise<{ success: boolean }>;
}


export const MailerConfig:{user:string;pass:string} = {
  user: process.env.MAILER_USER!,
  pass: process.env.MAILER_PASS!,
};
