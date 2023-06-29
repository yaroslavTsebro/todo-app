import {config} from "../config/config";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import logger from "../config/logger";

export class Mailer {
  private readonly SENDER = config.mailer.username;
  private readonly FROM = config.mailer.from;
  private readonly PASSWORD = config.mailer.password;
  private readonly PORT = config.mailer.port;
  private readonly SECURITY = config.mailer.security;
  private readonly HOST = config.mailer.host;
  private transporter;

  constructor() {
    const transporterOptions: SMTPTransport.Options = {
      host: this.HOST,
      port: this.PORT,
      secure: this.SECURITY,
      auth: {
        user: this.SENDER,
        pass: this.PASSWORD,
      },
    };

    this.transporter = nodemailer.createTransport(transporterOptions)
  }

  async sendActivationLink(receiver: string, link: string): Promise<void> {
    try {
      logger.info("Sending activation link started");
      logger.info("Receiver: ", receiver);
      logger.info("Link: ", link);
      await this.transporter.sendMail({
        from: this.FROM,
        to: receiver,
        subject: `Account activation link for site ${config.server.url}`,
        text: '',
        html: `
                    <div>
                        <h1>For activation tap this link</h1>
                        <a href="${link}">${link}</a>
                    </div>
                `
      })
    } catch (e) {
      logger.error("An Error occurred during sending email", e)
    }
  }
}