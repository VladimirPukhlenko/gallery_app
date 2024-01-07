import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  public async sendKey(name: string, alress: string, key: string) {
    await this.mailerService.sendMail({
      from: {
        name: 'Gallery app',
        address: 'galleryappweb@gmail.com',
      },
      to: alress,
      subject: 'Gallery app | Password recovery 🔑',
      html: `<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: black; text-align: center;">
      <h1 style="font-size: 2em;">
          Hi, <span style="font-weight: bold;">${name}</span> <span style="margin-left: 5px;">👋</span>
      </h1>
      <h2 style="font-size: 1.5em;">Code for your password recovery:</h2>
      <h1 style="font-weight: 900; font-size: 2.5em;">
          <span style="margin-right: 10px;">🔒</span>${key}<span style="margin-left: 10px;">🔓</span>
      </h1>
      <p style="font-size: 1.2em;">
          Do not share this code with anyone. This code will be <b>valid for one hour</b>.
      </p>
  </div>
  `,
    });
  }
}
