const jwt = require('jsonwebtoken');
require('dotenv').config()

module.exports = async (token) => {
    // console.log("token", token)
    return await jwt.verify(token, process.env.JWT_SECRET_KEY,(err, tokenData)=>{
        if(tokenData){
            return tokenData
        }
        return "Invalid_token"
    })
}