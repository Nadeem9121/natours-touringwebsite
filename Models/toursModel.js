const mongooes = require('mongoose');
const slugify = require('slugify');
const { trim } = require('validator');
// const User = require('./usersModel');
const tourSchema = new mongooes.Schema(
  {
    name: {
      type: String,
      require: [true, 'Tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour must have less or equal then 40 characters'],
      minlength: [10, 'A tour must have more or equal then 10 characters'],
    },
    slug: String,
    duration: {
      type: Number,
      require: [true, 'A Tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      require: [true, 'A Tour must have a groupsize'],
    },
    difficulty: {
      type: String,
      require: [true, 'A Tour must have a difficulty type'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      requrie: [true, 'Tour must have a price'],
    },
    summary: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      require: [true, 'A Tour must have a description'],
    },
    imageCover: {
      type: String,
      require: [true, 'A Tour must have a imageCover'],
    },
    images: {
      type: [String],
      require: [true, 'A Tour must have a image'],
    },
    startDates: {
      type: [Date],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    //GeoJSON
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [{ type: mongooes.Schema.ObjectId, ref: 'User' }],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});
// DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   await Promise.all(guidesPromises);
//   next();
// });
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  next();
});
tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});
// AGGREGATION MIDDLEWARE
// tourSchema.pre('aggregate', function(next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

//   console.log(this.pipeline());
//   next();
// });
const Tour = mongooes.model('Tour', tourSchema);

module.exports = Tour;
