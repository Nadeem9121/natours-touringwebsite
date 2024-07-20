const express = require('express');
const usersControllers = require('./../Controllers/usersController');
const authController = require('./../Controllers/authControllers');

const routers = express.Router();

routers.post('/signup', authController.signup);
routers.post('/login', authController.login);
routers.get('/logout', authController.logout);
routers.post('/forgetPassword', authController.forgotPassword);
routers.patch('/resetPassword/:token', authController.resetPassword);

routers.use(authController.protect);

routers.patch('/updateMyPassword', authController.updatePassword);

routers.get('/me', usersControllers.getMe, usersControllers.getUser);
routers.patch(
  '/updateMe',
  usersControllers.uploadPhoto,
  usersControllers.resizeUserPhoto,
  usersControllers.updateMe
);
routers.delete('/deleteMe', usersControllers.deleteMe);

routers.use(authController.restrictTo('admin '));

routers
  .route('/')
  .get(usersControllers.getAllUsers)
  .post(usersControllers.newUser);
routers
  .route('/:id')
  .patch(usersControllers.updateMe)
  .delete(usersControllers.deleteMe)
  .get(usersControllers.getUser);

module.exports = routers;
