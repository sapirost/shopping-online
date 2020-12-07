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

//insert categories list
router.get('/insert-categories', auth, async (req, res, next) => {
  var allCategories = await storeModule.insertAllCategories();
  res.json(allCategories);
});

//get unavailable dates for shipping
router.get('/unavailable-dates', auth, async (req, res, next) => {
  var results = await storeModule.unavailableDates();
  res.json(results);
})

//getting general information for landing page
router.get('/get-info', auth, async function (req, res, next) {
  console.log("🚀 ~ file: users.js ~ line 54 ~ router.get ~ req.user", req.user)
  var result = await storeModule.getGeneralInfo();
  var infoObject = result;
  if (req.session.passport && req.user.role == 'user') {
    var secondResult = await storeModule.checkCartStatus(req.user._id);
    infoObject = Object.assign(result, secondResult );
  }
  res.json(infoObject);
});

//get all products
router.get("/all", auth, async function (req, res) {
  var data = await storeModule.getAllProducts();
  res.json(data);
});

//get categories list
router.get("/categories", auth, async function (req, res) {
  var result = await storeModule.getAllCategories();
  res.json(result);
});

//find the exact image in the server
router.get('/image/:name', (req, res, next) => {
  var place = path.resolve(".");
  var image = (path.join(place, "public\\uploads\\", req.params.name));
  if (!fs.existsSync(image)) {
    image = path.join(place, "public\\uploads\\", "404error.jpeg");
  }
  res.sendFile(image);
})

//get all products from specific category
router.get("/by-category-id/:id", auth, async function (req, res) {
  var data = await storeModule.getProductsFromCategory(req.params.id);
  res.json(data);
});

//find product by name
router.get('/by-name/:name', auth, async (req, res, next) => {
  var results = await storeModule.findProducts(req.params.name);
  res.json(results);
})

//delete product
router.delete('/:id', auth, async (req, res, next) => {
  var results = await storeModule.deleteProduct(req.params.id);
  res.json(results);
})

//get specific product
router.get('/:id', auth, async (req, res, next) => {
  var results = await storeModule.findProductById(req.params.id);
  res.json(results);
})

//update existing product
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

//submit new order
router.post("/send-order", auth, async function (req, res) {
  var data = await storeModule.submitOrder(req.body, req.user._id);
  res.json(data);
});

//adding new product
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
