import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import '../css/Chats.css'
import '../css/Chat.css'
import Socket from '../SocketClient'
import ManageGroupModal from './modals/ManageGroupModal'

const ChatComp = () => {


  const CurrentOpenChat = useSelector((state)=>{return state.root.CurrentOpenChat})

  const CurrentLoggedUser  = useSelector((state)=>{return state.root.CurrentLoggedUser})

  const UserContacts = useSelector((state) => {
    let tempUsers = [...state.root.usercontacts]
    tempUsers.push({id:CurrentLoggedUser.userId,DisplayName:CurrentLoggedUser.DisplayName})
    return tempUsers
  })


  const [Chat,SetChat] = useState()
  const [IsUserGroupAdmin,SetIsUserGroupAdmin] = useState(false)
  const [NewMassage,SetNewMassage] = useState()
  const [GroupInfo,SetGroupInfo] = useState()

  

  const url = 'http://localhost:3000/massages/send'
  const groupsUrl  = 'http://localhost:3000/groups'
  const massagesUrl  = 'http://localhost:3000/massages'

  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(()=>{
    if(CurrentOpenChat)
    {
      const CheckAdmin  = async () =>{
        const {data:GrpInfo} = await axios.get(`${groupsUrl}/groupInfo/${CurrentOpenChat.Chat_With_Id}`,{headers:{token:CurrentLoggedUser.token}})
        SetGroupInfo(GrpInfo)
        console.log(GroupInfo)
        if(GrpInfo.Creator === CurrentLoggedUser.userId)
          SetIsUserGroupAdmin(true)
      }
      if(CurrentOpenChat.Type === "Group"){
        CheckAdmin()
      }
      SetChat(CurrentOpenChat)
    }
  },[CurrentOpenChat])

  useEffect(()=>{
    Socket.Socket.on('RecieveMassage',(msg)=>{
      if(CurrentOpenChat)
      {
        let temp = {...CurrentOpenChat}
        temp.Massages.push(msg)
        temp = {...temp,Last_Massage:msg.massage,Last_Massage_Sent_In:new Date().toISOString()}  
        dispatch({type:"update_CurrentOpenChat",payload:temp})
      }
    })
  },[])

  const handleDeleteGroupClicked = async () => {
    //Delete the group from groups table
    const {data:resp1} = await axios.delete(`${groupsUrl}/${CurrentOpenChat.Chat_With_Id}`,{headers:{token:CurrentLoggedUser.token}})

    //Delete all the related massages of the group
    const {data:resp2} = await axios.delete(`${massagesUrl}/${CurrentOpenChat.Chat_With_Id}`,{headers:{token:CurrentLoggedUser.token}})

    //Go back to Chats screen

    navigate('/Chats')

}
  const handleGoBackClicked =() =>{
    navigate("/chats")
  }

  const handleMassageSent = async () =>{
    let currentTime = new Date().toISOString()

    //now we need to identify if the reciever end of the chat is connected to the chat right now so we can 
    //mark the massage as red. we will do so through communicating with his socket

    //Socket.Socket.emit("CheckConnectionWithReciver")


    let massageToSend ={
      sender:CurrentLoggedUser.userId,
      massage:NewMassage,
      receiver:Chat.Chat_With_Id,
      date:currentTime,
      type:CurrentOpenChat.Type}
      
    
    const {data} = await axios.post(url,
      massageToSend
    ,{headers:{token:CurrentLoggedUser.token}})

    if (data){
      massageToSend = {...massageToSend,_id : data._id}
      let temp = {...Chat}
      temp.Massages.push(massageToSend)
      temp.Last_Massage = NewMassage
      temp.Last_Massage_Sent_In = currentTime

      dispatch({type:"update_CurrentOpenChat",payload:temp})

      Socket.Socket.emit("sendMessage",massageToSend)
      SetNewMassage('')
    }
  }

  const GetSenderName = (x) =>{
    if(UserContacts)
    {
      let temp = UserContacts.find((z) => z.id === x.sender)
      return temp.DisplayName
  
    }
}

  const handleAddContact = async (e) =>{
    const temp = UserContacts.find((x) => x.DisplayName === e.target.innerText).id
    const {data:resp} = await axios.put(`${groupsUrl}/addUser`,{userId:temp,GroupId:CurrentOpenChat.Chat_With_Id},{headers:{token:CurrentLoggedUser.token}})
  }

  const EditGroupTitleCallBack =async  (title) =>{
    const {data:resp} = await axios.put(`${groupsUrl}/editGroupTitle`,{title:title,id:CurrentOpenChat.Chat_With_Id},{headers:{token:CurrentLoggedUser.token}})
  }

  return (
    <div style={{border:"1px solid black",padding:"30px",marginLeft:"600px"}}>
      <button style={{background:"green"}} onClick={handleGoBackClicked}>Return to all chats</button><br />
      <ManageGroupModal DeleteGroupCallBack = {handleDeleteGroupClicked} AddContactCallBack = {handleAddContact} UserContacts ={UserContacts.filter((x) => x.id !==CurrentLoggedUser.userId)} GroupInfo = {GroupInfo} EditGroupTitleCallBack={EditGroupTitleCallBack}/>
      {IsUserGroupAdmin && <button
          className="btn btn-primary"
          data-toggle="modal"
          data-target="#ManageGroupModal"
        >ManageGroup</button>}
        
        <ul>
        {
          Chat?.Massages.map((x,index)=>{
            return <div className='row' key={index}>
              <span className = {x.sender === CurrentLoggedUser.userId?"dialog_box right":"dialog_box left"}>{x.massage}</span>
              {CurrentOpenChat.Type === "Group" ? <div>{GetSenderName(x)}</div>:<></>}
            </div>
          })
        }  
        </ul>
        <input value ={NewMassage} onChange={(e)=>{
          SetNewMassage(e.target.value)
        }}></input> <button onClick={handleMassageSent}>Send</button>
    </div>
  )
}

export default ChatComp
