const express = require('express');
const app = express();
// const mongoConnection = require('./middleware/mongo-connection');
// const { ensureAuth } = require('./middleware/ensure-auth');

app.use(require('morgan')('tiny', {
  skip: () => process.env.NODE_ENV === 'test'
}));

app.use(require('cookie-parser')());
app.use(express.json());

//routes go here
//app.use('/api/v1/auth', mongoConnection, require('./routes/auth'));


app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;

