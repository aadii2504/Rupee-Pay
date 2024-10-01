const express = require("express");
const zod = require("zod");
const { User } = require("../db");
const jwt = require("jsonwebtoken");
const router = express.Router();
const JWT_SECRET = require("../config");
const { authMiddleware } = require("../middleware");

const signupBody = zod.object({
  username: zod.string().email(),
  firstName: zod.string(),
  lastname: zod.string(),
  password: zod.string(),
});

/// signup and signin routes

router.post("/signup", async (req, res) => {
  const body = req.body;
  const { success } = signupBody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: "Email already exists / Incorrect Input",
      error : error.errors,
    });
  }

  const existingUser = await User.findOne({
    username: body.username,
  });

  if (existingUser) {
    return res.status(411).json({
      message: "Email already exists / Incorrect Input",
    });
  }

  const user = await User.create({
      username: req.body.username,
      password: req.body.password,
      firstName: req.body.firstName,
      lastname: req.body.lastname,
  });

  const userId = user._id;


  await Account.create({
    userId,
    balance: 1 + Math.random() * 10000
  })

  const token = jwt.sign(
    {
      userId: user._id,
    },JWT_SECRET
  );

  res.status(201).json({
    message: "User Created Successfully",
    token: token,
  });
});

const signinbody = zod.object({
  username : zod.string().email(),
  password: zod.string()
})

router.post("/signin", async (req, res) => {
  const { success } = signupSchema.safeParse(req.body);
  
  if (!success) {
    return res.status(411).json({
      message: "Username and Password is Required  / Incorrect Inputs ",

    });
  }

  const user  = await User.findOne({
    username : req.body.username,
    password : req.body.password,
  });

  if(user) {
    const token =  jwt.sign({
      userId: user._id
    }, JWT_SECRET)
    
    
    
    res.json({
      token: token
    })
    return;
  }

  res.status(411).json({
    message: "Error while logging in :( "
  })
});


const updatebody = zod.object({
  username: zod.string().optional(),
  password: zod.string().optional(),
  lastname : zod.string().optional()
})


router.put("/" , authMiddleware , async (req , res) => {
  const {success}   = updatebody.safeParse(req.body)
  if(!success) {
    res.json({
      message: "Error while updating the information :( "
    })
  }
  
  await User.updateOne({_id: req.userId} ,  req.body)

  res.json({
    message: "Information updated successfully"
  })
})

router.get("/bulk" , async (req, res) => {
  const filter =  req.query.filter || "";

  const   users = await User.find({
    $or: [{
      firstName: {
        $regex: filter
      }
    }, {
      lastname: {
        $regex: filter
      }
    }]
  })

  res.json({
    user: users.map(user => ({
      username: user.username,
      firstName: user.firstName,
      lastname : user.lastname,
      _id: user._id
    }))
  })
})


module.exports = router;
