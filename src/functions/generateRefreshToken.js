import jwt from 'jsonwebtoken';
export function generateRefreshToken(user) {
  return jwt.sign(
    { uuid: user.uuid, role: user.role },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_DURATION,
    },
  );
}
