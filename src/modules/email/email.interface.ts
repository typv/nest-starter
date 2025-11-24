export interface EmailOptions {
  from?: string;
  to: string | string[];
  subject: string;
  cc?: string | string[];
  bcc?: string | string[];
  htmlContent: string;
}

export interface ResetPasswordMailPayload {
  email: string;
  title: string;
  fullName: string;
  resetPasswordUrl: string;
}
