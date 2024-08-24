import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes , Route } from 'react-router-dom'
import LoginComp from './Components/LoginComp'
import ChatsComp from './Components/ChatsComp'
import {persistor,store} from './redux/store'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux';
import ChatComp from './Components/ChatComp'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/css/bootstrap.min.css'; 
import $ from 'jquery'; 
import Popper from 'popper.js'; 
import 'bootstrap/dist/js/bootstrap.bundle.min';


ReactDOM.createRoot(document.getElementById('root')).render(
  
    <Provider store = {store}>
    <PersistGate persistor={persistor}>
      <BrowserRouter>
    <Routes>
      <Route path="/" element={<LoginComp />} />
      <Route path="/chats" element={<ChatsComp />} />
      <Route path="/chats/:params" element={<ChatComp />} />
    </Routes>
    </BrowserRouter>
    </PersistGate>
    </Provider>
  
)
