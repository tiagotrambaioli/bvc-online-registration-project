import jwt from 'jsonwebtoken';
export function generateRefreshToken(user) {
  return jwt.sign(
    { firstName: user.firstName, lastName: user.lastName },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_DURATION,
    },
  );
}
