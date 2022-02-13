const express = require('express');
const cors = require('cors');
require('express-async-errors');
const membersRouter = require('./controllers/members');
const moviesRouter = require('./controllers/movies');
const subscriptionsRouter = require('./controllers/subscriptions');

const { requestLogger, errorHandler } = require('./utils/middleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.use('/api/members', membersRouter);
app.use('/api/movies', moviesRouter);
app.use('/api/subscriptions', subscriptionsRouter);
app.use(errorHandler);

module.exports = app;
