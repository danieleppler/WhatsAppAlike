import React, { createContext } from 'react';
import { io, Socket } from 'socket.io-client';

 const socketServerUrl = 'http://localhost:3000/'

const socket = io(socketServerUrl),
  SocketContext = createContext<Socket>(socket);

socket.on('connect', () => 
  socket.emit("AddNewClientSocket",'2'))

const SocketProvider = ({ children }) => {
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
export { SocketProvider , SocketContext };