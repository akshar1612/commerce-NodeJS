const router = require("express").Router();
const User = require("../models/User")
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken"); 

//regist

router.post("/register", async (req,res)=>{
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password:CryptoJS.AES.encrypt(req.body.password, process.env.PASSWORD).toString(),
    });
    
    try{
        const savedUser = await newUser.save();
        res.status(200).json(savedUser);
    }catch(err){
        res.status(500).json(err);
    }
});

//login

router.post("/login",async(req,res)=>{
    try{

    const user = await User.findOne({username: req.body.username});

    !user && res.status(401).json("Wrong Credentials")

    const hashed_pass = CryptoJS.AES.decrypt(
        user.password, process.env.PASSWORD);

    const Opassword = hashed_pass.toString(CryptoJS.enc.Utf8)

    Opassword!==req.body.password &&
        res.status(401).json("Wrong creds");
    
    const accesstoken = jwt.sign({
        id:user._id,
        isAdmin: user.isAdmin,

    },process.env.JWT_SECRET,
    {expiresIn: "90d"}
    );

    const { password, ...others} = user._doc;
    res.status(200).json({...others, accesstoken});
    }catch(err){
        res.status(500).json(err)
    }
});

module.exports = router