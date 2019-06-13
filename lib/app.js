const express = require('express');
const app = express();
const mongoConnection = require('./middleware/mongo-connection');

app.use(require('morgan')('tiny', {
  skip: () => process.env.NODE_ENV === 'test'
}));

app.use(require('cookie-parser')());
app.use(express.json());

//routes go here
app.use('/api/v1/user', mongoConnection, require('./routes/profiles/users'));


app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;

