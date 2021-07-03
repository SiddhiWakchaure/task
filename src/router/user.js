const User = require("../model/User")
const express = require("express")
const userAuth = require('../middleware/userAuth')
const router = new express.Router()

//Signup route for users
router.post('/users' , async (req, res)=>{
    const user = new User(req.body)
    try{
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send("user created successfully \n token:" + token)
    }catch(e){
        res.status(400).send(e)
    }
})

//Login route for users
router.post('/users/login', async (req, res)=>{
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send("user is logged in successfully \n token:"+ token)
    }catch(e){
        res.status(400).send("unable to login")
    }
})

//Logout route for users
router.post('/users/logout', userAuth , async (req, res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })

        await req.user.save()
        res.send("User logged out successfully. Thank You.")
    }catch(e){
        res.status(500).send()
    }
})

module.exports = router