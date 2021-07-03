const mongoose = require('mongoose')

mongoose.connect( process.env.MONGODB_URL , {
    useCreateIndex : true,
    useNewUrlParser : true,
    useUnifiedTopology : true,
    useFindAndModify : false
}).then(()=>{
    console.log("connected to db")
}).catch(()=>{
    console.log("connection to db failed")
})