const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.set('useFindAndModify', false);

const ItemModel = new Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'products'},
    quantity: Number,
    price: Number,
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'carts'}
});

const cartModel = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    creationDate: String,
    status: String,
    items: [ ItemModel ]
});

module.exports = mongoose.model('carts', cartModel);