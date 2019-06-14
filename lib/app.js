const express = require('express');
const app = express();
const mongoConnection = require('./middleware/mongo-connection');
const { ensureAuth } = require('./middleware/ensure-auth');

app.use(require('morgan')('tiny', {
  skip: () => process.env.NODE_ENV === 'test'
}));

app.use(require('cookie-parser')());
app.use(express.json());

//routes go here
app.use('/api/v1/students', ensureAuth(), mongoConnection, require('./routes/profiles/students'));
app.use('/api/v1/admin', ensureAuth(), mongoConnection, require('./routes/profiles/admins'));
app.use('/api/v1/user', ensureAuth(), mongoConnection, require('./routes/profiles/userRoutes'));


app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;

