import * as bcrypt from 'bcrypt';

export async function generateAndHashAccessCode(length = 6) {
  const code = Math.random().toString(36).slice(-length).toUpperCase();
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(code, salt);
  return { code, hash };
}