const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProdModel = new Schema({
    name:String,
    category:{ type: mongoose.Schema.Types.ObjectId, ref: 'categories'},
    price:Number,
    image:String
});

module.exports = mongoose.model('products', ProdModel);