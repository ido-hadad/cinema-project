const express = require('express');
const cors = require('cors');
require('express-async-errors');
const { createProxyMiddleware, fixRequestBody } = require('http-proxy-middleware');
const {
  userExtractor,
  tokenExtractor,
  errorHandler,
  requestLogger,
  checkPermission: check,
  checkIfAdmin,
} = require('./utils/middleware');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const Permissions = require('./utils/permissions');

const app = express();

app.use(cors());
app.use(express.json());
app.use(tokenExtractor);
app.use(userExtractor);
app.use(requestLogger);

// app.use((req, res) => res.status(400).json({ error: 'Invalid item id' }));

const proxy = createProxyMiddleware({
  target: 'http://localhost:3011/',
  changeOrigin: true,
  onProxyReq: fixRequestBody,
});

const moviesRouter = express.Router();
moviesRouter.get('/', check(Permissions.ViewMovie, Permissions.ViewSubscription), proxy);
moviesRouter.get('/:id', check(Permissions.ViewMovie), proxy);
moviesRouter.post('/', check(Permissions.CreateMovie), proxy);
moviesRouter.delete('/:id', check(Permissions.DeleteMovie), proxy);
moviesRouter.put('/:id', check(Permissions.UpdateMovie), proxy);
app.use('/api/movies', moviesRouter);

const membersRouter = express.Router();
membersRouter.get('/', check(Permissions.ViewSubscription, Permissions.ViewMovie), proxy);
membersRouter.get('/:id', check(Permissions.ViewSubscription), proxy);
membersRouter.post('/', check(Permissions.CreateSubscription), proxy);
membersRouter.delete('/:id', check(Permissions.DeleteSubscription), proxy);
membersRouter.put('/:id', check(Permissions.UpdateSubscription), proxy);
app.use('/api/members', membersRouter);

const subsRouter = express.Router();
subsRouter.get('/', check(Permissions.ViewSubscription, Permissions.ViewMovie), proxy);
subsRouter.get('/:id', check(Permissions.ViewSubscription), proxy);
subsRouter.post('/:id', check(Permissions.CreateSubscription), proxy);
subsRouter.delete('/:id', check(Permissions.DeleteSubscription), proxy);
app.use('/api/subscriptions', subsRouter);

app.use('/api/login', loginRouter);
app.use('/api/users', checkIfAdmin, usersRouter);

app.use(errorHandler);

module.exports = app;
