import { EmailOptions } from './email.interface';

export abstract class AbstractEmailService {
  abstract sendEmail(payload: EmailOptions): Promise<void>;
}