const fs = require('fs');
const mongooes = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: `${__dirname}/../../config.env` });
const Tour = require(`${__dirname}/../../Models/toursModel`);
const User = require('./../../Models/usersModel');
const Review = require('./../../Models/reviewModel');
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
console.log(DB);
mongooes.connect(DB).then((conn) => {
  console.log('Connectd Successfully!!');
});
const toursData = JSON.parse(
  fs.readFileSync(`${__dirname}/tours.json`, 'utf-8')
);
const reviewData = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);
const usersData = JSON.parse(
  fs.readFileSync(`${__dirname}/users.json`, 'utf-8')
);
//Loading Data
const importData = async (req, res) => {
  try {
    await Tour.create(toursData);
    await User.create(usersData, { validateBeforeSave: false });
    await Review.create(reviewData);
    console.log('Data Loaded Successfully...');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
//Deleting Data
const deleteData = async (req, res) => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data Delete Successfully...');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--destroy') {
  deleteData();
}
console.log(process.argv);
