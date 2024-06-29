const express = require('express')
const cors = require('cors')
const {Server} = require('socket.io')


const clients = ['http://localhost:5173/']
let ClientsSockets = []

const port = 3000
const app = express()

app.use(cors())
app.use(express.json())

const httpServer = app.listen(port,()=>{
    console.log(`server is listening on port ${port}`)
}) 

const io = new Server(httpServer,{cors:{clients}})


io.on("connection",(socket)=>{
    const {id:socketId} = socket
    console.log(`socket (id : ${socketId}) established`)

    socket.on("AddNewClientSocket",(userId)=>{
        if(!ClientsSockets.some((x) => x.userId === userId))
        {
            ClientsSockets.push({
                userId ,
                socketId 
            })
    console.log(`successfully added client ${userId} to connected users (using socket ${socketId})`)
        }
    })

    socket.on("sendMessage",(massage) =>{
        const {socketId:socketIdReciver} =  ClientsSockets.find((x)=> x.userId === massage.receiver)
        console.log(`sendind ${massage} to socket client ${socketIdReciver} from socket client ${socketId}`)
        io.to(socketIdReciver).emit("RecieveMassage",massage)
    })

    return socket
})







