import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import Socket from "../SocketClient";
import "../css/Chats.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartGantt, faPen } from "@fortawesome/free-solid-svg-icons";
import ContactModal from "./modals/ChoseUsersModal";
import NewGroupModal from "./modals/NewGroupModal";

const ChatsComp = () => {
  const url = "http://localhost:3000/massages/chats";
  const usersUrl = "http://localhost:3000/users";
  const GroupsUrl = "http://localhost:3000/groups"

  const CurrentLoggedUser = useSelector((state) => {
    return state.root.CurrentLoggedUser;
  });

  const [Chats, SetChats] = useState();
  const [ChatsBinder, SetChatsBinder] = useState();
  const [UserContacts, SetUserContacts] = useState();
  const [userGroups,SetuserGroups] = useState();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  

  useEffect(() => {
    const fetchdata = async () => {
      const { data } = await axios.post(
        url,
        { userid: CurrentLoggedUser.userId },
        { headers: { token: CurrentLoggedUser.token } }
      );
      SetChatsBinder(data);
      Socket.Socket.emit("updateClientId", CurrentLoggedUser.userId);

      const ContactsFinalData = CurrentLoggedUser.Contacts.map(async (x) => {
        const { data: Contact } = await axios.get(`${usersUrl}/${x}`, {
          headers: {
            token: CurrentLoggedUser.token,
          },
        });
        return {
          id: x,
          DisplayName: Contact.DisplayName,
        };
      });
      const results = await Promise.all(ContactsFinalData);
      SetUserContacts(results);
      dispatch({type:"Update_usercontacts",payload:results})

      const {data:userGroups} = await axios.get(`${GroupsUrl}/${CurrentLoggedUser.userId}`,{ headers: { token: CurrentLoggedUser.token } })
      SetuserGroups(userGroups)


    };
    fetchdata();

    return () => {
      //Socket.Socket.off("RecieveMassage", handleMassageRecived);
    };
  }, []);

  // const handleMassageRecived = (msg) => {
  //   const index = ChatsBinder.findIndex(
  //     (x) => msg.sender === x.Chat_With_Id
  //   );
    
  //   let temp = [...ChatsBinder]
    
  //   temp[index].Last_Massage = msg.massage
  //   temp[index].Last_Massage_Sent_In = msg.date
  //   temp[index].NewMassageCount ++;

  //   SetChats(temp)
  // };

  useEffect(() => {
    if (ChatsBinder) {
      //if there is group chats that doesnt contain any massages yet, we will not get it from get Chats request. therefore
      //we request the user groups from the server and check which one is not included in the chats we already got. Every
      //group that excule from this list is added to the list as empty chat for the user to see
      if(userGroups){
        let temp = ChatsBinder.map((x)=>x.Chat_With_Id)
        let temp2 = [...ChatsBinder]
        userGroups.forEach(element => {
          if(!temp.includes(element._id)){
            temp2.push({
              Chat_With_Id:element._id,
              Chat_With_Name:element.GroupTitle,
              Last_Massage:"",
              Last_Massage_Sent_In:null,
              Massages:[],
              Type : "Group"
            })
          }
        });
        SetChats(temp2)
      }
 else{
  SetChats(ChatsBinder)
 }

      // Socket.Socket.on("RecieveMassage", handleMassageRecived);
    }
  }, [ChatsBinder,userGroups]);

  const handleChatClick = (x) => {
    dispatch({ type: "update_CurrentOpenChat", payload: {...x,UserContacts : [...UserContacts,{id:CurrentLoggedUser.userId,DisplayName:CurrentLoggedUser.DisplayName}]}});
    navigate(`/chats/${CurrentLoggedUser.userId}_${x.Chat_With_Id}`);
  };

  const handleContactClicked = (e) =>{
    let currentChat = Chats.find((x)=>x.Chat_With_Name === e.target.outerText)
    if(!currentChat){
      currentChat = {
        Chat_With_Id:UserContacts.find((x) => x.DisplayName === e.target.outerText).id,
        Chat_With_Name:e.target.outerText,
        Last_Massage:null,
        Last_Massage_Sent_In:null,
        Massages:[],
        type:"Private"
      }
    }
    dispatch({ type: "update_CurrentOpenChat", payload: currentChat});
    navigate(`/chats/${CurrentLoggedUser.userId}_${currentChat.Chat_With_Name}`);
  }
  const handleAddGroupClicked = async (GroupInfo) =>{
    GroupInfo  = {...GroupInfo,Creator:CurrentLoggedUser.userId}
    const {data:resp} = await axios.post(GroupsUrl,GroupInfo,
      { headers: { token: CurrentLoggedUser.token } })
    let temp = [...Chats,{
      Chat_With_Id:resp._id,
      Chat_With_Name:GroupInfo.GroupTitle,
      Last_Massage:null,
      Last_Massage_Sent_In:null,
      Massages:[],
      Type:"Group"
    }]
    SetChats(temp)
  }

  return (
    <div>
      <h3>Hi {CurrentLoggedUser?.userName}</h3>
      <ContactModal UserContacts={UserContacts} handleContactClicked={handleContactClicked}/>
      <NewGroupModal CurrentLoggedUser = {CurrentLoggedUser} UserContacts={UserContacts} handleAddGroupClicked={handleAddGroupClicked}/>
      <Link to="..">Sign Out</Link>
      <br />
      <div className="WriteNewMassage">
        <button
          style={{ background: "transparent", border: "none" }}
          className="btn btn-primary"
          data-toggle="modal"
          data-target="#ContactsModal"
        >
          Write new massage
        </button>
        <FontAwesomeIcon icon={faPen} />
      </div>

      <button
          className="btn btn-primary"
          data-toggle="modal"
          data-target="#AddGroupModal"
        >
          Open Group Chat
        </button>

      <br /> 
      <ul>
        {Chats?.map((x, index) => {
          return (
            <div
              key={index}
              onClick={() => {
                handleChatClick(x);
              }}
              style={{ border: "1px solid black" ,width:"500px"}}>
              <span style={{ fontWeight: "bold" }}>{x.Chat_With_Name} </span>
              <br />
              {x.Last_Massage} &nbsp;&nbsp;&nbsp; {x.Last_Massage_Sent_In} &nbsp;
            </div>
          );
        })}
      </ul>
    </div>
  );
};

export default ChatsComp;
