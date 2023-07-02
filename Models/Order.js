const mongoose=require("mongoose")

const Orderschema= new mongoose.Schema({
    products:[{type:mongoose.Types.ObjectId,
      ref:"Product"
    }]
,
    payment:{
        type:String
    },
    buyer:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    },
    status:{
        type:String,
        default:"not process",
       
    }
    

})


const orders= mongoose.model("order",Orderschema)
module.exports=orders