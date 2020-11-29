const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemModel = new Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'products'},
    quantity: Number,
    price: Number,
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'carts'}
});

module.exports = mongoose.model('items', ItemModel);