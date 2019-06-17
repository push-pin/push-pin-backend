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
app.use('/api/v1/user', ensureAuth(), mongoConnection, require('./routes/profiles/users'));


app.use('/api/v1/assignments', ensureAuth(), mongoConnection, require('./routes/assignments/assignments'));
app.use('/api/v1/comments', ensureAuth(), mongoConnection, require('./routes/assignments/comments'));
app.use('/api/v1/grades', ensureAuth(), mongoConnection, require('./routes/assignments/grades'));
app.use('/api/v1/submissions', ensureAuth(), mongoConnection, require('./routes/assignments/submissions'));

app.use('/api/v1/courses', ensureAuth(), mongoConnection, require('./routes/courses'));
app.use('/api/v1/resources', ensureAuth(), mongoConnection, require('./routes/resources'));


app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;

