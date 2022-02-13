const { isAdminUsername, getUserById } = require('../BL/users');
const jwt = require('jsonwebtoken');

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
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'invalid token',
    });
  }
  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token is expired. Please login again.',
    });
  }
  // res.sendStatus(500);
  next(error);
};

const requestLogger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  if (req.body && Object.keys(req.body).length !== 0) {
    console.log(`Body: ${JSON.stringify(req.body)}`);
  }
  console.log('--------');

  next();
};

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7);
  } else {
    request.token = null;
  }

  next();
};

const userExtractor = (request, response, next) => {
  if (request.token) {
    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    request.user = decodedToken;
  }
  next();
};

const checkPermission =
  (...required) =>
  async (request, response, next) => {
    if (!request.user) {
      return response.sendStatus(401);
    }

    const user = await getUserById(request.user.id);
    // since we dont invalidate tokens (other than by expire date), confirm the user still exists
    if (!user)
      return response.status(401).json({ error: 'Token is no longer valid. Please login again.' });

    if (required.length === 0) return next();

    // since we dont invalidate, use permissions from DB instead of token
    // const userPermissions = request.user.permissions ?? [];
    const userPermissions = user.permissions ?? [];

    // check if user has ONE of the required permissions
    const match = required.some((permission) => userPermissions.includes(permission));
    if (!match) {
      return response.sendStatus(403);
    }

    next();
  };

const checkIfAdmin = (request, response, next) => {
  if (!request.user) {
    return response.sendStatus(401);
  }

  if (!isAdminUsername(request.user.username)) {
    return response.sendStatus(403);
  }
  next();
};

module.exports = {
  errorHandler,
  requestLogger,
  tokenExtractor,
  userExtractor,
  checkPermission,
  checkIfAdmin,
};
