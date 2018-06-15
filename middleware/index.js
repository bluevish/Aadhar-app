//all middleware

var Ngos=require("../models/ngoModel");
var Comment=require("../models/commentModel");

var middlewareObject={};

middlewareObject.checkNgoOwnership=function(req,res,next){
    if(req.isAuthenticated()){
        Ngos.findById(req.params.id,function(err,foundNgo){
            if(err){
                req.flash("error","Ngo Not Found !!");
                res.redirect("/ngo");
            }else{
                if (!foundNgo) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                }
                if(req.user.isAdmin){
                    next();  
                }else{
                    req.flash("error","You Don't Have Permission To Do That");
                    res.redirect("back");
                }
                
            }
        });
   }
   else{
       req.flash("error","Please Login First !");
       res.redirect("back");
   }
}

middlewareObject.checkCommentOwnership=function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err,foundComment){
            if(err){
                req.flash("error","Comment Not Found !!")
                res.redirect("back");
            }else{
                if (!foundComment) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                }
                if(foundComment.author.id.equals(req.user._id)||req.user.isAdmin){
                    next();  
                }else{
                    req.flash("error","You Don't Have Permission To Do That");
                    res.redirect("back");
                }
                
            }
        });
   }
   else{
       req.flash("error","Please Login First !");
       res.redirect("back");
   }
}

middlewareObject.isLoggedIn=function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","Please Login First !");
    res.redirect("/login");
}


module.exports=middlewareObject;