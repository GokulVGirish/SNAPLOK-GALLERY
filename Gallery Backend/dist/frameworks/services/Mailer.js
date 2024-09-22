"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const iMailer_1 = require("../../entities/services/iMailer");
const generateOtp_1 = require("./generateOtp");
const nodemailer = require("nodemailer");
const sendMail = async (email, content, type) => {
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: iMailer_1.MailerConfig.user,
            pass: iMailer_1.MailerConfig.pass,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });
    let subject, text;
    if (type == "otp") {
        subject = "Signup Verification Mail from VitaMedica";
        text = `Your OTP is ${content}. Use this OTP to complete your signup process.`;
    }
    else {
        subject = "Password Reset Request";
        text = `Click on the following link to reset your password: ${content}`;
    }
    const mailOptions = {
        from: iMailer_1.MailerConfig.user,
        to: email,
        subject: subject,
        text: text,
    };
    try {
        const response = await transporter.sendMail(mailOptions);
        console.log("Email sent:", response.response);
        return { success: true };
    }
    catch (error) {
        console.log("error sending email");
        return { success: false };
    }
};
class Mailer {
    async sendMail(email) {
        const otp = (0, generateOtp_1.generateRandomOTP)(4);
        const response = await sendMail(email, otp, "otp");
        console.log("otp is", otp);
        return { otp: otp, success: response.success };
    }
    async sendPasswordResetLink(email, link) {
        const response = await sendMail(email, link, "link");
        return { success: response.success };
    }
}
exports.default = Mailer;
