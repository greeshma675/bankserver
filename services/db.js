//import mongoose
const mongoose=require('mongoose')
//connection string
mongoose.connect('mongodb://localhost:27017/bankapp',{useNewUrlParser:true
})
// model defenition 
const user=mongoose.model('user',
{
    acno:String,
    username:String,
    password:String,
    balance:Number,
    transaction:[]
})

//export model to dataservice
module.exports={
    user
}