var UserModel = require('../models/userModel');
var CartModel = require('../models/cartModel');
var ProdModel = require('../models/prodModel');

var userModule = {

    findUser: function (numberID) {
        return UserModel.findOne({ numberID: numberID });
    },

    getCart: async function (userID) {
        var cartArr = [];
        var myCart = await CartModel.findOne({ "user": userID, status: 'open' });
        if (myCart == null || myCart == undefined)
            myCart = await CartModel.findOne({ "user": userID });

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
        return { cartItems: cartArr, cart: myCart };
    },

    addToCart: function (userID, productID, quantity) {
        return new Promise(async (resolve, reject) => {
            var myCart = await CartModel.findOne({ user: userID, status: 'open' });
            var singlePrice = await ProdModel.findOne({ _id: productID });
            if (myCart !== null && myCart !== undefined) {

                if (myCart.items.some(c => c.product.equals(productID))) {
                    await CartModel.findOneAndUpdate({ 'user': userID, status: 'open', 'items.product': productID },
                        { $inc: { "items.$.quantity": quantity, "items.$.price": (singlePrice.price * quantity) } })
                } else {
                    myCart.items.push({
                        product: productID, quantity: quantity,
                        cart: myCart._id, price: singlePrice.price * quantity
                    });
                    await myCart.save();
                }
            } else {
                var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                var today = new Date();
                var newCart = new CartModel({ user: userID, creationDate: today.toLocaleDateString("en-US", options), status: 'open' })
                newCart.items.push({
                    product: productID, quantity: quantity,
                    cart: newCart._id, price: singlePrice.price * quantity
                })
                await newCart.save();
            }
            var cartData = await this.getCart(userID);
            resolve(cartData);
            reject([]);
        });
    },

    removeFromCart: function (userID, productID) {
        return new Promise(async (resolve, reject) => {
            var singleProduct = await ProdModel.findOne({ _id: productID });

            await CartModel.findOneAndUpdate({ 'user': userID, status: 'open', 'items.product': productID },
                { $inc: { "items.$.quantity": -1, "items.$.price": -(singleProduct.price) } })

            await CartModel.findOneAndUpdate({ 'user': userID, status: 'open', 'items.quantity': 0 },
                { "$pull": { "items": { "quantity": 0 } } }, { safe: true, multi: true });

            var cartData = await this.getCart(userID);
            resolve(cartData);
            reject([]);
        });
    }
}

module.exports = userModule;