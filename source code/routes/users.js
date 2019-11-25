const {
  User,
  validate
} = require('../models/user');
const bcrypt = require("bcrypt");
const _ = require("lodash");
const mongoose = require('mongoose');
const express = require('express');
const functions = require('../global/functions');

const router = express.Router();

router.post('/', async (req, res) => {

  const {
    error
  } = validate(req.body);
  if (error) return res.status(400).send(functions.getResponse(0, error.details[0].message, []));

  let user = await User.findOne({
    email: req.body.email
  });

  if (user) return res.status(400).send("User already registered.");


  user = new User(_.pick(req.body, ['name', 'email', 'password']));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  user = await user.save();

  const token = user.generateAuthToken();

  res.header('x-auth-token', token).status(200).send(functions.getResponse(1, 'userCreated', _.pick(user, ['_id', 'name', 'email'])));



});

module.exports = router;