import crypto from 'crypto';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

class UsersController {
  async create(req, res) {
    const uuid = crypto.randomUUID();
    const { firstName, lastName, email, phone = null, dateOfBirth, username } = req.body;
    const refreshToken = null;
    let password = req.body.password.toString();
    const department = null;
    const role = 'student';
    const program = null;
    const createdAt = new Date().toLocaleString();
    const updatedAt = null;

    try {
      const salt = bcrypt.genSaltSync(10);
      password = bcrypt.hashSync(password, salt);
    } catch (err) {
      console.log(err);
      res.status(500);
      res.send({ error: 'Something wrong, try again later!' });
      return;
    }

    const verifyEmail = await User.db.find((user) => email === user.email);
    const verifyUsername = await User.db.find((user) => username === user.username);
    const verifyUUID = await User.db.find((user) => uuid == user.uuid);

    if (verifyEmail) {
      res.status(409);
      res.send({ error: 'E-mail already registered.' });
      return;
    }
    if (verifyUsername) {
      res.status(409);
      res.send({ error: 'Username already registered.' });
      return;
    }
    if (verifyUUID) {
      res.status(500);
      res.send({ error: 'Something wrong, try again later!' });
      return;
    }

    if (!firstName) return res.status(409).send({ error: 'First name is required.' });
    if (!lastName) return res.status(409).send({ error: 'Last name is required.' });
    if (!email) return res.status(409).send({ error: 'email is required.' });
    if (!phone) return res.status(409).send({ error: 'phone is required.' });
    if (!dateOfBirth) return res.status(409).send({ error: 'Date of birth is required.' });
    if (!username) return res.status(409).send({ error: 'Username is required.' });
    if (!password) return res.status(409).send({ error: 'Password is required.' });
    try {
      User.save({
        uuid,
        firstName,
        lastName,
        email,
        phone,
        dateOfBirth,
        username,
        password,
        department,
        role,
        program,
        createdAt,
        updatedAt,
        refreshToken,
      });
      res.status(201);
      res.send({ msg: 'User created.' });
      return;
    } catch (err) {
      console.log(err);
      res.status(500);
      res.send({ error: 'Something wrong, try again later... ' });
      return;
    }
  }
  async show(req, res) {
    const uuid = req.params.uuid;
    const user = await User.db.find((user) => user.uuid === uuid);

    if (user) {
      res.status(200);
      res.send({ ...user });
      return;
    } else {
      res.status(404);
      res.send({ msg: 'User not found.' });
      return;
    }
  }

  async showAll(req, res) {
    const response = await User.db.map((user) => {
      return {
        uuid: user.uuid,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        username: user.username,
        department: user.department,
        role: user.role,
        program: user.program,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    });
    res.status(200);
    res.send(response);
    return;
  }

  async update(req, res) {
    const { uuid, firstName, lastName, email, phone, dateOfBirth, username, department, role, program, terms, upgrading } = req.body;
    let password = req?.body?.password?.toString();
    const updatedAt = new Date().toLocaleString();

    const user = await User.db.findIndex((user) => user.uuid === uuid);

    const verifyEmail = await User.db.find((user) => email === user.email && uuid !== user.uuid);
    const verifyUsername = await User.db.find((user) => username === user.username && uuid !== user.uuid);

    if (email) {
      if (verifyEmail) {
        res.status(409);
        res.send({ msg: 'E-mail already registered.' });
        return;
      }
    }
    if (username) {
      if (verifyUsername) {
        res.status(409);
        res.send({ error: 'Username already registered.' });
        return;
      }
    }

    if (password) {
      try {
        const salt = bcrypt.genSaltSync(10);
        password = bcrypt.hashSync(password, salt);
      } catch (err) {
        console.log(err);
        res.status(500);
        res.send({ error: 'Something wrong, try again later!' });
        return;
      }
    }
    if (user != -1) {
      try {
        if (firstName) User.db[user].firstName = firstName;
        if (lastName) User.db[user].lastName = lastName;
        if (email) User.db[user].email = email;
        if (phone) User.db[user].phone = phone;
        if (dateOfBirth) User.db[user].dateOfBirth = dateOfBirth;
        if (username) User.db[user].username = username;
        if (password) User.db[user].password = password;
        if (department) User.db[user].department = department;
        if (role) User.db[user].role = role;
        if (program || program === null) User.db[user].program = program;
        if (terms || terms === null) User.db[user].program.terms = terms;
        if (upgrading) User.db[user].upgrading = upgrading;
        User.db[user].updatedAt = updatedAt;
        await User.save();
        res.status(200);
        res.send({ msg: 'User updated successfully.' });
        return;
      } catch (err) {
        console.log(err);
        res.status(500);
        res.send({ error: 'Something wrong, try again later... ' });
        return;
      }
    } else {
      res.status(404);
      res.send({ msg: 'User not found.' });
      return;
    }
  }

  async destroy(req, res) {
    const uuid = req.params.uuid;
    const user = await User.db.findIndex((user) => user.uuid === uuid);
    if (user != -1) {
      User.db.splice(user, 1);
      res.status(200);
      res.send({ msg: 'User deleted successfully!' });
      User.save();
      return;
    } else {
      res.status(404);
      res.send({ msg: 'User not found.' });
      return;
    }
  }

  async updateRefreshToken(uuid, refreshToken) {
    const user = await User.db.findIndex((user) => user.uuid === uuid);
    if (user != -1) {
      User.db[user].refreshToken = refreshToken;
      User.save();
      return true;
    } else {
      return false;
    }
  }

  async deleteRefreshToken(uuid) {
    const user = await User.db.findIndex((user) => user.uuid === uuid);
    if (user != -1) {
      User.db[user].refreshToken = null;
      User.save();
      return true;
    } else {
      return false;
    }
  }
}

export default new UsersController();
