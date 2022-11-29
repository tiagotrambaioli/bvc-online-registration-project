import fs from 'fs';

class Course {
  constructor(db = []) {
    try {
      this.db = JSON.parse(
        fs.readFileSync('./src/database/courses.json', { encoding: 'utf-8' }),
      );
    } catch (err) {
      console.log(err);
      return `Courses.db connection unavailable.`;
    }
  }

  async update() {
    try {
      this.db = JSON.parse(
        fs.readFileSync('./src/database/courses.json', { encoding: 'utf-8' }),
      );
    } catch (err) {
      console.log(err);
      return `Courses.db connection unavailable.`;
    }
  }

  async save(data = null) {
    if (data) this.db.push(data);
    fs.writeFileSync(
      './src/database/courses.json',
      JSON.stringify(this.db, null, 2),
      {
        encoding: 'utf-8',
      },
    );
    this.update();
  }
}

export default new Course();
