import config from "config";
import nodemailer, { Transporter } from "nodemailer";
import { Message, NotificationTransport } from "./types/notification-types";

export class MailTransport implements NotificationTransport {
  private transporter: Transporter;

  constructor() {
    console.log("MAIL CONFIG:", config.get("mail"));

    this.transporter = nodemailer.createTransport({
      host: config.get("mail.host"),
      port: config.get("mail.port"),
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: config.get("mail.auth.user"),
        pass: config.get("mail.auth.password"),
      },
    });
  }
  async send(message: Message) {
    try {
      const info = await this.transporter.sendMail({
        from: config.get("mail.from"),
        to: message.to,
        subject: message.subject,
        text: message.text,
        html: message.html,
      });

      console.log("Message sent: %s", info.messageId);
    } catch (error) {
      console.error("❌ Failed to send email:", error);
    }
  }
}
