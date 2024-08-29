const GroupModel  = require('../models/GroupModel')
const { GetUserById } = require('./UsersService')

const GetUserGroups = async (id) =>{
    const data = await GroupModel.find({"Users":{ "$regex": id, "$options": "i" }})
    return data 
}

const AddGroup = async (data) =>{
    const newgrpToSave = new GroupModel(data)
    const addedgrp = await newgrpToSave.save()
    return addedgrp._id
}

const GetGroupUsers = async (id) =>{
    const data = await GroupModel.findById(id)
    return data.Users
}

const DeleteGroup = async (id) =>{
    const data = await GroupModel.findOneAndDelete({_id:id}) 
    return data
}

const GetGroupInfo = async (id) =>{
    const data = await GroupModel.findById(id)
    return data
}

const AddUserToGroup = async (Userid,GroupId) =>{
    const old_data = await GroupModel.find({_id:GroupId})
    if(!old_data[0].Users.find((x) => x === Userid)) 
        return await GroupModel.findOneAndUpdate({_id:GroupId},{Users:[...old_data[0].Users,Userid]})
    return old_data
}

const EditGroupTitle = async (title,id) =>{
    const old_data = await GroupModel.find({_id:id})
    return await GroupModel.findOneAndUpdate({_id:id},{GroupTitle:title})
}

const RemoveUsersFromGroup =async (users,id) =>{
    const old_data = await GroupModel.find({_id:id})
    let temp = users.map((x) => x.id)
    const new_users = old_data[0].Users.filter((x) => {return !temp.includes(x)})
    return await GroupModel.findOneAndUpdate({_id:id},{Users:new_users})
}

module.exports = {EditGroupTitle,GetUserGroups,AddGroup,GetGroupUsers,DeleteGroup,GetGroupInfo,AddUserToGroup,RemoveUsersFromGroup}