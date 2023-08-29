const express=require("express")
const router=express.Router()
const user=require("../models/User")
const {body,validationResult}=require('express-validator')
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var fetchuser=require('../middleware/fetchuser')


//Route 1 create a user using post "api/auth/createuser" 
router.post("/createuser",[
    body('name','enter a valid name').isLength({min:3}),
    body('email','enter a valid email').isEmail(),
    body('password','enter a valid password').isLength({min:5})
],async(req,resp)=>{
    let success=false
    //it gives the array of errors
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return resp.status(400).json({success,errors:errors.array()})
    }
    try{
    let User= await user.findOne({email:req.body.email})
    if(User){
        return resp.status(400).json({success,error:"sorry this email is already present"})
    }

    //hashing of enterred password
    const hashpassword=await bcrypt.hash(req.body.password,10)
    //this is used to create a new user if user of entered mail id not present
     User= user.create({
        name:req.body.name,
        email:req.body.email,
        password:hashpassword
      })
      //generation of token
      const data={
        User:{
            id:User.id
        }
      }
      const authToken= jwt.sign(data,"fjadfdsfhgjfdfgdfdsfdsfdsdsfdfdshjfghdjfhdfjf")
      console.log(authToken)
      success=true
      resp.json({authToken:authToken,success})

    }catch(error){
        console.log(error)
        resp.status(500).send("intrnal server error occurs")
    }
})



//Route 2 authentication of user post method api/auth/login

router.post("/login",[
    body('email','enter a valid email').isEmail(),
    body('password',' password can not be blank').exists()
],async(req,resp)=>{
    let success=false
    //it gives the array of errors
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return resp.status(400).json({errors:errors.array()})
    }
    const email=req.body.email
    const password=req.body.password
    try{
    const User= await user.findOne({email:email})
    if(!User){
        success=false
        resp.status(400).json({success,error:" please enter valid details"})
    }
    const passwordcompare= await bcrypt.compare(password,User.password)
    if(!passwordcompare){
        success=false
       return resp.status(400).json({success,error:" please enter valid details"})
    }
   
    const data={
        User:{
            id:User.id
        }
      }
      const authToken= jwt.sign(data,"fjadfdsfhgjfdfgdfdsfdsfdsdsfdfdshjfghdjfhdfjf")
      console.log(authToken)
      success=true
      resp.json({authToken:authToken,success})

    }catch(error){
        console.log(error)
        resp.status(500).send("internal server error occurs")
    }
})


//Route 3 for fetching loggedin user details

router.post("/getuser",fetchuser,async(req,resp)=>{
    //it gives the array of errors
    try {
       const userID=req.user.id
        const User=await user.findById(userID).select("-password")
        resp.send(User)
    } catch (error) {
        console.log(error)
        resp.status(401).send("internal server error occurs")
    }
})
module.exports=router;