const express = require('express')
const router = express.Router()

const groupSvc = require('../services/GroupsService')
const jwtFuncs = require('../utils/jwtFuncs')

router.get('/:id',async (req,res)=>{

    const TokenResp = await jwtFuncs.VerifyUser(req.headers.token)
    if(TokenResp !== "Success")
        return res.status(401).send({ error: "Token is invalid or timed out" });

    const data = await groupSvc.GetUserGroups(req.params.id)
    return res.json(data)
})

router.get('/groupInfo/:id', async (req,res) =>{
    const TokenResp = await jwtFuncs.VerifyUser(req.headers.token)
    if(TokenResp !== "Success")
        return res.status(401).send({ error: "Token is invalid or timed out" });

    const data = await groupSvc.GetGroupInfo(req.params.id)
    return res.json(data)
})

router.post('/',async (req,res)=>{
    const TokenResp = await jwtFuncs.VerifyUser(req.headers.token)
    if(TokenResp !== "Success")
        return res.status(401).send({ error: "Token is invalid or timed out" });

    const data = await groupSvc.AddGroup(req.body)
    return res.json(data)
})

router.delete('/:id',async (req,res)=>{
    const TokenResp = await jwtFuncs.VerifyUser(req.headers.token)
    if(TokenResp !== "Success")
        return res.status(401).send({ error: "Token is invalid or timed out" });

    const data = await groupSvc.DeleteGroup(req.params.id)
    return res.json(data)
})

router.put('/addUser',async (req,res)=>{
    const TokenResp = await jwtFuncs.VerifyUser(req.headers.token)
    if(TokenResp !== "Success")
        return res.status(401).send({ error: "Token is invalid or timed out" });

    const data = await groupSvc.AddUserToGroup(req.body.userId,req.body.GroupId)
    return res.json(data)
})

router.put('/editGroupTitle',async (req,res) =>{
    const TokenResp = await jwtFuncs.VerifyUser(req.headers.token)
    if(TokenResp !== "Success")
        return res.status(401).send({ error: "Token is invalid or timed out" });

    const data = await groupSvc.EditGroupTitle(req.body.title,req.body.id)
    return res.json(data)
})

router.put('/RemoveUsers',async (req,res) =>{
    const TokenResp = await jwtFuncs.VerifyUser(req.headers.token)
    if(TokenResp !== "Success")
        return res.status(401).send({ error: "Token is invalid or timed out" });

    const data = await groupSvc.RemoveUsersFromGroup(req.body.users,req.body.id)
    return res.json(data)
})

module.exports = router