const { string } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const passportLocalMongoose = reqire("passportLocalMongoose");

const userSchema = new Schema({
    email:{
        type:string,
        required : true,
    },
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User",userSchema);