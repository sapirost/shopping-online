const express = require('express');
const router = express.Router();
const userModule = require('../modules/user.module');
const passport = require('passport');
// const bcrypt = require('bcryptjs');
// const saltRounds = 8;
// const UserModel = require('../models/userModel');
const auth = require('../middleware/authentication');

// Create app's admin
// router.get('/add-admin', async (req, res) => {
//   const exist = await UserModel.findOne({ numberID: '9876' });
//   if (!exist) {
//     bcrypt.hash('1111', saltRounds, async (err, hash) => {
//       const admin = new UserModel({
//         numberID: '9876', password: hash, email: 'admin@gmail.com',
//         firstName: 'sapir', lastName: 'admin', city: '', street: '', role: 'admin'
//       });
//       await admin.save();
//     });
//   }
//   res.json({ msg: 'finish' });
// });

router.post('/register', passport.authenticate('local-register'), async (req, res) => {
  const token = userModule.getUserToken(req.user, null);
  res.json({ token });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await userModule.login(email, password)

  let cart;
  if (user.role == 'user') {
      cart = await userModule.getCart(user._id);
  }

  const token = userModule.getUserToken(user, cart);
  res.json({token});
});

router.get('/cart', auth, async (req, res) => {
  const cart = await userModule.getCart(req.user._id);

  res.json(cart);
})

router.put('/:id', auth, async (req, res, next) => {
  var result = await userModule.addToCart(req.user._id, req.params.id, req.body.quantity);
  res.json(result);
});

router.delete('/:id', auth, async (req, res, next) => {
  var result = await userModule.removeFromCart(req.user._id, req.params.id);
  res.json(result);
});

router.get('/delivery-user-info', auth, async (req, res) => {
  const user = await userModule.findUserById(req.user._id);

  if (user) {
    res.json({ deliveryInfo: { city: user.city, street: user.street } });
  } else {
    res.json({ deliveryInfo: null });
  }
})

module.exports = router;
