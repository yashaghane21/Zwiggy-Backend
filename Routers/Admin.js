const express = require("express");
const router = express.Router();
const slugify = require("slugify")
const productmodel = require("../Models/Products")
const ordermodel = require("../Models/Order");
const orders = require("../Models/Order");


// api for create a product => from admin 

router.post("/create-product", (req, res) => {
    const { name, price, desc, img,restaurant} = req.body
    if (!name || !price || !desc || !img) {
        return res.status(400).send({
            message: "not ",
            success: false
        })
    }

    const product = new productmodel({
        name, price, desc,restaurant,img,slug:slugify(name)
    })
    product.save();
    return res.status(200).send({
        success: true,
        "message": "succesfullly crreated"
    })
});



router.get("/allorders",async(req,res)=>{
    const allorders= await ordermodel.find({}).populate("buyer","name") .populate({
        path: "products",
        select: "img name price", 
      });
    res.json(allorders)
})


router.put("/uporder/:orderid", async (req, res) => {


     try {
        const { orderid } = req.params;
    const { status }  = req.body;
    const orders = await ordermodel.findByIdAndUpdate(orderid, { status }, { new: true });

    res.json(orders);
     } catch (error) {
        return res.status(500).send({
            message:"fail",
            success:false
        })
     }


  });


  router.delete("/delete/:pid",async(req,res)=>{
    const { pid }=req.params;
     await productmodel.findByIdAndDelete(pid);
     return res.status(200).send({
        message:"product deleted",
        success:true
     })
  })
  
module.exports=router

//api for see all orders of users 

