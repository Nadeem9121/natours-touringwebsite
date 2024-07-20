const express = require('express');
const toursController = require('./../Controllers/toursController');
const authController = require('./../Controllers/authControllers');
const reviewRouter = require('./../Routes/reviewsRoute');
const routers = express.Router();

routers.use('/:tourId/reviews', reviewRouter);
routers
  .route('/get-Top-Cheap')
  .get(toursController.getTopCheap, toursController.getAllTours);
routers.route('/tour-stats').get(toursController.getToursStats);
routers
  .route('/tours-monthly-plans/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    toursController.getMonthlyPlan
  );
routers
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(toursController.getToursWithin);
// /tours-within?distance=233&center=-40,45&unit=mi
// /tours-within/233/center/-40,45/unit/mi

routers
  .route('/distances/:latlng/unit/:unit')
  .get(toursController.getDistances);
routers
  .route('/')
  .get(toursController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    toursController.newTour
  );
routers
  .route('/:id')
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    toursController.uploadTourImages,
    toursController.resizeTourImages,
    toursController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    toursController.deleteTour
  )
  .get(toursController.getTour);
// routers
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.postNewReview
//   );
module.exports = routers;
