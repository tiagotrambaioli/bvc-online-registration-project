import crypto from 'crypto';
import Program from '../models/Program.js';
import Course from '../models/Course.js';
import User from '../models/User.js';

class ProgramsController {
  async create(req, res) {
    const uuid = crypto.randomUUID();
    let { title, url = null, type, subtitle = null, duration, category = null, startdate = null, deliveryTypes = null, tuition = null, terms = null } = req.body;
    const createdAt = new Date().toLocaleString();
    const updatedAt = null;
    type = type.toUpperCase();
    category = category.toUpperCase();

    if (tuition) {
      if (tuition.domestic) {
        tuition.domestic = Number(tuition?.domestic);
        tuition.international = Number(tuition?.international);
      }
    }

    if (!title) {
      res.status(400);
      res.send({ msg: 'Program title required.' });
      return;
    }
    if (!type) {
      res.status(400);
      res.send({ msg: 'Program type required.' });
      return;
    }
    if (!duration) {
      res.status(400);
      res.send({ msg: 'Program duration required.' });
      return;
    }

    const verifyTitle = await Program.db.find((program) => title.toLowerCase() === program.title.toLowerCase());

    if (verifyTitle) {
      res.status(409);
      res.send({ msg: 'Program title already registered.' });
      return;
    }

    try {
      Program.save({
        uuid,
        title,
        url,
        type,
        subtitle,
        duration,
        category,
        startdate,
        deliveryTypes,
        tuition,
        terms,
        createdAt,
        updatedAt,
      });
      res.status(201);
      res.send({ msg: 'Program created.' });
    } catch (err) {
      console.log(err);
      res.status(500);
      res.send({ error: 'Something wrong, try again later... ' });
    }
  }

  async show(req, res) {
    const search = req.params.search.toLowerCase();

    const programByUUID = async () => {
      return await Program.db.filter((program) => program.uuid.includes(search));
    };

    const programByTitle = async () => {
      if (programByUUID.length == 0) return await Program.db.filter((program) => program.title.toLowerCase().includes(search));
    };

    const programByCategory = async () => {
      if (programByTitle.length == 0) return await Program.db.filter((program) => program.category.toLowerCase().includes(search));
    };

    const response = [...(await programByUUID()), ...(await programByTitle()), ...(await programByCategory())];

    if (Object.values(response).length > 0) {
      res.status(200);
      res.send(response);
      return;
    } else {
      res.status(404);
      res.send({ msg: 'No programs found.' });
      return;
    }
  }

  async showAll(req, res) {
    const response = await Program.db;
    res.status(200);
    res.send(response);
    return;
  }

  async update(req, res) {
    let { uuid, title, url, type, subtitle, duration, category, startdate, deliveryTypes, tuition, terms } = req.body;

    const updatedAt = new Date().toLocaleString();

    const program = await Program.db.findIndex((program) => program.uuid === uuid);

    const verifyProgramTitle = await Program.db.find((program) => title?.toLowerCase() === program.title.toLowerCase() && uuid !== program.uuid);

    if (verifyProgramTitle) {
      res.status(409);
      res.send({ msg: 'Program title already registered.' });
      return;
    }

    if (program != -1) {
      try {
        if (title) Program.db[program].title = title;
        if (url) Program.db[program].url = url;
        if (type) Program.db[program].type = type;
        if (subtitle) Program.db[program].subtitle = subtitle;
        if (duration) Program.db[program].duration = duration;
        if (category) Program.db[program].category = category;
        if (startdate) Program.db[program].startdate = startdate;
        if (deliveryTypes) Program.db[program].deliveryTypes = deliveryTypes;
        if (tuition) Program.db[program].tuition = tuition;
        if (terms) Program.db[program].terms = terms;
        Program.db[program].updatedAt = updatedAt;
        res.status(200);
        res.send({ msg: 'Program updated successfully.' });
        Program.save();
        return;
      } catch (err) {
        console.log(err);
        res.status(500);
        res.send({ error: 'Something wrong, try again later... ' });
        return;
      }
    } else {
      res.status(404);
      res.send({ msg: 'Program not found.' });
      return;
    }
  }

  async students(req, res) {
    const { uuid } = req.params;
    const students = [];
    for (let i = 0; i < User.db.length; i++) {
      const student = User.db[i];
      if (student.program != null && student.program.uuid === uuid) {
        students.push({
          uuid: student.uuid,
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email,
        });
      }
    }

    res.status(200);
    res.send(students);
  }

  async destroy(req, res) {
    const uuid = req.params.uuid;
    const program = await Program.db.findIndex((program) => program.uuid === uuid);
    if (program != -1) {
      Program.db.splice(program, 1);
      res.status(200);
      res.send({ msg: 'Program deleted successfully!' });
      Course.save();
      return;
    } else {
      res.status(404);
      res.send({ msg: 'Program not found.' });
      return;
    }
  }
}

export default new ProgramsController();
