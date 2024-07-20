const express = require('express');
const authController = require('./../Controllers/authControllers');
const reviewsController = require('./../Controllers/reviewController');

const routers = express.Router({ mergeParams: true });

routers.use(authController.protect);
routers
  .route('/')
  .get(reviewsController.getAllReview)
  .post(
    authController.restrictTo('user'),
    reviewsController.setTourUserIds,
    reviewsController.postNewReview
  );

routers
  .route('/:id')
  .get(reviewsController.getReview)
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewsController.updateReview
  )
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewsController.deleteReview
  );

module.exports = routers;
