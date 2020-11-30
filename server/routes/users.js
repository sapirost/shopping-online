var express = require('express');
var router = express.Router();
var userModule = require('../modules/user.module');
var passport = require('passport');
const bcrypt = require('bcryptjs');
const saltRounds = 8;
const UserModel = require('../models/userModel');
const jwt = require('jsonwebtoken');

//add the app's admin
router.get('/add-admin', async function (req, res) {
  const exist = await UserModel.findOne({numberID: '9876' });
    if (!exist) {
      bcrypt.hash('1111', saltRounds, async function (err, hash) {
        const admin = new UserModel({
          numberID: '9876', password: hash, usernameMail: 'admin@gmail.com',
          firstName: 'sapir', lastName: 'admin', city: '', street: '', role: 'admin'
        });
        await admin.save();
      });
    }
    res.json({msg:'finish'});
});

router.post('/register', passport.authenticate('local-register'),
  async function (req, res) {
    if (req.session.passport) {
      const body = { connect: true, success: req.user.usernameMail, role: req.user.role, myCart: {cart: null} };
      const token = jwt.sign(body, 'TOP_SECRET');

      res.json({ token });
    } else
      res.json({ connect: false, fail: 'user disconnected' });
  });

router.post('/login', passport.authenticate('local-login'),
  async function (req, res) {
    if (req.session.passport) {
      if (req.user.role == 'user') {
        const results = await userModule.getCart(req.user._id);

        const body = { connect: true, success: req.user.usernameMail, role: req.user.role, name: req.user.firstName, myCart: results };
        const token = jwt.sign(body, 'TOP_SECRET');
  
        res.json({ token });
      } else {
        res.json({ connect: true, success: req.user.usernameMail, role: req.user.role, name: req.user.firstName });
      }
    } else
      res.json({ connect: false, fail: 'user disconnected' });
  });


router.post('/check-user', async (req, res, next) => {
  var foundUser = await userModule.findUser(req.body.numberID);
  if (foundUser !== null) {
    res.json({ exist: true });
  }
  else
    res.json({ exist: false });
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  res.json({ msg: 'user disconnected' });
});

router.get('/get-connected-member', async function (req, res) {
  if (req.isAuthenticated()) {
    if (req.user.role == 'user') {
      var results = await userModule.getCart(req.user._id);
      res.json({ connect: true, success: req.user.usernameMail, role: req.user.role, myCart: results })
    } else {
      res.json({ connect: true, success: req.user.usernameMail, role: req.user.role })
    }
  } else
    res.json({ connect: false, fail: 'user disconnected' });
}); 

router.put('/:id', async (req, res, next) => {
  console.log("🚀 ~ file: users.js ~ line 74 ~ router.put ~ req", req.user)
  if (req.isAuthenticated()) {
    var result = await userModule.addToCart(req.user._id, req.params.id, req.body.quantity);
    res.json(result);
  } else {
    res.json({ fail: 'user disconnected' })
  }
});

router.delete('/:id', async (req, res, next) => {
  if (req.isAuthenticated()) {
    var result = await userModule.removeFromCart(req.user._id, req.params.id);
    res.json(result);
  } else {
    res.json({ fail: 'user disconnected' })
  }
});

router.get('/delivery-user-info', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ deliveryInfo: { city: req.user.city, street: req.user.street } });
  } else {
    res.json({ deliveryInfo: null });
  }
})

module.exports = router;
