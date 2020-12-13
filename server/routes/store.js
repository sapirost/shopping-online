var express = require('express');
var router = express.Router();
var storeModule = require('../modules/store.module');
const auth = require('../middleware/authentication');

var multer = require("multer");
var path = require('path');
var fs = require('fs');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ storage: storage }).single('image');

// Insert categories list
router.get('/insert-categories', auth, async (req, res, next) => {
  var allCategories = await storeModule.insertAllCategories();
  res.json(allCategories);
});

// Get unavailable dates for shipping
router.get('/unavailable-dates', auth, async (req, res, next) => {
  var results = await storeModule.unavailableDates();
  res.json(results);
})

// Getting general information
router.get('/get-info', async function (req, res, next) {
  const result = await storeModule.getGeneralInfo();
  res.json(result);
});

// Getting all products
router.get("/all", auth, async function (req, res) {
  var data = await storeModule.getAllProducts();
  res.json(data);
});

// Getting categories list
router.get("/categories", auth, async function (req, res) {
  var result = await storeModule.getAllCategories();
  res.json(result);
});

// Finding the exact image in the server
router.get('/image/:name', (req, res, next) => {
  var place = path.resolve(".");
  var image = (path.join(place, "public\\uploads\\", req.params.name));
  if (!fs.existsSync(image)) {
    image = path.join(place, "public\\uploads\\", "404error.jpeg");
  }
  res.sendFile(image);
})

// Getting all products from specific category
router.get("/by-category-id/:id", auth, async function (req, res) {
  var data = await storeModule.getProductsFromCategory(req.params.id);
  res.json(data);
});

// Finding product by name
router.get('/by-name/:name', auth, async (req, res, next) => {
  var results = await storeModule.findProducts(req.params.name);
  res.json(results);
})

// Deleting product
router.delete('/:id', auth, async (req, res, next) => {
  var results = await storeModule.deleteProduct(req.params.id);
  res.json(results);
})

// Getting specific product
router.get('/:id', auth, async (req, res, next) => {
  var results = await storeModule.findProductById(req.params.id);
  res.json(results);
})

// Updating existing product
router.put('/:id', auth, async (req, res, next) => {
  var result;
  upload(req, res, async function (err) {
    if (req.file !== undefined) {
      result = await storeModule.updateProductById(req.params.id, Object.assign(req.body, {image: path.basename(req.file.path)}));
      await res.json(result);
    } else {
      delete req.body.image;
      result = await storeModule.updateProductById(req.params.id, req.body);
      await res.json(result);
    }
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err)
    } else if (err) {
      return res.status(500).json(err)
    }
  });
});

// Submitting new order
router.post("/send-order", auth, async function (req, res) {
  var data = await storeModule.submitOrder(req.body, req.user._id);
  res.json(data);
});

// Adding new product
router.post("/", auth, async function (req, res) {
  upload(req, res, async function (err) {
    if (err || req.file == undefined) {
      res.status(500).send('Something broke!')
    } else {
      var resp = await storeModule.addNewProduct(req.body.name, req.body.price, req.body.category,
        path.basename(req.file.path));
      res.json(resp);
    }
  })
});

module.exports = router;
