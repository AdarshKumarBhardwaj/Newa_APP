var jwt = require('jsonwebtoken');

const fetchuser=(req,resp,next)=>{
      //get the user from jwt token and add id to req object
      const token=req.header('auth-token');
      if(!token){
        resp.status(401).send({error:"please authenticate using a valid token"})
      }
      try {
           const data=jwt.verify(token,"fjadfdsfhgjfdfgdfdsfdsfdsdsfdfdshjfghdjfhdfjf")
           req.user=data.User;
           console.log(data)
           next();
      } catch (error) {
        resp.status(401).send({error:"please authenticate using a valid token"})
      }
}
module.exports=fetchuser