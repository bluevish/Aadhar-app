var mongoose=require("mongoose");
var Comment=require("./models/commentModel");
var Ngos=require("./models/ngoModel");


var data=[
        {
            name:"ATMA",
            image:"https://www.helpyourngo.com/hyngo-blog/wp-content/uploads/2016/07/Atma-Network-2.jpg",
            description:"We provide partners with a systematic approach to grow and amplify their impact. The way we work is crucial to our success. We combine a strong result focused approach with a collaborative attitude. We don’t just ‘pass by’ as consultants, but really walk our talk together with our partners."
        },
        {
            name:"ATMA",
            image:"https://www.helpyourngo.com/hyngo-blog/wp-content/uploads/2016/07/Atma-Network-2.jpg",
            description:"We provide partners with a systematic approach to grow and amplify their impact. The way we work is crucial to our success. We combine a strong result focused approach with a collaborative attitude. We don’t just ‘pass by’ as consultants, but really walk our talk together with our partners."
        },
        {
            name:"ATMA",
            image:"https://www.helpyourngo.com/hyngo-blog/wp-content/uploads/2016/07/Atma-Network-2.jpg",
            description:"We provide partners with a systematic approach to grow and amplify their impact. The way we work is crucial to our success. We combine a strong result focused approach with a collaborative attitude. We don’t just ‘pass by’ as consultants, but really walk our talk together with our partners."
        }
    ]


function seedDB(){
    //remove databse
    Ngos.remove({},function(err){
        if(err){
            console.log(err);
        }
        else{
            console.log("Data removed");
            //add database
            data.forEach(function(ngo){
                Ngos.create(ngo,function(err,ngoCreated){
                    if(err){
                        console.log(err);
                    }
                    else{
                        console.log("NGO added");
                        Comment.create(
                            {
                                text:"Good NGO",
                                author:"Hermione"
                            },
                            function(err,commentCreated){
                                if(err){
                                    console.log(err);
                                }
                                else{
                                    ngoCreated.comments.push(commentCreated);
                                    ngoCreated.save();
                                    console.log("Created new comment");
                                }
                            }
                        )
                    }
                })
            })
        }
    });
}






module.exports=seedDB;