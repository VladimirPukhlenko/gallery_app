import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  public async sendKey(name: string, alress: string, key: string) {
    await this.mailerService.sendMail({
      from: {
        name: 'Gallery app',
        address: 'galleryappweb@gmail.com',
      },
      to: alress,
      subject: 'Gallery app | Password recovery 🔑',
      html: `<div style="font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;color:black"">
      <h1 style="text-align:center; display: flex; gap:10px; align-items:center;">
      Hi, ${name} <span style="margin-left:10px">👋</span>
      </h1>
      <h2>Code for your password recovery:</h2>
      <h1
        style="
          font-weight: 900;
          text-align: center;
          font-size: 30px;
          display: flex;
          align-items:center;
          justify-content: center;
        "
      >
      <span style="margin-right:20px">🔒</span>
        ${key}
        <span style="margin-left:20px">🔓</span>
      </h1>
      <p style="font-size: medium">
        Do not share this code with anyone. This code will be <b style="text-decoration: underline;">valid for one hour</b>.
      </p>
    </div>`,
    });
  }
}
