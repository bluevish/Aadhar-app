var mongoose=require("mongoose");
var passportLocalMongoose=require("passport-local-mongoose");

var userSchema=new mongoose.Schema({
   name:String,
   password:String,
   avatar:String,
   firstName:String,
   lastName:String,
   email:String,
   status:{type:String,default:"Hi there"},
   isAdmin:{type:Boolean,default:false}
});

userSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("user",userSchema);