import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes , Route } from 'react-router-dom'
import LoginComp from './Components/LoginComp'
import ChatsComp from './Components/ChatsComp'
import {persistor,store} from './redux/store'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store = {store}>
    <PersistGate persistor={persistor}>
    <BrowserRouter>
    <Routes>
      <Route to="/" element={<LoginComp />} />
      <Route to="/chats" element={<ChatsComp />} />
    </Routes>
    <Login />
    </BrowserRouter>
    </PersistGate>
    </Provider>
  </React.StrictMode>,
)
