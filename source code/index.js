//require('express-async-errors');
const config = require('config');
const Joi = require('joi');
const mongoose = require('mongoose');
const customers = require('./routes/customers');
const users = require('./routes/users');
const auth = require('./routes/auth');
const product = require('./routes/product');
const express = require('express');
const cors = require('cors');
const error = require('./middleware/error');
const bodyParser = require('body-parser');

var fs = require('fs');
var busboy = require('connect-busboy');

const app = express();

if(!config.get('jwtPrivateKey'))
{
  console.error('FATAL ERROR: jwtPrivateKey is not defined.');
  process.exit(1);
}
mongoose.connect('mongodb://localhost/authentication')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));


app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.use('/api/customers', customers);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/product', product);

app.use(error);

const port = process.env.PORT || 3010;
app.listen(port, () => console.log(`Listening on port ${port}...`));