export function generateRandomToken(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function generateSixDigitCode(): string {
  const code = Math.floor(Math.random() * 1_000_000);
  return code.toString().padStart(6, '0');
}
