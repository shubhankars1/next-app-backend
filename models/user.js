
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name : String,
    email : String,
    password : String,
    // phonecode : String,
    // phone : String,
    // country : String,
}, {versionKey:false});

const User = new mongoose.model('User', userSchema, 'userTable');

module.exports = User;