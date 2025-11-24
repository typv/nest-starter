import * as bcrypt from 'bcryptjs';

export async function hashData(data: string): Promise<string> {
  const salt = await bcrypt.genSalt();
  return await bcrypt.hash(data, salt);
}

export async function verifyHashed(data: string, encrypted: string): Promise<boolean> {
  return bcrypt.compare(data, encrypted);
}
