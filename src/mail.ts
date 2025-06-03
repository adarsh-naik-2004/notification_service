import { Config } from "./config/index";
import nodemailer, { Transporter } from "nodemailer";
import { Message, NotificationTransport } from "./types/notification-types";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export class MailTransport implements NotificationTransport {
  private transporter: Transporter;

  constructor() {
    
    this.transporter = nodemailer.createTransport({
      host: Config.mail.host,
      port: parseInt(Config.mail.port),
      secure: true, 
      auth: {
        user: Config.mail.auth.user,
        pass: Config.mail.auth.password,
      },
    } as SMTPTransport.Options
  );
  }
  async send(message: Message) {
    try {
      const info = await this.transporter.sendMail({
        from: Config.mail.from,
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
