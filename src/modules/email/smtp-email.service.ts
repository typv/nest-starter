import * as nodemailer from 'nodemailer';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { smtpConfiguration } from 'src/config';
import { AbstractEmailService } from './abstract-email.service';
import { Logger } from 'winston';
import { EmailOptions } from './email.interface';

@Injectable()
export class SmtpEmailService extends AbstractEmailService {
  private readonly transporter: nodemailer.Transporter;
  private readonly senderEmail: string;

  constructor(
    @Inject(smtpConfiguration.KEY)
    private readonly smtpConfig: ConfigType<typeof smtpConfiguration>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    super();
    this.transporter = nodemailer.createTransport({
      host: this.smtpConfig.smtpHost,
      port: +this.smtpConfig.smtpPort,
      secure: this.smtpConfig.smtpSecure,
      auth: {
        user: this.smtpConfig.smtpUser,
        pass: this.smtpConfig.smtpPassword,
      },
      logger: false,
      debug: false,
    });

    this.senderEmail = this.smtpConfig.smtpSender;
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      // Send email
      const result = await this.transporter.sendMail({
        from: `"EFDA-MVC Support" <${this.senderEmail}>`,
        to: Array.isArray(options.to) ? options.to : [options.to],
        cc: options.cc
          ? Array.isArray(options.cc)
            ? options.cc
            : [options.cc]
          : undefined,
        bcc: options.bcc
          ? Array.isArray(options.bcc)
            ? options.bcc
            : [options.bcc]
          : undefined,
        subject: options.subject,
        html: options.htmlContent,
      });

      this.logger.info({
        message: `Email sent successfully to ${options.to}, MessageId: ${result.messageId}`,
        context: 'EmailService.sendEmail',
      });
    } catch (error) {
      this.logger.error({
        message: `Failed to send email to ${options.to}`,
        context: 'EmailService.sendEmail',
        error: error,
      });
    }
  }
}
