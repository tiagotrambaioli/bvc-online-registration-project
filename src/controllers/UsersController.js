import User from '../models/User.js';

class UsersController {
  async index(req, res) {
    try {
      // console.log(User.db);
      // User.db.push({ teste: 'teste' });
      // console.log(User.db);
    } catch (err) {
      //...
      console.log(user);
    }
  }

  async show(req, res) {
    try {
      //...
    } catch (err) {
      //...
    }
  }

  async create(req, res) {
    const {
      firstName,
      lastName,
      email,
      phone = null,
      dateOfBirth,
      username,
      password,
      refreshToken,
      createdAt = new Date(),
      updatedAt = null,
    } = req.body;
    const department = null;
    const role = 'student';
    const program = null;

    if (!firstName) res.json({ error: 'First name is required.' });
    if (!lastName) res.json({ error: 'Last name is required.' });
    if (!email) res.json({ error: 'email is required.' });
    if (!phone) res.json({ error: 'phone is required.' });
    if (!dateOfBirth) res.json({ error: 'Date of birth is required.' });
    if (!username) res.json({ error: 'Username is required.' });
    if (!password) res.json({ error: 'Password is required.' });
    try {
      User.save({
        firstName,
        lastName,
        email,
        phone,
        dateOfBirth,
        username,
        password,
      });
      return res.status(201);
    } catch (err) {
      console.log(err);
      res.status(500);
      res.json({ error: 'Something wrong, try again later... ' });
    }
  }

  async update(req, res) {
    try {
      //...
    } catch (err) {
      //...
    }
  }

  async destroy(req, res) {
    try {
      //...
    } catch (err) {
      //...
    }
  }
}

export default new UsersController();
