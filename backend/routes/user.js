const express = require("express");
const zod  =  require("zod")
const {User} = require("../db")
const jwt =  require("jsonwebtoken")
const router = express.Router();

const signupSchema   =  zod.object({
    username: zod.string(),
    firstName: zod.string(),
    password: zod.string(),
})

/// signup and signin routes 

router.post("/signup" , async (req , res)=> {
    const body =  req.body;
    const {success} = signupSchema.safeParse(req.body);
    if(!success) {
        return res.json({
            message: "Email already exists / Incorrect Input",
        })
    }

    const user = User.findOne({
        username: body.username
    })

    if(user._id) {
        return res.json({
            message: "Email already exists / Incorrect Input"
        })
    }


    await User.create(body);
    const token =  jwt.sign({
        userId: dbUser._id
    } , JWT_SECRET)
    res.json({
        message: "User Created Successfully",
    })


})


module.exports = router;

