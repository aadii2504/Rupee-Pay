const mongoose = require("mongoose");


mongoose.connect("--fbwhdfhsdf");

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

