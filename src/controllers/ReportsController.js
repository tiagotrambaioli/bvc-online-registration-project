import User from '../models/User.js';

class ReportsController {
  async programStudents(req, res) {
    let students = [];
    let programs = [];
    for (let i = 0; i < User.db.length; i++) {
      const user = User.db[i];
      if (user.role === 'student' && user.program != null) {
        students.push({
          uuid: user.uuid,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          programUUID: user.program.uuid,
        });
        const inPrograms = programs.findIndex(
          (item) => item.uuid == user.program.uuid,
        );
        if (inPrograms == -1) {
          programs.push({
            uuid: user.program.uuid,
            program: user.program.title,
            type: user.program.type,
          });
        }
      }
    }

    programs.forEach((program) => {
      const studentsEnrolled = students.filter(
        (student) => student.programUUID == program.uuid,
      );
      program.studentsEnrolled = studentsEnrolled;
    });

    console.log(programs);

    res.status(200);
    res.send(programs);
  }
}

export default new ReportsController();
