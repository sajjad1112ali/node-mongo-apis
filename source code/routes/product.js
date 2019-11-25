const {Product, validate, validateID} = require('../models/product'); 
const express = require('express');
const auth = require('../middleware/auth');
const functions = require('../global/functions');
const _ = require("lodash");
const router = express.Router();



router.get('/', async (req, res) => {
  let searchObj =  {};
  let options =  {};
  if(Object.keys(req.query).length !== 0)
  {
    let limit = parseInt(req.query.limit);
    let page = parseInt(req.query.page);
     options = {
      limit,
      page
    };
  }


  const products = await Product.paginate({}, options);

  res.send(functions.getResponse(1,'fetchedSuccess', products));
});

router.post('/add', auth, async (req, res) => {
  const { error } = validate(req.body); 
  console.log("error");

  if (error) return res.status(400).send(functions.getResponse(0, error.details[0].message, []));


  let product = new Product(_.pick(req.body, ['name','description', 'image_url', 'cost', 'available']));

  product = await product.save();
  
  res.send(functions.getResponse(1,'recordAdded', product));
});

router.put('/:id', auth, async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(functions.getResponse(0, error.details[0].message, []));
  
    const product = await Product.findByIdAndUpdate(req.params.id,_.pick(req.body, ['name','description', 'image_url', 'cost', 'available']), { new: true });
  
    if (!product) return res.status(404).send(functions.getResponse(0, 'recordNotFound', []));

    res.status(200).send(functions.getResponse(1, 'ProductUpdated', product));
    
} );

router.delete('/:id', auth, async (req, res) => {
    const product = await Product.findByIdAndRemove(req.params.id);
  
    if (!product) return res.status(404).send(functions.getResponse(0, 'ProductNotFound', []));
  
    res.status(200).send(functions.getResponse(1, 'ProductDeleted', []));
});

router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) return res.status(404).send('The product with the given ID was not found.');

  res.status(200).send(functions.getResponse(1, 'fetchedSuccess', product));
});

router.post('/upload/image', (req, res) => {
  
  console.log(req.files );

  res.send("Called...");
});



module.exports = router; 