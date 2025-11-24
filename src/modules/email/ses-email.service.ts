import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { awsSesConfiguration } from 'src/config';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { AbstractEmailService } from './abstract-email.service';
import { Logger } from 'winston';
import { EmailOptions } from './email.interface';

@Injectable()
export class SesEmailService extends AbstractEmailService {
  private readonly sesClient: SESClient;
  private readonly senderEmail: string;

  constructor(
    @Inject(awsSesConfiguration.KEY)
    private readonly awsSesConfig: ConfigType<typeof awsSesConfiguration>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    super();
    this.sesClient = new SESClient({
      credentials: {
        accessKeyId: awsSesConfig.awsSesAccessKeyId,
        secretAccessKey: awsSesConfig.awsSesAccessSecretAccessKey,
      },
      region: awsSesConfig.awsSesRegion,
    });

    this.senderEmail = awsSesConfig.awsSesSender;
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      // Send email
      const params = {
        Source: `<${this.senderEmail}>`,
        Destination: {
          ToAddresses: Array.isArray(options.to) ? options.to : [options.to],
          ...(options.cc && {
            CcAddresses: Array.isArray(options.cc) ? options.cc : [options.cc],
          }),
          ...(options.bcc && {
            BccAddresses: Array.isArray(options.bcc) ? options.bcc : [options.bcc],
          }),
        },
        Message: {
          Subject: {
            Data: options.subject,
            Charset: 'UTF-8',
          },
          Body: {
            Html: {
              Data: options.htmlContent,
              Charset: 'UTF-8',
            },
          },
        },
      };

      // Send email
      const command = new SendEmailCommand(params);
      const result = await this.sesClient.send(command);

      this.logger.info({
        message: `Email sent successfully to ${options.to}, MessageId: ${result.MessageId}`,
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
