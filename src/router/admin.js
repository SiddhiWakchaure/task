const Admin = require("../model/Admin")
const express = require("express")
const adminAuth = require('../middleware/adminAuth')
const router = new express.Router()

//Signup route for admins
router.post('/admins' , async (req, res)=>{
    const admin = new Admin(req.body)
    try{
        await admin.save()
        const token = await admin.generateAuthToken()
        res.status(201).send("admin created successfully \n token:" + token)
    }catch(e){
        res.status(400).send(e)
    }
})

//Login route for admins
router.post('/admins/login', async (req, res)=>{
    try{
        const admin = await Admin.findByCredentials(req.body.email, req.body.password)
        const token = await admin.generateAuthToken()
        res.send("admin is logged in successfully \n token:"+ token)
    }catch(e){
        res.status(400).send("unable to login")
    }
})

//Logout route for admin
router.post('/admins/logout', adminAuth , async (req, res)=>{
    try{
        req.admin.tokens = req.admin.tokens.filter((token)=>{
            return token.token !== req.token
        })

        await req.admin.save()
        res.send("Admin logged out successfully. Thank You.")
    }catch(e){
        res.status(500).send()
    }
})

module.exports = router