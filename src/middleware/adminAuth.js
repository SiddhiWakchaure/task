const jwt = require('jsonwebtoken')
const Admin = require('../model/Admin')

const adminAuth = async (req, res, next)=>{
    try{
        const token = req.header("Authorization").replace('Bearer ', "")
        const decoded = jwt.verify(token, process.env.JWT_TOKEN_TWO)
        const admin = await Admin.findOne({_id : decoded._id , 'tokens.token' : token})

        if(!admin){
            throw new Error()
        }

        req.admin = admin
        req.token = token

        next()
    }catch(e){
        res.status(401).send("Please Authenticate")
    }

}

module.exports = adminAuth