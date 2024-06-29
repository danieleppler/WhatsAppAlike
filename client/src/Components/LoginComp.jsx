import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux'

const LoginComp = () => {

    const [FormData,SetFormData] = useState()
    const loginUrl =''
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleChange = (e)=>{
        SetFormData({...FormData,[e.target.name]:e.target.value})
    }

    const handleSubmit = async () =>{
        const {data:resp} = await axios.post(loginUrl,FormData)
        dispatch({type:"update_CurrentLoggedUser",payload:{
          userId : resp._id,
          userName : FormData.username,
          token:resp.token 
        }})
        navigate('/chats')
    }

  return (
    <form onSubmit={handleSubmit}>
      User Name : <input name="username" onChange={handleChange}></input> <br />
      PassWord : <input name="password" onChange={handleChange}></input> <br />
      <button type="submit" >Enter</button>
    </form>
  )
}

export default LoginComp
