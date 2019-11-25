const {User} = require('../models/user'); 
const bcrypt = require("bcrypt");
const _ = require("lodash");
const mongoose = require('mongoose');
const express = require('express');
const Joi = require('joi');
const functions = require('../global/functions');

const router = express.Router();

router.post('/', async (req, res) => {

  const { error } = validate(req.body); 
  if (error) return res.status(400).send(functions.getResponse(0,error.details[0].message, []));
   
  let user = await User.findOne({email: req.body.email});

  if(!user) return res.status(400).send(functions.getResponse(0,'invalidCredentials', user));
  
  let validPassword = await bcrypt.compare(req.body.password, user.password); 
  if(!validPassword) return res.status(400).send(functions.getResponse(0,'invalidCredentials', user));
  
  const token = user.generateAuthToken();

  let responseToSend = _.pick(user, ['_id','name','email']);
  responseToSend.token = token;
  res.header('x-auth-token', token).send(functions.getResponse(1,'fetchedSuccess',responseToSend));
});

function validate(req) {
    const schema = {
      email: Joi.string().min(5).max(255).email().required(),
      password: Joi.string().min(5).max(255).required()
    };
  
    return Joi.validate(req, schema);
  }

module.exports = router; 