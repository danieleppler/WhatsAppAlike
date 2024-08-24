const massageModel = require('../models/MassageModel')
const generalFuncs = require('../utils/GeneralFuncs')
const userModel = require('../models/UserModel')
const groupModel = require('../models/GroupModel')

const getUserChats = async (userid) =>{

     //for Private massages
     const data = await massageModel.find({ // get all private massage sent and recived by the user AND group massages sent by the user
          $or :[
               {
                    sender : userid 
               },{
                    receiver : userid
               }    
          ]
     })

     const grps =  await groupModel.find({}) //get all the groups  

     const Chats = generalFuncs.groupBy(data,"sender") //group the massages by keys

     if(Chats[userid]){ // if we have massages sent by the user - add this massages to the reciver key
          Chats[userid].forEach(element => {
               
               if(!Chats[element.receiver]) // in case the reciver didnt sent any massages
                    Chats[element.receiver] = []
               
               Chats[element.receiver].push(element)
                  
          }); 
     }
     
     delete Chats[userid] // remove the userid key - all his sent massages are already in the recivers keys

     const FinalResp  = []

     for (const key in Chats) {
          if(!grps?.map((x)=>x._id.toString()).includes(key.toString())){ // if the current reciver is group dont add this massage, we will add it in the group block
               {
                    Chats[key].sort((a,b)=>{ // sort the chat by massages date
                         return new Date(a.date) - new Date(b.date)
                       })
               
                       const lastMassage = Chats[key].reduce((a, b) => {  // get the last sent massage
                         return a > b ? a : b;
                     })
               
                     
                         const User = await userModel.findById(key)
               
                         FinalResp.push({
                              Chat_With_Name:User.DisplayName,
                              Chat_With_Id:User._id,
                              Last_Massage:lastMassage.massage,
                              Last_Massage_Sent_In:lastMassage.date,
                              Massages:Chats[key],
                              Type: "Private"          
                              })
               
                         
                      
               
                    //  const NumberOfUnred = Chats[key].reduce((a,b) =>{
                    //      if(!b.hadRed){
                    //           a++
                    //      }
                    //      return a;
                    //  },0)
                    } 
               }  
          }
               
        

     //deal with group chats
     const userGroups = grps.filter((x)=> x.Users.includes(userid)).map((x)=>x._doc)
          
     for (const grp in userGroups) {
          const data = await massageModel.find({ // get all massages sent to this group
                         receiver : userGroups[grp]._id
          })
          if(!data[0]){ //if not massages sent to this group ,  add empty group chat
               FinalResp.push({
                    Chat_With_Name:userGroups[grp].GroupTitle,
                    Chat_With_Id:userGroups[grp]._id,
                    Last_Massage:"",
                    Last_Massage_Sent_In:null,
                    Massages:[],
                    Type: "Group"   
               })
          }
          else{
               let temp = data.map((x)=>{return x._doc})
               temp.sort((a,b)=>{ // sort the chat by massages date
                    return new Date(a.date) - new Date(b.date)
                  })
          
                  const lastMassage = temp.reduce((a, b) => {  // get the last sent massage
                    return a > b ? a : b;
                })

                FinalResp.push({
                    Chat_With_Name:userGroups[grp].GroupTitle,
                    Chat_With_Id:userGroups[grp]._id,
                    Last_Massage:lastMassage.massage,
                    Last_Massage_Sent_In:lastMassage.date,
                    Massages:temp,
                    Type: "Group"   
               })
          }
     }


     return FinalResp
}

const sendMassage = async (massage) =>{
     const newMassage = new massageModel(massage)
     const addedMassage = await newMassage.save()
     return addedMassage._id
}

const DeleteUserMassages = async (userId) =>{
     const data= await massageModel.deleteMany({
          $or :[
               {receiver:userId},{sender:userId}
          ]
     })
     return data
}

module.exports = {getUserChats,sendMassage,DeleteUserMassages}