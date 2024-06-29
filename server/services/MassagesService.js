const massageModel = require('../models/MassageModel')



const addMassage = (msg) =>{
     const MassageToAdd = new massageModel(msg)
     massageModel.save()
}

module.exports = {addMassage}