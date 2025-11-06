import bcrypt from 'bcryptjs';
export const hash = async (val: string) => bcrypt.hash(val, 10);
export const verify = async (val: string, h: string) => bcrypt.compare(val, h);