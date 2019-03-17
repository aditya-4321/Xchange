var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose =  require("mongoose"),
    seedDB= require("./seeds"),
    cookieParser = require('cookie-parser'),
    session=require("express-session"),
    Mongostore=require("connect-mongo")(session),
    product=require("./models/products"),
    user=require("./models/User"),
    passport=require("passport"),
    LocalStrategy=require("passport-local").Strategy,
    passportLocalMongoose=require("passport-local-mongoose"),
    Cart= require("./models/cart")
//   
//mongodb://aditya:ninja123@ds247852.mlab.com:47852/xchange   
mongoose.connect("mongodb://localhost/x_change");
//seedDB()
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"))
//Passport Configuration
app.use(cookieParser())
app.use(session({
    secret: "KBC means Kaun Banega Crorepati",
    resave: false,
    saveUninitialized: false,
    store: new Mongostore({ mongooseConnection : mongoose.connection}),
    cookie:{ maxAge: 180 * 60 *1000 }
}))
app.use(express.static("public"))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()))
app.use(function(req, res, next){
    res.locals.login = req.isAuthenticated();
    res.locals.session = req.session;
    next();
})

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
       // console.log(allproducts);
        var productgrp=[];
        var productcount=4;
        
        for(var i=0;i<allproducts.length;i=i+productcount){
           
            productgrp.push(allproducts.slice(i,i+productcount))
            
           
        }
        
          res.render("index",{allproducts:productgrp})
    })
   
 })

app.post("/products",function(req, res){
    // var title=req.body.title;
    // var image=req.body.image;
    var newproduct=req.body.product;
    // var newproduct=product;
    
    product.create(newproduct,function(err, Product){
        if(err){
            console.log("Not worked");
            console.log(err);
        }
        res.redirect("/products");
    })
    
    
})

app.get("/products/new",function(req, res) {
    res.render("new.ejs");
})


app.get("/products/:id",function(req, res) {
    product.findById(req.params.id,function(err, foundproduct){
        if(err){
            console.log(err);
        }
        res.render("show",{product:foundproduct})
    })
})

app.get("/add-to-cart/:id",function(req, res){
    var productId=req.params.id;
    var cart= new Cart(req.session.cart ? req.session.cart : {})
    
    product.findById(productId, function(err, product){
        if(err){
            return res.redirect('/')
        }
        cart.add(product,productId)
        
        req.session.cart = cart;
        //console.log(req.session.cart)
        res.redirect('/')
    })
})

app.get("/shopping-cart",function(req, res){
  if(!req.session.cart){
      return res.render('shoppingcart',{products:null})
  }
  var cart =new Cart(req.session.cart);
  console.log(cart);
  res.render('shoppingcart',{products: cart.generateArray(),totalPrice:cart.totalPrice})
    
 
})
app.get("/checkout",function(req, res){
  if(!req.session.cart){
     res.redirect("/shopping-cart")
  }
  var cart =new Cart(req.session.cart);
  res.render('checkout',{total:cart.totalPrice})
    
 
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

//store routes


app.get("/fashion",function(req, res){
    res.render("fashion")
})

app.get("/electronics",function(req, res){
   res.render("electronics")
})

app.get("/games",function(req, res){
   res.render("games")
})

app.get("/books",function(req, res){
   res.render("books")
})

app.get("/global",function(req, res){
   res.render("global")
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
    
    req.session.cart=null;
    res.redirect("/products");
})







//Server Hosting


app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Server has Started");
})