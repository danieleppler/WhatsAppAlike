const jwt = require('jsonwebtoken')

const secret = 'SECRET'

const signNewUser = (user) =>{
    const token  = jwt.sign(user,secret)
    return token
}

const VerifyUser  = (token) => {
    try{
        jwt.verify(token,secret)
        return "Success"
    }
    catch(e){
        return e
    }
    
}

module.exports = {signNewUser,VerifyUser}