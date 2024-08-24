const mongoose = require('mongoose')

const GroupScehma = mongoose.Schema({
    GroupTitle:{type:String},
    GroupDescription:{type:String},
    Users:{type:Array},
    Creator:{type:String}
})

module.exports = new mongoose.model('group',GroupScehma)