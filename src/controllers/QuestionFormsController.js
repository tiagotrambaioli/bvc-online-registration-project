import crypto from 'crypto';
import QuestionForms from '../models/QuestionForms.js';

class QuestionFormsController {
  async create(req, res) {
    const uuid = crypto.randomUUID();
    const {
      userUUID,
      userFirstName,
      userLastName,
      userEmail,
      userPhone,
      programUUID = null,
      program = null,
      courseUUID = null,
      course = null,
      message,
      status = 'New',
      comment = null,
    } = req.body;

    const createdAt = new Date().toLocaleString();
    const updatedAt = null;

    if (!userEmail && !userPhone) {
      res.status(400);
      res.send({ msg: 'Email or phone required.' });
      return;
    }

    try {
      QuestionForms.save({
        uuid,
        userUUID,
        userFirstName,
        userLastName,
        userEmail,
        userPhone,
        programUUID,
        program,
        courseUUID,
        course,
        message,
        status,
        comment,
        createdAt,
        updatedAt,
      });
      res.status(201);
      res.send({ msg: 'Form sent.' });
    } catch (err) {
      console.log(err);
      res.status(500);
      res.json({ error: 'Something wrong, try again later... ' });
    }
  }

  async show(req, res) {
    const uuid = req.params.uuid;
    const form = await QuestionForms.db.find((form) => form.uuid === uuid);
    const response = {};
    if (form) {
      response.uuid = form.uuid;
      response.userUUID = form.userUUID;
      response.userEmail = form.userEmail;
      response.userPhone = form.userPhone;
      response.programUUID = form.programUUID;
      response.program = form.program;
      response.courseUUID = form.courseUUID;
      response.course = form.course;
      response.message = form.message;
      response.status = form.status;
      response.comment = form.comment;
    }
    if (form) {
      res.status(200);
      res.send(response);
      return;
    } else {
      res.status(404);
      res.send({ msg: 'Form not found.' });
      return;
    }
  }

  async showAll(req, res) {
    const response = await QuestionForms.db;
    res.status(200);
    res.send(response);
    return;
  }

  async update(req, res) {
    const { uuid, status } = req.body;
    const updatedAt = new Date().toLocaleString();

    const form = await QuestionForms.db.findIndex((form) => form.uuid === uuid);

    if (form != -1) {
      try {
        if (status) QuestionForms.db[form].status = status;
        QuestionForms.db[form].updatedAt = updatedAt;
        res.status(200);
        res.send({ msg: 'Form status updated successfully.' });
        QuestionForms.save();
        return;
      } catch (err) {
        console.log(err);
        res.status(500);
        res.send({ error: 'Something wrong, try again later... ' });
        return;
      }
    } else {
      res.status(404);
      res.send({ msg: 'Form not found.' });
      return;
    }
  }

  async destroy(req, res) {
    const uuid = req.params.uuid;
    const form = await QuestionForms.db.findIndex((form) => form.uuid === uuid);
    if (form != -1) {
      QuestionForms.db.splice(form, 1);
      res.status(200);
      res.send({ msg: 'Form deleted successfully!' });
      QuestionForms.save();
      return;
    } else {
      res.status(404);
      res.send({ msg: 'Form not found.' });
      return;
    }
  }
}

export default new QuestionFormsController();
