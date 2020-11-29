const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderModel = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    city: String,
    street: String,
    deliveryDate: String,
    orderDate: String,
    creditDigit: String,
    totalPrice: Number,
    cart: { type: Object, ref: 'carts'}
});

module.exports = mongoose.model('orders', OrderModel);