const UserModel = require('../models/UserModel')
const jwtFuncs = require('../utils/jwtFuncs')

const VerifiyUser = async (user)=>{
    const UserFromDB = await UserModel.findOne({username:user.username,password:user.password})
    if(UserFromDB)
    {
        const token  = jwtFuncs.signNewUser(user)
        return {
            _id : UserFromDB._id,
            username : user.username,
            DisplayName: UserFromDB.DisplayName,
            token,
            Contacts:UserFromDB.Contacts 
        }
    }
    return null
}

const GetUserById = async (id) =>{
    const User = await UserModel.findById(id)
    return User
}

module.exports = {VerifiyUser,GetUserById}