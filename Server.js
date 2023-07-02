const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors= require("cors")
require("./Models/Products")

const admin=require("./Routers/Admin")
const users=require("./Routers/Users")


app.use(express.json());
app.use(cors());
mongoose.set('strictQuery', false);
var mongoDB = "mongodb+srv://bytedevs2121:zwiggy@cluster0.vxh0zpg.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("coonection succsess");
}).catch((e) => {
    console.log(e);
});


app.use('/api/v1',admin)
app.use('/api/v2',users)

app.listen(5000, () => {
    console.log("jii");
})