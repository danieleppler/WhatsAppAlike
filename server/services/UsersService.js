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
            Contacts:UserFromDB.Contacts,
            BlockedUsers:UserFromDB.BlockedUsers 
        }
    }
    return null
}

const GetUserById = async (id) =>{
    const User = await UserModel.findById(id)
    return User
}

const BlockUser = async(userToBlock , user)=>{
    let userFound = await UserModel.findById(user)
    let temp = userFound.BlockedUsers
    temp = [...temp,userToBlock.userId]
    const data = await UserModel.findByIdAndUpdate(user,{BlockedUsers:temp})
    return data
}

const GetUsersThatBlockYou = async (id) =>{
    let users = await UserModel.find({"BlockedUsers":{ "$regex": id, "$options": "i" }})
    return users
}

const RemoveBlockFromUser = async( user,userToRemoveBlock )=>{
    let userFound = await UserModel.findById(user.userId)
    let temp = userFound.BlockedUsers
    temp = temp.filter((x) => x !== userToRemoveBlock)  
    const data = await UserModel.findByIdAndUpdate(user.userId,{BlockedUsers:temp})
    return data
}


module.exports = {VerifiyUser,GetUserById,BlockUser,GetUsersThatBlockYou,RemoveBlockFromUser}