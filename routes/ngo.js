var express=require("express");
var router=express.Router();

var middleware=require("../middleware");

var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);


//models config
var Ngos=require("../models/ngoModel");




//INDEX-show all ngos
router.get("/",function(req,res){
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        
        var queryNgo={$or:[{name:regex},{description:regex},{address:regex},{cause:regex}]};
        Ngos.find(queryNgo,function(err,ngos){
            if(err){
                console.log(err);
            }
            else{
                
                res.render("ngos/index",{ngos:ngos,currentUser:req.user});
            }
        });
    }else {
    
        Ngos.find({},function(err,ngos){
            if(err){
                console.log(err);
            }
            else{
                res.render("ngos/index",{ngos:ngos,currentUser:req.user});
            }
        });
    }
});


//NEW-show form to create new ngo
router.get("/new",middleware.isLoggedIn,function(req, res) {
    if(req.user.isAdmin){
        res.render("ngos/new");
    }else{
        req.flash("error","You Don't Have Permission To Do That");
        res.redirect("back");
    }
});


//SHOW-show information about selected ngo
router.get("/:id",function(req,res){
    Ngos.findById(req.params.id).populate("comments").exec(function(err,foundNgo){
        if(err){
            console.log(err);
        }
        else{
            res.render("ngos/show",{ngo:foundNgo});
        }
    });
    
});

router.get("/:id/contact",function(req,res){
    Ngos.findById(req.params.id).populate("comments").exec(function(err,foundNgo){
        if(err){
            console.log(err);
        }
        else{
            res.render("ngos/contact",{ngo:foundNgo});
        }
    });
    
});

router.get("/:id/reviews",function(req,res){
    Ngos.findById(req.params.id).populate("comments").exec(function(err,foundNgo){
        if(err){
            console.log(err);
        }
        else{
            res.render("ngos/showReviews",{ngo:foundNgo});
        }
    });
    
});



//CREATE-add new ngo to db
router.post("/",middleware.isLoggedIn,function(req,res){
    if(req.user.isAdmin){
        var name=req.body.name;
        var image=req.body.image;
        var description=req.body.description;
        var ngoLink=req.body.ngoLink;
        var cause=req.body.cause;
        // var address=req.body.address;
        var contact=req.body.contact;
        var author={
            id:req.user._id,
            username:req.user.username
        };
        geocoder.geocode(req.body.address, function (err, data) {
                if (err || !data.length) {
                  req.flash('error', 'Invalid address');
                  return res.redirect('back');
                }
                else{
                    var lat = data[0].latitude;
                    var lng = data[0].longitude;
                    var address = data[0].formattedAddress;
                    var newNgo={name:name,image:image,description:description,ngoLink:ngoLink,cause:cause,address:address,contact:contact,author:author,lat:lat,lng:lng};
                    Ngos.create(newNgo,function(err,ngo){
                        if(err){
                            console.log(err);
                        }
                        else{
                            req.flash("success","Successfully Added Ngo");
                            res.redirect("/ngo");
                        }
                    });
                }
            
        });    
    }else{
        req.flash("error","You Don't Have Permission To Do That");
        res.redirect("back");
    }
    
});


//EDIT-edit ngo
router.get("/:id/edit",middleware.checkNgoOwnership,function(req, res) {
    Ngos.findById(req.params.id,function(err,foundNgo){
        if(err){
            console.log(err);
        }
        res.render("ngos/edit",{ngo:foundNgo});  
   });
});


//UPDATE-update ngo
router.put("/:id",middleware.checkNgoOwnership,function(req,res){
    geocoder.geocode(req.body.address, function (err, data) {
            if (err || !data.length) {
              req.flash('error', 'Invalid address');
              return res.redirect('back');
            }
            else{
              
                    var lat = data[0].latitude;
                    var lng = data[0].longitude;
                    var address = data[0].formattedAddress;
                    var newData={name:req.body.name,image:req.body.image,description:req.body.description,ngoLink:req.body.ngoLink,cause:req.body.cause,address:req.body.address,contact:req.body.contact,lat:lat,lng:lng};
                    Ngos.findByIdAndUpdate(req.params.id,{$set: newData},function(err,updatedNgo){
                        if(err){
                            console.log(err);
                            res.redirect("/ngo");
                        } 
                        else{
                            updatedNgo.lat=lat;
                            updatedNgo.lng=lng;
                            updatedNgo.address=address;
                            updatedNgo.save();
                            res.redirect("/ngo/"+req.params.id);
                        }    
                    });
                
            
                
            }
        
    });
});


//DESTROY
router.delete("/:id",middleware.checkNgoOwnership,function(req,res){
    Ngos.findByIdAndRemove(req.params.id,function(err){
        if(err){
            console.log(err);
        }
        res.redirect("/ngo");
    });
});



function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};






module.exports=router;