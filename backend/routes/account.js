const express = require('express')
const{ authmiddleware }  = require("../middleware") 
const { Account } = require("../db")
const { default : mongoose}   =  require("mongoose")

const router = express.Router();

router.get("/balance" , authmiddleware , async (req ,  res) => {
        const account   = await Account.findOne({
            userId: req.userId
        })

        res.json({
            balance: account.balance
        })
})


router.post("/", authmiddleware , async(req, res) => {
     
})