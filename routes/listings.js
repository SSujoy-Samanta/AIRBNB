const express=require("express");
const router=express.Router();
const Listing=require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/expressError.js");
const {listingSchema}=require("../init/schema.js");
const {isLoggedIn}=require("../loginAuthintication.js");
const user=require("../models/users.js");
const multer  = require('multer');
const {storage} =require("../coludConfig.js");
const upload = multer({ storage });

router.use(express.urlencoded({extended:true}));



//validate listings for server site
const validateListings=(req ,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }

}
//Index Route
router.get("/", wrapAsync (async(req,res,next)=>{
    const search=req.query.search;
    const allListing=await Listing.find({});
    const someListing=await Listing.find({
        $or:[
            {title:{ $regex:'.*'+search+'.*',$options:'i'}},
        ]
    });
    res.render("listings/index.ejs",{allListing,someListing});
}));
//New Route
router.get("/new",isLoggedIn,(req,res)=>{
    //res.send("addd new");
    res.render("listings/new.ejs");
});
// Show Route
router.get("/:id",wrapAsync(async(req,res,next)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({
        path:"reviews",
        populate:{
            path:"author",
        } 
    }).populate("owner");
    if(!listing){
        req.flash("error","Listing you requested it does not exist...");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}));
//Creat Route
router.post("/",isLoggedIn,upload.single("listing[image]"),validateListings,wrapAsync(async(req,res,next)=>{
   // let{title,description,price,location,country}=req.body;
   //let listing=req.body;
  //    console.log(req.body);
    // if(!req.body.listing){
    //     throw new ExpressError(400,"Send Valid Data For Listings");
    // }
    let url=req.file.path;
    let filename=req.file.filename;
    const newListing=new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image={url,filename};
    await newListing.save();
    req.flash("success","!!New Listings Created...");
    res.redirect("/listings");
}));
//edit Route
router.get("/:id/edit",isLoggedIn,wrapAsync(async(req,res,next)=>{
    let{id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested it does not exist...");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
}));
//update Route
router.put("/:id",isLoggedIn,upload.single("listing[image]"),validateListings,wrapAsync(async(req,res,next)=>{
    let{id}=req.params;
    // if(!req.body.listing){
    //     throw new ExpressError(400,"Send Valid Data For Listings");
    // }
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof (req.file) !== "undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }

    req.flash("success","!!A Listings Edited...");
    res.redirect(`/listings/${id}`);
}));
//delete Listings Route
router.delete("/:id",isLoggedIn,wrapAsync(async(req,res,next)=>{
    let{id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","!!A Listings Deleted...");
    res.redirect("/listings");
}));

//search route
router.get("/?",(req,res)=>{
    res.send("searching")
})

module.exports=router;