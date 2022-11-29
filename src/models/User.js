import fs from 'fs';

class User {
  constructor(db = []) {
    try {
      this.db = JSON.parse(
        fs.readFileSync('./src/database/users.json', { encoding: 'utf-8' }),
      );
    } catch (err) {
      console.log(err);
      return `Users.db connection unavailable.`;
    }
  }

  async save(data) {
    this.db.push(data);
    fs.writeFileSync(
      './src/database/users.json',
      JSON.stringify(this.db, null, 2),
      {
        encoding: 'utf-8',
      },
    );
  }
}

export default new User();
