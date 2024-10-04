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

// in this req the user has given some balance 
router.post("/", authmiddleware , async(req, res) => {

    try {
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

     const toAccount = await Account.findOne({userId: to}).session(session)


     if(!toAccount) {
        await session.abortTransaction()

        return res.status(400).json({
            message: "User Not Exists :("
        })
     }


     await Account.UpdateOne({userId: req.userId}, {$inc: {balance: -amount}}).session(session)
     await Account.UpdateOne({userId: to} , {$inc: {balance: amount}}).session(session)


     await session.commitTransaction()

     res.json({
        message: "Transfer Succesfull"
     });
        
    } catch (error) {
        await session.abortTransaction()
        session.endsession()
        return res.status(500).json({
            message: "Transaction Failed",
            error: error.message
        })
    }
});


module.exports = router;
