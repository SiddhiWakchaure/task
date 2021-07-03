const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const adminSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true,
        maxlength : 32,
    },
    email : {
        type : String,
        required : true,
        trim : true,
        unique : true,
        lowercase : true,
        validate (value){
            if(!validator.isEmail(value)) {
                throw new Error("Please check and re-enter the email.")
            }
        }
    },
    mobile : {
        type : Number,
        trim : true,
        required : true,
        validate(value) {
            if(!validator.isMobilePhone(value.toString())) {
                throw new Error("Please check and re-enter the mobile number.") //validates all mobilr numbers over the globe.
            }
        }
    },
    password : {
        type : String,
        trim : true,
        required : true,
        validate(value) {
            if(!validator.isStrongPassword(value)) {
                throw new Error("Please re-enter password with minimum 1 uppercase-lowercase letter, number, special character.")
            }
        }
    },
    tokens : [{
        token : {
            required : true,
            type : String
        }
    }]
}, {
    timestamps : true
})

//generated session token of admin when signed up and logged in
adminSchema.methods.generateAuthToken = async function(){
    const admin = this
    const token = jwt.sign({_id : admin._id.toString()}, process.env.JWT_TOKEN_TWO)

    admin.tokens = admin.tokens.concat({token})
    await admin.save()
    return token
}

// Finds admin when login credentials are given.
adminSchema.statics.findByCredentials = async (email, password)=>{
    const admin = await Admin.findOne({email})
    if(!admin){
        throw new Error("Unable to login.")
    }

    const isMatch = await bcrypt.compare(password, admin.password)
    if(!isMatch){
        throw new Error('unable to login.')
    }

    return admin
}

// Hashes the admin's plain text password or security
adminSchema.pre('save', async function(next){
    const admin = this

    if(admin.isModified('password')){
        admin.password = await bcrypt.hash(admin.password, 8)
    }

    next()
})

const Admin = mongoose.model('Admin', adminSchema)

module.exports = Admin