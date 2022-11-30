import User from '../../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UsersController from '../UsersController.js';
import { generateAccessToken } from '../../functions/generateAccessToken.js';
import { generateRefreshToken } from '../../functions/generateRefreshToken.js';
class AuthController {
  async token(req, res) {
    const refreshToken = req.body.token;
    const user = await User.db.find(
      (user) => user.refreshToken === refreshToken,
    );
    if (!user) {
      res.sendStatus(403);
      return;
    }
    if (refreshToken == null) {
      res.sendStatus(401);
      return;
    }
    if (!user.refreshToken.includes(refreshToken)) {
      res.sendStatus(403);
      return;
    }
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, uuid) => {
        if (err) return res.sendStatus(403);
        const accessToken = generateAccessToken(user);
        res.send({ accessToken: accessToken });
        return;
      },
    );
  }

  async login(req, res) {
    const { email, username } = req.body;
    req.setEncoding('utf-8');
    let password = req.body.password.toString();

    const user = await User.db.find(
      (user) => user.email === email || user.username === username,
    );
    if (!user) {
      res.status(400);
      res.send({ error: 'Cannot find user.' });
      return;
    }
    const uuid = user.uuid;

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    try {
      await UsersController.updateRefreshToken(uuid, refreshToken);
    } catch (err) {
      console.log(err);
      return res.sendStatus(403);
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        res.status(200);
        res.send({
          accessToken: accessToken,
          refreshToken: refreshToken,
        });
      } else {
        res.status(401);
        res.send({ error: 'Not Allowed!' });
      }
    } catch (e) {
      console.log(e);
      res.status(500);
      res.send({ error: 'Something wrong, try again later!' });
      return;
    }
  }

  async deleteToken(req, res) {
    const refreshToken = req.body.token;
    const user = await User.db.find(
      (user) => user.refreshToken === refreshToken,
    );
    if (!user) {
      res.status(400);
      res.send({ error: 'Cannot find user.' });
      return;
    }
    if (refreshToken == null) {
      res.sendStatus(401);
      return;
    }
    if (!user.refreshToken.includes(refreshToken)) {
      res.sendStatus(403);
      return;
    }
    await UsersController.deleteRefreshToken(user.uuid);
    res.sendStatus(204);
  }
}

export default new AuthController();
