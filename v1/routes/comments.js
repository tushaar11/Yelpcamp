var express = require("express");
var router = express.Router({mergeParams:true});
var Campground =require("../models/campground");
var Comment =require("../models/comment");
var User  =require("../models/user");
var middleware= require("../middleware");

router.get("/new",middleware.isLoggedIn,function(req,res){
   Campground.findById(req.params.id,function(err,campground){
       if(err){
           console.log(err);
         }else{
           res.render("comments/new",{campground:campground});
       }
   });
});

router.post("/",middleware.isLoggedIn,function(req,res){
   //lokup campground using id
   Campground.findById(req.params.id,function(err,campground){
      if(err){
          console.log(err);
          res.redirect("/campgrounds");
      } 
      else{
          Comment.create(req.body.comment,function(err,comment){
             if(err){
                 req.flash("error","something went wrong!!");
             } 
             else{
                 //add username and id to comment
                 comment.author.username=req.user.username;
                 comment.author.id=req.user._id;
                 comment.save();
                 //save comment
                 campground.comments.push(comment);
                 campground.save();
                 req.flash("success","succesfully addded comment");
                 res.redirect("/campgrounds/"+campground._id);
             }
          });
      }
   });
   //create new comment
   //connect new comment to campground
   //redirect campground show page
   
});

router.get("/:comment_id/edit",middleware.checkCommentOwneship,function(req,res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
          res.redirect("back");
      } else {
        res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
      }
    });
});

router.put("/:comment_id",middleware.checkCommentOwneship,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
   if(err){
       res.redirect("back");
   }
   else
   {
       res.redirect("/campgrounds/" + req.params.id);
   }
   });
    
});
//comment destroy route
router.delete("/:comment_id",middleware.checkCommentOwneship,function(req,res){
    //findbyidandremove
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
       if(err)
       {
           res.redirect("back");
       }else{
           req.flash("success","comment deleted");
           res.redirect("/campgrounds/"+req.params.id);
       }
    });
});


module.exports=router;