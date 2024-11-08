//for protect .evn file
if(process.env.MODE_ENV != "production"){
    require('dotenv').config();
}
 
const express=require("express");
const app=express();
const mongoose=require("mongoose");
//const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
//const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/expressError.js");
//const {listingSchema,reviewSchema}=require("./init/schema.js");
//const Review=require("./models/review.js");
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/users.js");

const listingRoute=require("./routes/listings.js");
const reviewRoute=require("./routes/reviews.js");
const userRoute=require("./routes/users.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);

main().then(()=>{
    console.log("DB connected");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Travel');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const sessionOptions={
    secret:"mysupperserectcode",
    resave:false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() * 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,

    }
};
app.use(session(sessionOptions));
app.use(flash());

//password Implementation
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//root Route
app.get("/",(req,res)=>{
    res.redirect("/listings");
});
//creating listings flash middlewire
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.CurrUser=req.user;
    next();
});
// //user inserting.
// app.get("/user",async(req,res)=>{
//     let fakeUser=new User({
//         email:"reahihr@gmail.com",
//         username:"sujoy"
//     });
//     let registeredUser=await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// });

//use listings Router
app.use("/listings",listingRoute);

//use review Router
app.use("/listings/:id/reviews",reviewRoute);

//use listings Router
app.use("/",userRoute);



app.all("*",(req,res,next)=>{
    next(new ExpressError(404,`Page not Found`));
});
app.use((err,req,res,next)=>{
    let {status=500,message="Something Went Wrong"}= err;
    res.status(status).render("listings/error.ejs",{message,status});
   
});

app.listen(8080,()=>{
    console.log("server is lisitening port 8080");
});

// app.get("/listing",async(req,res)=>{
//     let sampleListing=new Listing({
//         title:"my new vila",
//         description:"By the Beach",
//         price:1500,
//         location:"Digha ,Purba Medinipur",
//         country:"India"
//     });
//     await sampleListing.save().then((res)=>{
//         console.log("sample was saved");
//     }).catch((err)=>{console.log(err)});
//     res.send("sample uploded");
// });
//validate listings for server site
// const validateListings=(req ,res,next)=>{
//     let {error}=listingSchema.validate(req.body);
//     if(error){
//         let errMsg=error.details.map((el)=>el.message).join(",");
//         throw new ExpressError(400, errMsg);
//     }else{
//         next();
//     }

// }
// //validate reviews for server site
// const validateReviews=(req ,res,next)=>{
//     let {error}=reviewSchema.validate(req.body);
//     if(error){
//         let errMsg=error.details.map((el)=>el.message).join(",");
//         throw new ExpressError(400, errMsg);
//     }else{
//         next();
//     }

// }

// //Index Route
// app.get("/listings", wrapAsync (async(req,res,next)=>{
//     const allListing=await Listing.find({});
//     res.render("listings/index.ejs",{allListing});
// }));
// //New Route
// app.get("/listings/new",(req,res)=>{
//     //res.send("addd new");
//     res.render("listings/new.ejs");
// });
// // Show Route
// app.get("/listings/:id",wrapAsync(async(req,res,next)=>{
//     let {id}=req.params;
//     const listing=await Listing.findById(id).populate("reviews");
//     res.render("listings/show.ejs",{listing});
// }));
// //Creat Route
// app.post("/listings",validateListings,wrapAsync(async(req,res,next)=>{
//    // let{title,description,price,location,country}=req.body;
//    //let listing=req.body;
//   //    console.log(req.body);
//     // if(!req.body.listing){
//     //     throw new ExpressError(400,"Send Valid Data For Listings");
//     // }
//     const newListing=new Listing(req.body.listing);
//     await newListing.save();
//     res.redirect("/listings");
// }));
// app.get("/listings/:id/edit",wrapAsync(async(req,res,next)=>{
//     let{id}=req.params;
//     const listing=await Listing.findById(id);
//     res.render("listings/edit.ejs",{listing});
// }));
// //update Route
// app.put("/listings/:id",validateListings,wrapAsync(async(req,res,next)=>{
//     let{id}=req.params;
//     // if(!req.body.listing){
//     //     throw new ExpressError(400,"Send Valid Data For Listings");
//     // }
//     await Listing.findByIdAndUpdate(id,{...req.body.listing});
//     res.redirect(`/listings/${id}`);
// }));
// //delete Listings Route
// app.delete("/listings/:id",wrapAsync(async(req,res,next)=>{
//     let{id}=req.params;
//     await Listing.findByIdAndDelete(id);
//     res.redirect("/listings");
// }));
// //reviews Route for post
// app.post("/listings/:id/reviews",validateReviews,wrapAsync(async(req,res)=>{
//     let{id}=req.params;
//     let listing=await Listing.findById(req.params.id);
//     let newReview=new Review(req.body.review);
    
//     listing.reviews.push(newReview);

//     await newReview.save();
//     await listing.save();
//     res.redirect(`/listings/${id}`);

// }));
// //reviews Route for post
// app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
//     let {id ,reviewId}=req.params;

//     await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
//     await Review.findByIdAndDelete(reviewId);

//     res.redirect(`/listings/${id}`);
    
// }));
// app.all("*",(req,res,next)=>{
//     next(new ExpressError(404,`Page not Found`));
// });
// app.use((err,req,res,next)=>{
//     let {status=500,message="Something Went Wrong"}= err;
//     res.status(status).render("listings/error.ejs",{message,status});
   
// });

// app.listen(8080,()=>{
//     console.log("server is lisitening port 8080");
// });