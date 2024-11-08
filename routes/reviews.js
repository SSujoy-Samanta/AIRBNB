const express=require("express");
const router=express.Router({mergeParams:true});
const Listing=require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/expressError.js");
const {reviewSchema}=require("../init/schema.js");
const Review=require("../models/review.js");
const { isLoggedIn } = require("../loginAuthintication.js");


//validate reviews for server site
const validateReviews=(req ,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }

}
//reviews Route for post
router.post("/",isLoggedIn,validateReviews,wrapAsync(async(req,res)=>{
    let{id}=req.params;
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success","!!A Review Created...");
    res.redirect(`/listings/${id}`);

}));
//reviews Route for post
router.delete("/:reviewId",isLoggedIn,wrapAsync(async(req,res)=>{
    let {id ,reviewId}=req.params;

    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","!!A Review Deleted...");

    res.redirect(`/listings/${id}`);
    
}));

module.exports=router;