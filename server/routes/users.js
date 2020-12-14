const express = require('express');
const router = express.Router();
const userModule = require('../modules/user.module');
const passport = require('passport');
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
  try {
    const token = await userModule.register(req.body);

    res.json({ token });
  } catch (error) {
    res.status(401).json(error);
  }


  const token = userModule.getUserToken(req.user, null);
  res.json({ token });
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await userModule.login(email, password);

    res.json({ token });
  } catch (error) {
    res.status(401).json(error);
  }
});

router.get('/cart', auth, async (req, res) => {
  try {
    const cart = await userModule.getCart(req.user._id);

    res.json(cart);
  } catch (error) {
    res.json(error);
  }
})

router.put('/:id', auth, async (req, res, next) => {
  try {
    const result = await userModule.addToCart(req.user._id, req.params.id, req.body.quantity);

    res.json(result);
  } catch (error) {
    res.json(error);
  }
});

router.delete('/:id', auth, async (req, res, next) => {
  try {
    const result = await userModule.removeFromCart(req.user._id, req.params.id);

    res.json(result);
  } catch (error) {
    res.json(error);
  }
});

router.get('/delivery-user-info', auth, async (req, res) => {
  try {
    const user = await userModule.findUserById(req.user._id);

    res.json({ deliveryInfo: { city: user.city, street: user.street } });
  } catch (error) {
    res.json(error);
  }
})

module.exports = router;
