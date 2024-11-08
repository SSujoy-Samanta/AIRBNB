const express=require("express");
const router=express.Router();
const User=require("../models/users.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../loginAuthintication.js");

router.use(express.urlencoded({extended:true}));

//for sing up
router.get("/singup",(req,res)=>{
    res.render("users/singup.ejs");
});
router.post("/singup",wrapAsync(async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        const newUser=new User({email,username});
        const registeredUser = await User.register(newUser,password);
        req.login(registeredUser,(err)=>{
            if(err){
               return next(err);
            }
            req.flash("success","you are singed up successfully...");
            res.redirect("/listings");
        });
        
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/singup");
    }
    
}));
//for log in 
router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});
//for cheacking user log in
router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),async(req,res)=>{
    req.flash("success","Welcome Back To Travel");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
});

// log-out
router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","You are looged out");
        res.redirect("/listings");
    });
});
module.exports=router;