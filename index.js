const express = require("express");
const mongoose = require ("mongoose")
const app = express();
const dotenv = require("dotenv")
const userroute = require("./routes/users")
const authRoute = require("./routes/auth")
const productRoute = require("./routes/product")
const orderRoute = require("./routes/order")
const cartRoute = require("./routes/cart")
dotenv.config();

mongoose
.connect(process.env.MONGO_URL)
.then(()=>console.log("Database connection succesful"))
.catch((err)=>{
    console.log(err)
});

app.use(express.json());
app.use("/api/auth", authRoute)
app.use("/api/users",userroute)
app.use("/api/products",productRoute)
app.use("/api/order",orderRoute)
app.use("/api/cart",cartRoute)

app.listen(process.env.PORT || 5000, ()=>{
    console.log("Backend connected");
});

