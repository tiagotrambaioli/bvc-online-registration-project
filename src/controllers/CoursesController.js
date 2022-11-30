import crypto from 'crypto';
import Course from '../models/Course.js';

class CoursesController {
  async index(req, res) {
    res.send('It works...');
  }
  async create(req, res) {
    const uuid = crypto.randomUUID();
    let {
      courseCode,
      courseName,
      courseCredits,
      tuition = null,
      outlines = null,
    } = req.body;
    const createdAt = new Date().toLocaleString();
    const updatedAt = null;

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

    const verifyCode = await Course.db.find(
      (course) => courseCode === course.courseCode,
    );

    if (verifyCode) {
      res.status(409);
      res.send({ msg: 'Course code already registered.' });
      return;
    }

    if (!courseCode) {
      res.status(400);
      res.send({ msg: 'Course code required.' });
      return;
    }
    if (!courseName) {
      res.status(400);
      res.send({ msg: 'Course name required.' });
      return;
    }
    if (!courseCredits) {
      res.status(400);
      res.send({ msg: 'Course credits required.' });
      return;
    }

    try {
      Course.save({
        uuid,
        courseCode,
        courseName,
        courseCredits,
        tuition,
        outlines,
        createdAt,
        updatedAt,
      });
      res.status(201);
      res.send({ msg: 'Course created.' });
    } catch (err) {
      console.log(err);
      res.status(500);
      res.json({ error: 'Something wrong, try again later... ' });
    }
  }

  async show(req, res) {
    const search = req.params.search.toLowerCase();
    const courseByCode = await Course.db.filter((course) =>
      course.courseCode.toLowerCase().includes(search),
    );

    const courseByName = await Course.db.filter((course) =>
      course.courseName.toLowerCase().includes(search),
    );

    const response = [...courseByCode, ...courseByName];

    if (Object.values(response).length > 0) {
      res.status(200);
      res.send(response);
      return;
    } else {
      res.status(404);
      res.send({ msg: 'No courses found.' });
      return;
    }
  }

  async showAll(req, res) {
    const response = await Course.db;
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
      (course) => course.courseCode === courseCode,
    );

    const verifyCourseCode = await Course.db.find(
      (course) => courseCode === course.courseCode && uuid !== course.uuid,
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
    const course = await Course.db.findIndex(
      (course) => course.courseCode === uuid || course.uuid === uuid,
    );
    if (course != -1) {
      Course.db.splice(course, 1);
      res.status(200);
      res.send({ msg: 'course deleted successfully!' });
      Course.save();
      return;
    } else {
      res.status(404);
      res.send({ msg: 'Course not found.' });
      return;
    }
  }
}

export default new CoursesController();
