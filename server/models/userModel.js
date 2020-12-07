const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserModel = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    numberID: String,
    password: String,
    city: String,
    street: String,
    role: String
});

module.exports = mongoose.model('users', UserModel);