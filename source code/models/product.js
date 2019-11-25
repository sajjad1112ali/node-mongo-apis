const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require("config");
const mongoosePaginate = require('mongoose-paginate');
Joi.objectId = require('joi-objectid')(Joi);

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 500
  },
  image_url: {
    type: String,
    required: true,
    minlength: 5
  },
  cost: {
    type: Number,
    min: 10,
    required: true
  },
  available: {
    type: Boolean,
    required: true
  }
});
productSchema.methods.costFormater = function(){
  return this.cost;
};
productSchema.plugin(mongoosePaginate);
const Product = mongoose.model('Product', productSchema);

function validateProduct(product) {
  const schema = {
    name: Joi.string().min(5).max(100).required(),
    description: Joi.string().min(5).max(500).required(),
    image_url: Joi.string().min(5).required(),
    cost: Joi.number().min(5).required(),
    available: Joi.boolean().required(),

  };
//    id: Joi.objectId().required(),
  return Joi.validate(product, schema);
}

exports.Product = Product; 
exports.validate = validateProduct;
