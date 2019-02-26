var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose =  require("mongoose"),
    seedDB= require("./seeds"),
    product=require("./models/products"),
    user=require("./models/User"),
    passport=require("passport"),
    LocalStrategy=require("passport-local"),
    passportLocalMongoose=require("passport-local-mongoose")
    
    
mongoose.connect("mongodb://localhost/x_change");
seedDB()
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));

//Passport Configuration

app.use(require("express-session")({
    secret: "KBC means Kaun Banega Crorepati",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()))
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());





app.get("/",function(req, res){
    res.redirect("/products");
})



app.get("/products",function(req, res){
    product.find({},function(err, allproducts){
        if(err){
            console.log(err);
        }
        console.log("It worked");
         res.render("index",{allproducts:allproducts});
    })
   
 })








//=======
//AUTH ROUTES
//======
//show register form
app.get("/register",function(req, res){
    res.render("register")
})



app.post("/register",function(req , res){
    
     user.register(new user({username: req.body.username}), req.body.password, function(err, user){
         if(err){
             console.log(err);
             return res.render("register")
         }
         passport.authenticate("local")(req, res, function(){
             res.redirect("/products");
         })
     })
})

//login
//Auth routes Login
app.get("/Login",function(req, res){
    res.render("Login")
})

//middleware
app.post("/Login",passport.authenticate("local",{
    successRedirect: "/products",
    failureRedirect: "/Login"
}),function(req, res){
   
})


app.get("/Logout",function(req, res){
    req.logout();
    res.redirect("/products");
})











app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Server has Started");
})