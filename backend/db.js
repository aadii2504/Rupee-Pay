const mongoose = require("mongoose");



mongoose.connect("mongodb+srv://aditya:4adi2504@cluster0.guwptrv.mongodb.net/");

const userSchema =  mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim : true,
        lowercase : true,
        minlength: 3,
        maxlength : 30

    },
    password: {
        type: String, 
        required: true,
        minLength : 6
    },
    firstname: {
        type: String,
        required: true,
        trim : true ,
        maxLength : 30
    },
    lastname:  {
        type : String,
        required : true ,
        trim : true,
        maxLength : 30
    }
})
 


const accountSchema  = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,

    },
    balance :{
        type: Number,
        required : true
    }

})


const Account = mongoose.model('Account' , accountSchema)
const User = mongoose.model("User" ,  userSchema);

module.export = {
    User,
    Account
}

