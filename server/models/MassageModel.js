const mongoose = require('mongoose')

const MassageSchema = mongoose.Schema({
    sender:{type:String},
    receiver:{type:String},
    massage:{type:String},
    date:{type:String}
})

module.exports = new mongoose.model('massage',MassageSchema)