const express = require("express");
const router = express.Router();
const productmodel = require("../Models/Products")
const usermodel = require("../Models/User")
const ordermodel = require("../Models/Order")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const JWT_SECRET = "yashqwert"
// const braintree = require("braintree")


// var gateway = new braintree.BraintreeGateway({
//     environment: braintree.Environment.Sandbox,
//     merchantId: "mcrfyk96gnrm4z4r",
//     publicKey: "8q6w5gk4dj97pw6y",
//     privateKey: "1c48b89fd4cec52fc77a6b46b0b64b34"

// });



// router.get("/gettoken", async (req, res) => {
//     try {
//         gateway.clientToken.generate({}, function (err, resonse) {
//             if (err) {
//                 res.status(500).send(err);
//             }
//             else {
//                 res.send(resonse)
//             }
//         })



//     } catch (error) {
//         console.log(error)
//     }
// });


// router.post("/payment", async (req, res) => {
//     const { cart, nonce } = req.body;
//     let total = 0;
//     cart.map((i) => {
//         total += i.price
//     });
//     let newtrasaction = gateway.transaction.sale({
//         amount: total,
//         paymentMethodNonce: nonce,
//         options: {
//             submitForSettlement: true
//         },
//     },
//         function (error, result) {
//             if (result) {
//                 const order = new ordermodel({
//                     products: cart,
//                     payment: result,
//                     buyer: req.user._id,

//                 })
//                 order.save();
//                 res.json({ ok: true })
//             }
//             else {
//                 res.status(500).send(error)
//             }
//         }




//     );


// })

//Get all products to homepage

router.get("/all-products", async (_req, res) => {

    try {
        const allproducts = await productmodel.find({});
        return res.status(200).send({
            message: "success",
            success: true,
            allproducts
        })

    } catch (error) {
        console.log(error)
    }

})

// get single product at /MYproductdetails

router.get("/Single-product/:slug", async (req, res) => {

    try {
        const Sproduct = await productmodel.findOne({ slug: req.params.slug })
        return res.status(200).send({
            message: "success",
            success: true,
            Sproduct
        })

    } catch (error) {
        console.log(error)
    }

})


router.post('/signup', async (req, res) => {
    try {
        const { name, phone, email, password, address } = req.body;

        if (!name || !password | !email || !phone || !address) {
            return res.status(401).send({
                success: false,
                message: "Please provide all fields ",
            });
        }

        const hashedpassword = await bcrypt.hash(password, 10);
        const user = new usermodel({ name, email, password: hashedpassword, phone, address });
        user.save();
        return res.send({
            success: true, message: "succsefully create",
            user
        });
    }
    catch (error) {
        console.log(error);
    }

});




router.post('/login', async (req, res) => {
    try {
        const { password, email } = req.body;
        //validation
        if (!password | !email) {
            return res.status(401).send({
                success: false,
                message: "Please provide email or password",
            });
        }
        const user = await usermodel.findOne({ email });
        if (!user) {
            return res.status(200).send({
                success: false,
                message: "email is not registerd",
            });
        }
        //password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send({
                success: false,
                message: "Invlid username or password",
            });
        }
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
            expiresIn: "7d"
        });
        return res.status(200).send({
            success: true,
            messgae: "login successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                password: user.password,
                role: user.role
            },
            token,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error In Login Callcback",
            error,
        });
    }
}
);


router.post("/order", (req, res) => {
  
    const { products, payment,buyer } = req.body
    const order = new ordermodel({
        products, payment, buyer
    })
    order.save();
    return res.status(200).send({
        success: true,
        message: "ok",
        order
    })
});



router.get("/my-orders",async(req,res)=>{
    const {id}=req.query
    const orders =await ordermodel.find({buyer:id}).populate("buyer","name") .populate({
        path: "products",
        select: "img name price", 
      });
   res.json(orders)
})





router.put("/fpass",async(req,res)=>{
    const {email,newpassword} =req.body
    if(!email || !newpassword){
        return res.status(500).send({
           message:" provide all fields"
        })
    }
    const user= await usermodel.findOne({email});
    if(!user){
        return res.send({message:"user not found "})
    }
    const cpass= await bcrypt.hash(newpassword, 10);
    await usermodel.findByIdAndUpdate(user._id,{password:cpass});
    res.status(200).send({
        message:"password change succesfully ",
        success:true
    })
})
module.exports = router