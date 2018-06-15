var express=require("express");
var router=express.Router({mergeParams:true});

var middleware=require("../middleware");


//models config
var Ngos=require("../models/ngoModel");
var Comment=require("../models/commentModel");


//NEW:show form to create new comment
router.get("/new",middleware.isLoggedIn,function(req,res){
    Ngos.findById(req.params.id,function(err,ngo){
        if(err){
            console.log(err);
        }
        else{
            res.render("comments/new",{ngo:ngo});
        }
    });
});


//CREATE:add new comment to db
router.post("/",middleware.isLoggedIn,function(req,res){
    Ngos.findById(req.params.id,function(err, ngo) {
        if(err){
            console.log(err);
        }
        else{
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    console.log(err);
                }
                else{
                    comment.author.id=req.user._id;
                    comment.author.username=req.user.username;
                    comment.date=Date.now()
                    comment.save();
                    ngo.comments.push(comment);
                    ngo.save();
                    res.redirect("/ngo/"+ngo._id);
                }
            });
        }
    });
});


//edit route
router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
    Comment.findById(req.params.comment_id,function(err, foundComment) {
        if(err){
            res.redirect("back");
        }
        else{
            res.render("comments/edit",{ngo_id:req.params.id,comment:foundComment});
        }
    });
});


//update route
router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
       if(err){
           res.redirect("back");
       } else{
           res.redirect("/ngo/"+req.params.id);
       }
       
    });
});

//delete route
router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            res.redirect("back");
        }
        else{
            res.redirect("/ngo/"+req.params.id);
        }
    })
});





module.exports=router;
