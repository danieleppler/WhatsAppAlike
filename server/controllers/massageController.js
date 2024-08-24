const express = require('express')
const router = express.Router()
const msgsvc = require('../services/MassagesService')
const jwtFuncs = require('../utils/jwtFuncs')

router.post('/chats',async (req,res)=>{

    const TokenResp = await jwtFuncs.VerifyUser(req.headers.token)
    if(TokenResp !== "Success")
        return res.status(401).send({ error: "Token is invalid or timed out" });

    const data = await msgsvc.getUserChats(req.body.userid)
    return res.json(data)
})

router.post('/send',async (req,res)=>{
    const TokenResp = await jwtFuncs.VerifyUser(req.headers.token)
    if(TokenResp !== "Success")
        return res.status(401).send({ error: "Token is invalid or timed out" });

    const data = await msgsvc.sendMassage(req.body)
    res.json(data)
})

router.delete('/:id',async (req,res) =>{
    const TokenResp = await jwtFuncs.VerifyUser(req.headers.token)
    if(TokenResp !== "Success")
        return res.status(401).send({ error: "Token is invalid or timed out" });

    const data = await msgsvc.DeleteUserMassages(req.params.id)
    res.json(data)
})

module.exports = router