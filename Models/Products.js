const mongoose=require("mongoose")

const Productschema= new mongoose.Schema({
    name:{
        type:String
    },
    price:{
        type:Number
    },
    slug:{
        type:String,
        required:true
    },
    desc:{
        type:String
    },
    img:{
        type:String
    },
    restaurant:{
        type:String
    },
  
} , {timestamps:true})


const products= mongoose.model("Product",Productschema)
module.exports=products