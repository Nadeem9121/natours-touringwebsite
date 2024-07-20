// const catchAsync = require('./../utils/catchAsync');
const Review = require('./../Models/reviewModel');
const factory = require('./factoryHandler');

exports.setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReview = factory.getAllDoc(Review);
exports.postNewReview = factory.createOne(Review);
exports.getReview = factory.getDocById(Review);
exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateDoc(Review);
