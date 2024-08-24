import { useEffect, useState } from 'react'
import {io} from 'socket.io-client'


import './App.css'

function App() {

  const [Socket,SetSocket] = useState()
  const socketServerUrl = 'http://localhost:3000/'
  const [text,Settext] = useState('')


  useEffect(()=>{
    const newSocket = io(socketServerUrl)
    SetSocket(newSocket)

    return () =>{
      newSocket.disconnect()
    }
  },[])

  useEffect(()=>{
    if(Socket){
      Socket.emit("AddNewClientSocket","1")

      Socket.on("RecieveMassage",(res)=>{
      })
    }
  },[Socket])

  const handlesubmit =async () =>{
    const res = await Socket.emit("sendMessage",{
      sender:"1",
      receiver:"2",
      massage:"hello"
    }) 
  }

  return (
    <>
      Send a massage - <input onChange={(e)=>{
        Settext(e.target.value)
      }}></input><br />
      <button onClick={handlesubmit}>Send</button>
    </>
  )
}


export default App
