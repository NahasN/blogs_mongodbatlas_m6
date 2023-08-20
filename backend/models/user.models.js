const mongoose = require("mongoose");



const userSchema = new mongoose.Schema({

    username:{
        type: String,
        required:[true,"Username required"],
    },

    email:{
        type: String,
        required:[true,"Email required"],
        unique: true,

    },
    password:{
        type:String,
        required:[true,"Password required"]
    },
    
    confirmPassword:{
        type:String,
        required:[true,"Please confirm password"]
    },
})

const usersModel = mongoose.model("users" , userSchema);


module.exports = usersModel;