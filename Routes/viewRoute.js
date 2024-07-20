const express = require('express');
const viewController = require('./../Controllers/viewControllers');
const authController = require('../Controllers/authControllers');
const bookingController = require('../Controllers/bookingController');

const routers = express.Router();

routers.get(
  '/',
  bookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewController.getOverview
);
routers.get('/tour/:slug', authController.protect, viewController.getTour);
routers.get('/login', authController.isLoggedIn, viewController.getLoginForm);
routers.get('/me', authController.protect, viewController.getAccount);
routers.get('/my-tours', authController.protect, viewController.getMyTours);

module.exports = routers;
