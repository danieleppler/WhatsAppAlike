const massageService = require('./services/MassagesService')
const {Server} = require('socket.io')

const clients = ['http://localhost:5173/']
const io = new Server({cors:clients})
let ClientsSockets = []
const port = 3000

io.on("connection",(socket)=>{
    console.log(`socket (id : ${socket.id}) established`)
})

// io.on("connection",(socket,ClientsId)=>{
//     ClientsSockets.push({
//         ClientId,
//         socketId : socket.id
//     })
// })

io.listen(port)

io.on("sendMessage",(massage) =>{
    massageService.addMassage(massage)
    const socketId =  ClientsSockets.find((x)=> x.ClientId === massage.receiver)
    io.to(socketId).emit("RecieveMassage",massage)
})