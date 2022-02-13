const errorHandler = (error, req, res, next) => {
  console.log(error);
  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return res.status(400).json({
      error: 'Invalid object Id',
    });
  }
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      error: error.message,
    });
  }

  res.sendStatus(500);
  // next(error)
};

const requestLogger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  if (req.body && Object.keys(req.body).length !== 0) {
    console.log(`Body: ${JSON.stringify(req.body)}`);
  }
  console.log('--------');

  next();
};

module.exports = { errorHandler, requestLogger };
