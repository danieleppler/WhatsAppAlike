import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import '../css/Chats.css'
import '../css/Chat.css'
import Socket from '../SocketClient'
import ManageGroupModal from './modals/ManageGroupModal'

const ChatComp = () => {


  const CurrentOpenChat = useSelector((state) => { return state.root.CurrentOpenChat })

  const CurrentLoggedUser = useSelector((state) => { return state.root.CurrentLoggedUser })

  const UserContacts = useSelector((state) => {
    let tempUsers = [...state.root.usercontacts]
    tempUsers.push({ id: CurrentLoggedUser.userId, DisplayName: CurrentLoggedUser.DisplayName })
    return tempUsers
  })


  const [Chat, SetChat] = useState()
  const [IsUserGroupAdmin, SetIsUserGroupAdmin] = useState(false)
  const [NewMassage, SetNewMassage] = useState()
  const [GroupInfo, SetGroupInfo] = useState()
  const [isUserBlocked, SetisUserBlocked] = useState(false)
  const [isUserBlockedYou, SetisUserBlockedYou] = useState(false)



  const url = 'http://localhost:3000/massages/send'
  const groupsUrl = 'http://localhost:3000/groups'
  const massagesUrl = 'http://localhost:3000/massages'
  const usersUrl = 'http://localhost:3000/users'

  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    if (CurrentOpenChat) {
      const CheckAdmin = async () => {
        const { data: GrpInfo } = await axios.get(`${groupsUrl}/groupInfo/${CurrentOpenChat.Chat_With_Id}`, { headers: { token: CurrentLoggedUser.token } })
        SetGroupInfo(GrpInfo)
        console.log(GroupInfo)
        if (GrpInfo.Creator === CurrentLoggedUser.userId)
          SetIsUserGroupAdmin(true)
      }
      const checkIfUserBlockYou = async () => {
        const { data: resp } = await axios.get(`${usersUrl}/GetUsersThatBlockYou/${CurrentLoggedUser.userId}`, { headers: { token: CurrentLoggedUser.token } })
        if (resp.map((x) => x._id).includes(CurrentOpenChat.Chat_With_Id))
          SetisUserBlockedYou(true)
      }

      if (CurrentOpenChat.Type === "Group") {
        CheckAdmin()
      }
      else {
        console.log(CurrentLoggedUser.BlockedUsers)
        if (CurrentLoggedUser.BlockedUsers.includes(CurrentOpenChat.Chat_With_Id))
          SetisUserBlocked(true)
        checkIfUserBlockYou()
      }

      SetChat(CurrentOpenChat)
    }

  }, [CurrentOpenChat])

  useEffect(() => {
    Socket.Socket.on('RecieveMassage', (msg) => {
      if (CurrentOpenChat) {
        let temp = { ...CurrentOpenChat }
        temp.Massages.push(msg)
        temp = { ...temp, Last_Massage: msg.massage, Last_Massage_Sent_In: new Date().toISOString() }
        dispatch({ type: "update_CurrentOpenChat", payload: temp })
      }
    })
  }, [])

  const handleDeleteGroupClicked = async () => {
    //Delete the group from groups table
    const { data: resp1 } = await axios.delete(`${groupsUrl}/${CurrentOpenChat.Chat_With_Id}`, { headers: { token: CurrentLoggedUser.token } })

    //Delete all the related massages of the group
    const { data: resp2 } = await axios.delete(`${massagesUrl}/${CurrentOpenChat.Chat_With_Id}`, { headers: { token: CurrentLoggedUser.token } })

    //Go back to Chats screen

    navigate('/Chats')

  }
  const handleGoBackClicked = () => {
    navigate("/chats")
  }

  const handleMassageSent = async () => {
    let currentTime = new Date().toISOString()

    //now we need to identify if the reciever end of the chat is connected to the chat right now so we can 
    //mark the massage as red. we will do so through communicating with his socket

    //Socket.Socket.emit("CheckConnectionWithReciver")


    let massageToSend = {
      sender: CurrentLoggedUser.userId,
      massage: NewMassage,
      receiver: Chat.Chat_With_Id,
      date: currentTime,
      type: CurrentOpenChat.Type
    }


    const { data } = await axios.post(url,
      massageToSend
      , { headers: { token: CurrentLoggedUser.token } })

    if (data) {
      massageToSend = { ...massageToSend, _id: data._id }
      let temp = { ...Chat }
      temp.Massages.push(massageToSend)
      temp.Last_Massage = NewMassage
      temp.Last_Massage_Sent_In = currentTime

      dispatch({ type: "update_CurrentOpenChat", payload: temp })

      Socket.Socket.emit("sendMessage", massageToSend)
      SetNewMassage('')
    }
  }

  const GetSenderName = (x) => {
    if (UserContacts) {
      let temp = UserContacts.find((z) => z.id === x.sender)
      return temp.DisplayName

    }
  }

  const handleAddContact = (e) => {
    e.forEach(async element => {
      const temp = UserContacts.find((x) => x.DisplayName === element).id
      const { data: resp } = await axios.put(`${groupsUrl}/addUser`, { userId: temp, GroupId: CurrentOpenChat.Chat_With_Id }, { headers: { token: CurrentLoggedUser.token } })
    });
  }

  const EditGroupTitleCallBack = async (title) => {
    const { data: resp } = await axios.put(`${groupsUrl}/editGroupTitle`, { title: title, id: CurrentOpenChat.Chat_With_Id }, { headers: { token: CurrentLoggedUser.token } })
  }

  const RemoveGroupUser = async (users) => {
    const { data: resp } = await axios.put(`${groupsUrl}/RemoveUsers`, { users, id: CurrentOpenChat.Chat_With_Id }, { headers: { token: CurrentLoggedUser.token } })
  }

  const LeaveGroup = async () => {
    const { data: resp } = await axios.put(`${groupsUrl}/RemoveUsers`, { users: [{ id: CurrentLoggedUser.userId }], id: CurrentOpenChat.Chat_With_Id }, { headers: { token: CurrentLoggedUser.token } })
    navigate(-1)
  }

  const handleBlockClicked = async () => {
    const { data: resp } = await axios.put(`${usersUrl}/BlockUser`, { userToBlock: CurrentOpenChat.Chat_With_Id, user: CurrentLoggedUser }, { headers: { token: CurrentLoggedUser.token } })
    dispatch({ type: "update_CurrentLoggedUser", payload: { ...CurrentLoggedUser, BlockedUsers: [...CurrentLoggedUser.BlockedUsers, CurrentOpenChat.Chat_With_Id] } })
  }

  const handleRemoveBlockClicked = async () => {
    const { data: resp } = await axios.put(`${usersUrl}/RemoveBlockFromUser`, { userToRemoveBlock: CurrentOpenChat.Chat_With_Id, user: CurrentLoggedUser }, { headers: { token: CurrentLoggedUser.token } })
    dispatch({ type: "update_CurrentLoggedUser", payload: { ...CurrentLoggedUser, BlockedUsers: CurrentLoggedUser.BlockedUsers.filter((x) => x !== CurrentOpenChat.Chat_With_Id) } })
  }

  return (
    <div style={{ border: "1px solid black", padding: "30px", marginLeft: "600px" }}>
      <button style={{ background: "green" }} onClick={handleGoBackClicked}>Return to all chats</button><br />
      {IsUserGroupAdmin && <ManageGroupModal RemoveGroupUserCallBack={RemoveGroupUser} DeleteGroupCallBack={handleDeleteGroupClicked} AddContactCallBack={handleAddContact} UserContacts={UserContacts.filter((x) => x.id !== CurrentLoggedUser.userId)} GroupInfo={GroupInfo} EditGroupTitleCallBack={EditGroupTitleCallBack} />}
      {IsUserGroupAdmin && <button
        className="btn btn-primary"
        data-toggle="modal"
        data-target="#ManageGroupModal"
      >ManageGroup</button>}
      {CurrentOpenChat.Type == "Group" && !IsUserGroupAdmin ?
        <button onClick={() => { LeaveGroup() }}>
          Leave group
        </button> :
        <></>}
      {!isUserBlocked && !isUserBlockedYou ? <button onClick={handleBlockClicked}>Block User</button> : <></>}
      <ul>
        {
          Chat?.Massages.map((x, index) => {
            return <div className='row' key={index}>
              <span className={x.sender === CurrentLoggedUser.userId ? "dialog_box right" : "dialog_box left"}>{x.massage}</span>
              {CurrentOpenChat.Type === "Group" ? <div>{GetSenderName(x)}</div> : <></>}
            </div>
          })
        }
      </ul>
      {isUserBlocked ? <div>
        <span>This User is Blocked</span>
        <button onClick={handleRemoveBlockClicked}>Remove block</button>
      </div> : isUserBlockedYou ? <span>User blocked you</span> : <div>
        <input value={NewMassage} onChange={(e) => {
          SetNewMassage(e.target.value)
        }}></input> <button onClick={handleMassageSent}>Send</button>
      </div>}

    </div>
  )
}

export default ChatComp
