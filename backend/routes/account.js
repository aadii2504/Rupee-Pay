const express = require('express')
const{ authmiddleware }  = require("../middleware") 
const { Account } = require("../db")
const { default : mongoose, startSession}   =  require("mongoose")

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
     const session = await startSession();

     session.startTransaction()

     const { amount , to} =  req.body

     const account = await Account.findOne({userId: req.userId}).session(session)

     if(!account || account.balance < amount ) {
            await session.abortTransaction()
            return res.status(400).json({
                message : "Insufficient Funds :("
            })
     }

})