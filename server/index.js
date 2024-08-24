const express = require('express')
const cors = require('cors')
const {Server} = require('socket.io')
const GroupSvc = require('./services/GroupsService')


const clients = ['http://localhost']
let ClientsSockets = []

require('./configs/db')

const port = 3000
const app = express()

app.use(cors())
app.use(express.json())

const userController = require('./controllers/usersController')
app.use('/users',userController)

const massageController = require('./controllers/massageController')
app.use('/massages',massageController)

const groupController = require('./controllers/groupController')
app.use('/groups',groupController)


const httpServer = app.listen(port,()=>{
    console.log(`server is listening on port ${port}`)
}) 


const io = new Server(httpServer,{cors:{clients}})


io.on("connection",(socket)=>{
    const {id:socketId} = socket
    var obj  = ClientsSockets.findIndex((x)=>x.origin === socket.handshake.headers.origin)
    if(obj === -1)
    {
        var newOrigin  = socket.handshake.headers.origin 
        ClientsSockets.push({
            origin : newOrigin,
            socketId,
             
        })
        console.log(`successfully added client ${socket.handshake.headers.origin} to connected users (using socket ${socketId})`)
    }
    else{
        ClientsSockets[obj].socketId = socketId  
        console.log(`successfully assigned client ${socket.handshake.headers.origin} a new socket (id ${socketId})`)
    }
    
    socket.on("updateClientId",(userId) =>{
        var SocketIndex  = ClientsSockets.findIndex((x)=>x.origin === socket.handshake.headers.origin)
        ClientsSockets[SocketIndex] = {...ClientsSockets[SocketIndex],userId : userId} 
    })

    socket.on("sendMessage",async (massage) =>{
        if(massage.type === "Private")
        {
            const {socketId:socketIdReciver} =  ClientsSockets.find((x)=> x.userId === massage.receiver)
            console.log(`sending massage ${massage.massage} to socket client ${socketIdReciver} from socket client ${socketId}`)
            io.to(socketIdReciver).emit("RecieveMassage",massage)
        }
     

        if(massage.type == "Group"){
            const users_to_broadcast = await GroupSvc.GetGroupUsers(massage.receiver)
            users_to_broadcast.forEach(element => {
                const {socketId:socketIdReciver} =  ClientsSockets.find((x)=> x.userId === element)
                if(socketId !== socketIdReciver)
                {
                    console.log(`sending massage ${massage.massage} to socket client ${socketIdReciver} from socket client ${socketId}`)
                    io.to(socketIdReciver).emit("RecieveMassage",massage)
                }
            });
        }
    })

    socket.on("ConnectionCheckReq_Sender",(reciver)=>{
        const {socketId:socketIdReciver} =  ClientsSockets.find((x)=> x.userId === reciver)
        const connected = io.to(socketIdReciver).emit("ConnectionCheckReq_Sender")
        io.to(socketId).emit("ConnectionCheckRes_Sender",connected)
    })

    return socket
})







