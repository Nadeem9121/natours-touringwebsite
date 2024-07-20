const catchAsync = require('./../utils/catchAsync');
const appError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(appError('There is no document with this id', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.getAllDoc = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagination();
    const doc = await features.query;
    if (!doc) {
      return next(appError('There is no document'), 404);
    }
    res.status(200).json({
      results: doc.length,
      status: 'success',
      data: doc,
    });
  });

exports.updateDoc = (Model) =>
  catchAsync(async (req, res, next) => {
    const updateDocu = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updateDocu) {
      return next(new appError('There is no document with this id', 404));
    }
    res.status(200).json({
      status: 'success',
      data: updateDocu,
    });
  });

exports.getDocById = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const getDoc = await query;
    if (!getDoc) {
      return next(new appError('There is no document with this id', 404));
    }
    res.status(200).json({
      status: 'success',
      data: getDoc,
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });
