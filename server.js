const dotenv = require('dotenv');
const mongooes = require('mongoose');
dotenv.config({ path: './config.env' });
const app = require('./app');
let DB = process.env.DATABASE;
DB = DB.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongooes.connect(DB).then((conn) => {
  console.log('Connected Successfully!!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
