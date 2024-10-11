const express = require('express')

const router = express.Router();

const { Account } = require("../db")
const { default : mongoose, startSession}   =  require("mongoose");
const { authMiddleware } = require('../middleware');


router.get("/balance" , authMiddleware , async (req ,  res) => {
    try {
        const account = await Account.findOne({
            userId: req.userId
        });

        if (!account) {
            return res.status(404).json({
                message: "Account not found"
            });
        }

        res.json({
            balance: account.balance
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching balance",
            error: error.message
        });
    }
})

// in this req the user has given some balance 
router.post("/", authMiddleware , async(req, res) => {

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


     await Account.updateOne({userId: req.userId}, {$inc: {balance: -amount}}).session(session)
     await Account.updateOne({userId: to} , {$inc: {balance: amount}}).session(session)


     await session.commitTransaction()

     res.json({
        message: "Transfer Succesfull"
     });
        
    } catch (error) {
        await session.abortTransaction()
        session.endSession();
        return res.status(500).json({
            message: "Transaction Failed",
            error: error.message
        })
    } finally {
        session.endSession(); // Make sure session is always ended
    }
});


module.exports = router;
