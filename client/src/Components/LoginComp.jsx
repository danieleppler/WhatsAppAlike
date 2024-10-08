import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux'

const LoginComp = () => {

  const [FormData, SetFormData] = useState()
  const loginUrl = 'http://localhost:3000/users/login'
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleChange = (e) => {
    SetFormData({ ...FormData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    try {
      e.stopPropagation()
      const { data: resp } = await axios.post(loginUrl, FormData)
      dispatch({
        type: "update_CurrentLoggedUser", payload: {
          userId: resp._id,
          userName: FormData.username,
          DisplayName: resp.DisplayName,
          token: resp.token,
          Contacts: resp.Contacts,
          BlockedUsers: resp.BlockedUsers
        }
      })
      navigate('/chats')

    }
    catch (e) {
      alert(e.message)
    }


  }

  return (
    <div >
      User Name : <input name="username" onChange={handleChange}></input> <br />
      PassWord : <input name="password" onChange={handleChange}></input> <br />
      <button onClick={handleSubmit} >Enter</button>
    </div>
  )
}

export default LoginComp
