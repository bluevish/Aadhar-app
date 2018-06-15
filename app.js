var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var flash=require("connect-flash");
var passport=require("passport");
var LocalStrategy=require("passport-local");
var methodOverride=require("method-override");
var Ngos=require("./models/ngoModel");
var Comment=require("./models/commentModel");
var User=require("./models/userModel");
var seedDB=require("./seed");
require('dotenv').config();

var ngoRoutes     = require("./routes/ngo.js"),
    commentRoutes = require("./routes/comments.js"),
    indexRoutes   = require("./routes/index.js"),
    contactRoutes = require("./routes/contact");

var url=process.env.DATABASEURL||"mongodb://localhost/aadharApp";
mongoose.connect(url);


app.locals.moment = require('moment');

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());


//seed the data
// seedDB();


//passport config
app.use(require("express-session")({
    secret:"Good deeds",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
});



app.use("/",indexRoutes);
app.use("/ngo",ngoRoutes);
app.use("/ngo/:id/comments",commentRoutes);
app.use("/contact", contactRoutes);

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("App has started");
});


