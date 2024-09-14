const express = require("express");
const zod = require("zod");
const { User } = require("../db");
const jwt = require("jsonwebtoken");
const router = express.Router();
const JWT_SECRET = require("../config");

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
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({
      message: "Username asd Password is Required",
    });
  }

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }

    if (user.password != password) {
        return res.status(400).json({
          message: "Invalid Credentials",
        });
    }

    const token  = jwt.sign({userId: user._id} , JWT_SECRET, {
        expiresIn: '1h'
    })

    res.json({
        message:"User Signed Succssfull"
    });


  } catch (err) {
    return res.status(400).json({
      message: "Internal Error is Occured",
    });
  }
});

module.exports = router;
