const UserModel = require('../models/userModel');
const CartModel = require('../models/cartModel');
const ProdModel = require('../models/prodModel');
const config = require('../config/settings');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const _ = require('lodash');

module.exports = {

    findUser: numberID => {
        return UserModel.findOne({ numberID: numberID });
    },

    findUserById: userId => {
        return UserModel.findOne({ _id: userId });
    },

    // getUserToken: (user, cart) => {
    //     const body = { _id: user._id, firstName: user.firstName, role: user.role, myCart: cart };
    //     return jwt.sign(body, config.Authentication.jwtAppSecret);
    // },

    login: (email, password) => {
        return new Promise(async (resolve, reject) => {
            const user = await UserModel.findOne({ email });

            if (!user) {
                reject({ message: 'user does not exist' })
            }

            const isPasswordMatch = await bcrypt.compare(password, user.password);

            if (!isPasswordMatch) {
                reject({ message: 'user does not exist' })
            }

            const body = { _id: user._id, firstName: user.firstName, role: user.role };
            const token = jwt.sign(body, config.Authentication.jwtAppSecret);
            resolve({ token });
        })
    },

    getCart: async userID => {
        const cartArr = [];
        let cart = await CartModel.findOne({ "user": userID, status: 'open' });
        if (_.isEmpty(cart)) {
            cart = await CartModel.findOne({ "user": userID });
        }

        await CartModel.findOne({ "user": userID, status: 'open' })
            .populate({
                path: 'items.product',
                model: 'products'
            })
            .exec()
            .then(docs => {
                docs.items.map(async doc => {
                    if (doc.product !== null) {
                        cartArr.push({
                            _id: doc._id,
                            productID: doc.product._id,
                            name: doc.product.name,
                            price: doc.price,
                            quantity: doc.quantity
                        });
                    } else {
                        await CartModel.findOneAndUpdate({ 'user': userID, 'items._id': doc.id },
                            { "$pull": { "items": { "_id": doc.id } } }, { safe: true, multi: true });
                    }
                });
            })
            .catch(err => { return err; });
        return {...cart, items: cartArr};
    },

    addToCart: (userID, productID, quantity) => {
        return new Promise(async (resolve, reject) => {
            const cart = await CartModel.findOne({ user: userID, status: 'open' });
            const singlePrice = await ProdModel.findOne({ _id: productID });
            if (!_.isEmpty(cart)) {
                if (cart.items.some(c => c.product.equals(productID))) {
                    await CartModel.findOneAndUpdate({ 'user': userID, status: 'open', 'items.product': productID },
                        { $inc: { "items.$.quantity": quantity, "items.$.price": (singlePrice.price * quantity) } })
                } else {
                    cart.items.push({
                        product: productID, quantity: quantity,
                        cart: cart._id, price: singlePrice.price * quantity
                    });
                    await cart.save();
                }
            } else {
                const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                const today = new Date();
                const newCart = new CartModel({ user: userID, creationDate: today.toLocaleDateString("en-US", options), status: 'open' })
                newCart.items.push({
                    product: productID, quantity: quantity,
                    cart: newCart._id, price: singlePrice.price * quantity
                })
                await newCart.save();
            }
            const cartData = await module.exports.getCart(userID);
            resolve(cartData);
            reject([]);
        });
    },

    removeFromCart: (userID, productID) => {
        return new Promise(async (resolve, reject) => {
            const singleProduct = await ProdModel.findOne({ _id: productID });

            await CartModel.findOneAndUpdate({ 'user': userID, status: 'open', 'items.product': productID },
                { $inc: { "items.$.quantity": -1, "items.$.price": -(singleProduct.price) } })

            await CartModel.findOneAndUpdate({ 'user': userID, status: 'open', 'items.quantity': 0 },
                { "$pull": { "items": { "quantity": 0 } } }, { safe: true, multi: true });

            const cartData = await module.exports.getCart(userID);
            resolve(cartData);
            reject([]);
        });
    }
}

// module.exports = userModule;