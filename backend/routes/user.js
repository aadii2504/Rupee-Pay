const express = require("express");
const zod = require("zod");
const { User } = require("../db");
const jwt = require("jsonwebtoken");
const router = express.Router();
const JWT_SECRET = require("../config");
const { authMiddleware } = require("../middleware");

const signupSchema = zod.object({
  username: zod.string(),
  firstName: zod.string(),
  password: zod.string(),
});

/// signup and signin routes

router.post("/signup", async (req, res) => {
  const body = req.body;
  const { success } = signupSchema.safeParse(req.body);
  if (!success) {
    return res.json({
      message: "Email already exists / Incorrect Input",
    });
  }

  const user = User.findOne({
    username: body.username,
  });

  if (user._id) {
    return res.json({
      message: "Email already exists / Incorrect Input",
    });
  }

  await User.create(body);
  const token = jwt.sign(
    {
      userId: dbUser._id,
    },
    JWT_SECRET
  );

  res.json({
    message: "User Created Successfully",
    token: token,
  });
});

router.post("/signin", async (req, res) => {
  const { success } = signupSchema.safeParse(req.body);
  
  if (!success) {
    return res.status(411).json({
      message: "Username asd Password is Required",
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
  
  await User.updateOne(req.body, {
    id:req.userId
  })

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
