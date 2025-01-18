// utils/auth.ts
import { type NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function verifyAuth(request: NextRequest) {
  const token = request.headers.get('authorization')?.split(' ')[1];

  if (!token) {
    return null;
  }

  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    return verified.payload;
  } catch (err) {
    return null;
  }
}