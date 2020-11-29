const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const catModel = new Schema({
    name:String
});

module.exports = mongoose.model('categories', catModel);