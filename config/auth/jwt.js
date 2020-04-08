const jwt = require('jsonwebtoken');
require('dotenv').config()

module.exports = (data)=> {
    const token = jwt.sign(data, process.env.JWT_SECRET_KEY, {expiresIn:"1d"});
    return token
}