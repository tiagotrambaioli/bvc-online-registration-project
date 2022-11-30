import jwt from 'jsonwebtoken';
export function generateAccessToken(user) {
  return jwt.sign(
    { uuid: user.uuid, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_DURATION,
    },
  );
}
