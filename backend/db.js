const mongoose = require("mongoose");


mongoose.connect("mongodb+srv://aditya:4adi2504@cluster0.guwptrv.mongodb.net/");

const userSchema =  mongoose.Schema({
    username: String,
    password: String,
    firstname: String,
    lastname: String
})

const User = mongoose.model("User" ,  userSchema);

module.export = {
    User
}

