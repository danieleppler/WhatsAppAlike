import {io} from 'socket.io-client'

//Singelton 
const socketServerUrl = 'http://localhost:3000/'

let flag = false
const Socket = !flag ? io(socketServerUrl):{}

console.log("socket initalized in client side")
// const AddClient = (id) =>{
//     if(!flag){
//         console.log(`about to add socket to client ${id}`)
//         flag = true
//         Socket.emit("AddNewClientSocket",id)
//     }
// }



export  default {Socket}