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

app.use('/api/v1/assignments', ensureAuth(), mongoConnection, require('./routes/assignments/assignmentRoutes'));
app.use('/api/v1/comment', ensureAuth(), mongoConnection, require('./routes/assignments/commentRoutes'));
app.use('/api/v1/grade', ensureAuth(), mongoConnection, require('./routes/assignments/gradeRoutes'));
app.use('/api/v1/submission', ensureAuth(), mongoConnection, require('./routes/assignments/submissionRoutes'));

app.use('/api/v1/course', ensureAuth(), mongoConnection, require('./routes/courseRoutes'));
app.use('/api/v1/resource', ensureAuth(), mongoConnection, require('./routes/resourceRoutes'));


app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;

