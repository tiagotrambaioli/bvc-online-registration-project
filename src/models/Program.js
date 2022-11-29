import fs from 'fs';

class Program {
  constructor(db = []) {
    try {
      this.db = JSON.parse(
        fs.readFileSync('./src/database/programs.json', { encoding: 'utf-8' }),
      );
    } catch (err) {
      console.log(err);
      return `Programs.db connection unavailable.`;
    }
  }

  async update() {
    try {
      this.db = JSON.parse(
        fs.readFileSync('./src/database/programs.json', { encoding: 'utf-8' }),
      );
    } catch (err) {
      console.log(err);
      return `Programs.db connection unavailable.`;
    }
  }

  async save(data = null) {
    if (data) this.db.push(data);
    fs.writeFileSync(
      './src/database/programs.json',
      JSON.stringify(this.db, null, 2),
      {
        encoding: 'utf-8',
      },
    );
    this.update();
  }
}

export default new Program();
