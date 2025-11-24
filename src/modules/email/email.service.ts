import { Injectable } from '@nestjs/common';
import { AbstractEmailService } from './abstract-email.service';
import {
  ResetPasswordMailPayload,
} from './email.interface';
import { EMAIL_SUBJECT } from './email.constant';

@Injectable()
export class EmailService {
  constructor(private readonly emailProvider: AbstractEmailService) {}

  async forgotPasswordMailer(payload: ResetPasswordMailPayload): Promise<void> {
    const htmlContent = this.generateForgotPasswordHtml(payload);

    await this.emailProvider.sendEmail({
      to: payload.email,
      subject: EMAIL_SUBJECT.RESET_PASSWORD,
      htmlContent,
    });
  }

  private generateForgotPasswordHtml(payload: ResetPasswordMailPayload): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          .button {
            background-color: #4CAF50; /* Green */
            border: none;
            color: white;
            padding: 15px 32px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            border-radius: 4px;
            cursor: pointer;
          }
          .container {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
            background-color: #f9f9f9;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>${payload.title}</h2>
          <p>Hello <strong>${payload?.fullName || ''}</strong>,</p>
          
          <p>We received a request to reset the password for your account. Please click the button below to proceed:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${payload.resetPasswordUrl}" class="button" style="color: white;">Reset Password</a>
          </div>

          <p>If the button above doesn't work, you can copy and paste the following link into your browser:</p>
          <p><a href="${payload.resetPasswordUrl}" style="color: #4CAF50; word-break: break-all;">${payload.resetPasswordUrl}</a></p>
          
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          
          <p style="font-size: 12px; color: #777;">
            If you did not request a password reset, please ignore this email. Your account remains safe.
          </p>
        </div>
      </body>
      </html>
    `;
  }
}
