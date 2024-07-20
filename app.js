//Require Modules

const path = require('path');
const express = require('express');
const morgan = require('morgan');
const toursRouter = require('./Routes/toursRoute');
const usersRouter = require('./Routes/userRoutes');
const reviewRouter = require('./Routes/reviewsRoute');
const bookingRouter = require('./Routes/bookingRoutes');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const sanitize = require('express-mongo-sanitize');
const xxs = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const globalErrorHandler = require('./Controllers/errorController');
const AppError = require('./utils/appError');
const viewRouter = require('./Routes/viewRoute');
//Use Modules
const app = express();

//setting for the view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
//app.use(helmet());
// const scriptSrcUrls = [
//   'https://api.tiles.mapbox.com/',
//   'https://api.mapbox.com/',
// ];
// const styleSrcUrls = [
//   'https://api.mapbox.com/',
//   'https://api.tiles.mapbox.com/',
//   'https://fonts.googleapis.com/',
// ];
// const connectSrcUrls = [
//   'https://api.mapbox.com/',
//   'https://a.tiles.mapbox.com/',
//   'https://b.tiles.mapbox.com/',
//   'https://events.mapbox.com/',
// ];
// const fontSrcUrls = ['fonts.googleapis.com', 'fonts.gstatic.com'];
// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: [],
//       connectSrc: ["'self'", ...connectSrcUrls],
//       scriptSrc: ["'self'", ...scriptSrcUrls],
//       styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
//       workerSrc: ["'self'", 'blob:'],
//       objectSrc: [],
//       imgSrc: ["'self'", 'blob:', 'data:'],
//       fontSrc: ["'self'", ...fontSrcUrls],
//     },
//   })
// );

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(sanitize());
app.use(xxs());
app.use(
  hpp({
    whitelist: [
      'duration',
      'maxGroupSize',
      'difficulty',
      'ratingsAverage',
      'price',
      'ratingsQuantity',
    ],
  })
);

if (process.env.NODE_ENV === 'development' || 3000) {
  app.use(morgan('dev'));
}

//MiddleWares

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message:
    'Too many request from this IP Address, Please try again after 1 hour!',
});
app.use('/api', limiter);
app.use((req, res, next) => {
  console.log('Hello from the middleware');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

//Users Routes
app.use('/', viewRouter);
app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl}on this server!`), 404);
});

app.use(globalErrorHandler);
module.exports = app;
