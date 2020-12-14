const express = require('express');
const router = express.Router();
const storeModule = require('../modules/store.module');
const auth = require('../middleware/authentication');

const multer = require("multer");
const path = require('path');
const fs = require('fs');


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
  try {
    const allCategories = await storeModule.insertAllCategories();

    res.json(allCategories);
  } catch (error) {
    res.json(error);
  }
});

// Get unavailable dates for shipping
router.get('/unavailable-dates', auth, async (req, res, next) => {
  try {
    const results = await storeModule.unavailableDates();

    res.json(results);
  } catch (error) {
    res.json(error);
  }
})

// Getting general information
router.get('/get-info', async function (req, res, next) {
  try {
    const results = await storeModule.getGeneralInfo();

    res.json(results);
  } catch (error) {
    res.json(error);
  }
});

// Getting all products
router.get("/all", auth, async function (req, res) {
  try {
    const results = await storeModule.getAllProducts();

    res.json(results);
  } catch (error) {
    res.json(error);
  }
});

// Getting categories list
router.get("/categories", auth, async function (req, res) {
  try {
    const results = await storeModule.getAllCategories();

    res.json(results);
  } catch (error) {
    res.json(error);
  }
});

// Finding the exact image in the server
router.get('/image/:name', (req, res, next) => {
  const place = path.resolve(".");
  const image = (path.join(place, "public\\uploads\\", req.params.name));

  if (!fs.existsSync(image)) {
    image = path.join(place, "public\\uploads\\", "404error.jpeg");
  }
  res.sendFile(image);
})

// Getting all products from specific category
router.get("/by-category-id/:id", auth, async function (req, res) {
  try {
    const results = await storeModule.getProductsFromCategory(req.params.id);

    res.json(results);
  } catch (error) {
    res.json(error);
  }
});

// Finding product by name
router.get('/by-name/:name', auth, async (req, res, next) => {
  try {
    const results = await storeModule.findProducts(req.params.name);

    res.json(results);
  } catch (error) {
    res.json(error);
  }
})

// Deleting product
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const results = await storeModule.deleteProduct(req.params.id);

    res.json(results);
  } catch (error) {
    res.json(error);
  }
})

// Getting specific product
router.get('/:id', auth, async (req, res, next) => {
  try {
    const results = await storeModule.findProductById(req.params.id);

    res.json(results);
  } catch (error) {
    res.json(error);
  }
})

// Updating existing product
router.put('/:id', auth, async (req, res, next) => {
  let result;
  upload(req, res, async function (err) {
    if (req.file !== undefined) {
      result = await storeModule.updateProductById(req.params.id, Object.assign(req.body, { image: path.basename(req.file.path) }));
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
  try {
    const results = await storeModule.submitOrder(req.body, req.user._id);

    res.json(results);
  } catch (error) {
    res.json(error);
  }
});

// Adding new product
router.post("/", auth, async function (req, res) {
  upload(req, res, async function (err) {
    if (err || req.file == undefined) {
      res.status(500).send('Something broke!')
    } else {
      const resp = await storeModule.addNewProduct(req.body.name, req.body.price, req.body.category,
        path.basename(req.file.path));
      res.json(resp);
    }
  })
});

module.exports = router;
