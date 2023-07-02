const mongoose=require("mongoose")

const Userschema= new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    phone:{
        type:Number
    },
    address:{
        type:String,
        required:true
    },
    role:{
        type:Number,
        default:0
    },
})


const user= mongoose.model("User",Userschema)
module.exports=user