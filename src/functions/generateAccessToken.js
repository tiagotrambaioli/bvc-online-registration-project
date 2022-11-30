import jwt from 'jsonwebtoken';
export function generateAccessToken(user) {
  return jwt.sign(
    { firstName: user.firstName, lastName: user.lastName },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_DURATION,
    },
  );
}
