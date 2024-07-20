const multer = require('multer');
const sharp = require('sharp');
const User = require('./../Models/usersModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./factoryHandler');

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   fileFilter: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });

// const multerFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith('image')) {
//     cb(null, true);
//   } else {
//     cb(new AppError('Not an image! Please upload only images.', 400), false);
//   }
// };
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not a image file upload only image', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.uploadPhoto = upload.single('photo');

exports.resizeUserPhoto = async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
};
exports.deleteMe = factory.deleteOne(User);
exports.getAllUsers = factory.getAllDoc(User);
exports.getUser = factory.getDocById(User);

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
// exports.getAllUsers = async (req, res, next) => {
//   try {
//     const users = await User.find();
//     res.status(200).json({
//       stauts: 'Success',
//       results: users.length,
//       data: {
//         users: users,
//         passwordChange: users.passwordChangedAt,
//       },
//     });
//   } catch (err) {
//     res.status(400).json({
//       status: 'fail',
//       message: err,
//     });
//   }
// };
// exports.deleteMe = catchAsync(async (req, res, next) => {
//   await User.findByIdAndUpdate(req.user.id, { active: false });
//   res.send(204).json({
//     data: null,
//   });
// });
// exports.updateMe = catchAsync(async (req, res, next) => {
//   //1) Create error if user post password data
//   if (req.body.password || req.body.passwordConfirm) {
//     return next(
//       new AppError(
//         'This route is not for password updates. Please user /updateMyPassword.',
//         400
//       )
//     );
//   }
//   //2) Update user document
//   const filteredBody = filterObj(req.body, 'name', 'email');
//   const updateUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
//     new: true,
//     runValidators: true,
//   });
//   res.status(200).json({
//     status: 'success',
//     data: {
//       user: updateUser,
//     },
//   });
// });
exports.newUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please user /signup instead ',
  });
};

// exports.deleteUser = (req, res) => {
//   res.status(500).json({
//     status: 500,
//     message: 'Internal Server Error',
//   });
// };
exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename;

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});
