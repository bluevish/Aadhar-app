// var mongoose=require("mongoose");
// var Comment=require("./commentModel")

// var ngoSchema=new mongoose.Schema({
//   name:String,
//   image:String,
//   description:String,
//   comments:[
//                 {
//                     type:mongoose.Schema.Types.ObjectId,
//                     ref:"Comment"
//                 }
//             ]
// });
// module.exports=mongoose.model("ngo",ngoSchema);


var mongoose = require("mongoose");

var ngoSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String,
   ngoLink:String,
   cause:String,
   address:String,
   lat:Number,
   lng:Number,
   contact:String,
   author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String
    },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "comment"
      }
   ]
});

module.exports = mongoose.model("ngo", ngoSchema);
