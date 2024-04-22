import * as bcrypt from 'bcrypt';

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

export async function checkPassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  console.log('checkPassword: ', password, hashedPassword);
  return await bcrypt.compareSync(password, hashedPassword);
}
