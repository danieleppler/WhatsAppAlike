const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username:{type:String},
    password:{type:String},
    DisplayName:{type:String},
    Contacts:{type:Array}
})

module.exports = mongoose.model('user',UserSchema)