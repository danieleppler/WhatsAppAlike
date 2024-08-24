const express = require('express')
const router = express.Router()
const os = require('os');
const jwtFuncs = require('../utils/jwtFuncs')

const userSvc = require('../services/UsersService')

router.post('/login',async (req,res)=>{
    let data = await userSvc.VerifiyUser(req.body) 
    if(data !== null)
        return res.json(data)

    res.status(401).send({ error: "User Creds are wrong !" });
})

router.get('/address',async (req,res)=>{
        const data = req.rawHeaders[15]
        return res.json(data)
})

router.get('/:id',async (req,res)=>{
    const TokenResp = await jwtFuncs.VerifyUser(req.headers.token)
    if(TokenResp !== "Success")
        return res.status(401).send({ error: "Token is invalid or timed out" });

    const data = await userSvc.GetUserById(req.params.id)
    return res.json(data)
})

module.exports = router