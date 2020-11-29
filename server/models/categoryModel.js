const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categoryModel = new Schema({
    name:String
});

module.exports = mongoose.model('categories', categoryModel);