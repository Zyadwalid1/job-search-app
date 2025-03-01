import nodemailer from "nodemailer";
import { EventEmitter } from "events";
import { sendEmailEvent } from "../../../constants.js";

export const myEventEmitter = new EventEmitter();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_PASS,
  },
});

export async function sendEmail(receiverEmail, subject, html) {
  // send mail with defined transport object
  await transporter.sendMail({
    from: `Job Search application 📕📢 <${process.env.SENDER_EMAIL}>`, // sender address
    to: receiverEmail, // list of receivers
    subject, // Subject line
    html, // html body
  });
}

myEventEmitter.on(sendEmailEvent, sendEmail);
