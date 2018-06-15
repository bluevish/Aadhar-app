var express=require("express");
var router=express.Router();
var passport=require("passport");
var middleware=require("../middleware");


//model config
var User=require("../models/userModel");


//root route
router.get("/",function(req,res){
    res.render("landing");
});

router.get("/about",function(req,res){
    res.render("about");
});

router.get("/gallery",function(req,res){
    res.render("gallery");
});


//show register form
router.get("/register",function(req, res) {
   res.render("register"); 
});

router.get("/registerasadmin",function(req, res) {
   res.render("registerAdmin"); 
});



//using sign up logic
router.post("/register",function(req, res) {
    var newUser=new User(
        {
            username:req.body.username,
            firstName:req.body.firstName,
            lastName:req.body.lastName,
            avatar:req.body.avatar,
            email:req.body.email,
        });
    if(req.body.adminCode&&(req.body.adminCode===process.env.ADMIN_CODE)){
        newUser.isAdmin=true;
    }
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            req.flash("error",err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req,res,function(){
            req.flash("success","Welcome to Aadhar "+user.username);
            res.redirect("/ngo");
        });
    });
});


//show login form
router.get("/login",function(req, res) {
   res.render("login");
});

//login logic
router.post("/login",passport.authenticate("local",
    {
        successRedirect:"/ngo",
        failureRedirect:"/login"
    })
);

//logout logic
router.get("/logout",function(req, res) {
    req.logout();
    req.flash("success","Logged You Out !!");
    res.redirect("/ngo");
});

router.get("/user/edit",middleware.isLoggedIn,function(req, res) {
    res.render("users/edit");
});

router.put("/user/edit",middleware.isLoggedIn,function(req,res){
    var newData=
        {
            firstName:req.body.firstName,
            lastName:req.body.lastName,
            email:req.body.email,
            status:req.body.status,
        };
        
    console.log(req.user._id);
    User.findByIdAndUpdate(req.user._id,{$set: newData},function(err,updatedUserProfile){
               if(err){
                   console.log(err);
               } 
               else{
                   res.redirect("/user/edit");
               }
            });
})

//user profiles
router.get("/user/:id",function(req, res) {
    User.findById(req.params.id,function(err,foundUser){
        if(err){
            req.flash("error","Something went wrong ! ");
            res.redirect("/");
        }
        res.render("users/show",{user:foundUser});
    })
})




module.exports=router;
