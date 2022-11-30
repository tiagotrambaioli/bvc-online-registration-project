import * as dotenv from 'dotenv';
dotenv.config();
import app from './app.js';

app.listen(process.env.SERVER_PORT || 3000, () =>
  console.log(`Server is running on PORT ${process.env.SERVER_PORT || 5000}`),
);
