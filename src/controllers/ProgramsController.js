import crypto from 'crypto';
import Program from '../models/Program.js';
import Course from '../models/Course.js';

class ProgramsController {
  async create(req, res) {
    const uuid = crypto.randomUUID();
    let {
      title,
      url = null,
      type,
      subtitle = null,
      duration,
      category = null,
      startdate = null,
      deliveryTypes = null,
      tuition = null,
      terms = null,
    } = req.body;
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

    const verifyTitle = await Program.db.find(
      (program) => title.toLowerCase() === program.title.toLowerCase(),
    );

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
    const programByTitle = await Program.db.filter((program) =>
      program.title.toLowerCase().includes(search),
    );

    const programByCategory = await Program.db.filter((program) =>
      program.category.toLowerCase().includes(search),
    );

    const response = [...programByTitle, ...programByCategory];

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
    let {
      uuid,
      courseCode,
      courseName = null,
      courseCredits = null,
      tuition = null,
      outlines = null,
    } = req.body;
    const updatedAt = new Date().toLocaleString();

    courseCredits = Number(courseCredits);
    if (tuition) {
      if (tuition.domestic) {
        tuition.domestic = Number(tuition?.domestic);
        tuition.international = Number(tuition?.international);
      }
    }

    if (outlines) {
      outlines.forEach((outline) => {
        outline.academicYear = Number(outline?.academicYear);
      });
    }

    const course = await Course.db.findIndex(
      (course) => course.uuid === uuid || course.courseCode === courseCode,
    );

    const verifyCourseCode = await Course.db.find(
      (course) =>
        courseCode.toLowerCase() === course.courseCode.toLowerCase() &&
        uuid !== course.uuid,
    );

    if (verifyCourseCode) {
      res.status(409);
      res.send({ msg: 'Course code already registered.' });
      return;
    }

    if (course != -1) {
      try {
        if (courseCode) Course.db[course].courseCode = courseCode;
        if (courseName) Course.db[course].courseName = courseName;
        if (courseCredits) Course.db[course].courseCredits = courseCredits;
        if (tuition) Course.db[course].tuition = tuition;
        if (outlines) Course.db[course].outlines = outlines;
        Course.db[course].updatedAt = updatedAt;
        res.status(200);
        res.send({ msg: 'Course updated successfully.' });
        Course.save();
        return;
      } catch (err) {
        console.log(err);
        res.status(500);
        res.send({ error: 'Something wrong, try again later... ' });
        return;
      }
    } else {
      res.status(404);
      res.send({ msg: 'Course not found.' });
      return;
    }
  }

  async destroy(req, res) {
    const uuid = req.params.uuid;
    const program = await Program.db.findIndex(
      (program) => program.uuid === uuid,
    );
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
