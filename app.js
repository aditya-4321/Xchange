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
    Cart= require("./models/cart"),
    Order=require("./models/order"),
    flash=require("connect-flash"),
    methodOverride=require("method-override")
//   
var url=process.env.DATABASEURL || "mongodb://localhost/x_change";
mongoose.connect(url);

//mongoose.connect("mongodb://aditya:ninja123@ds221416.mlab.com:21416/xchange");
seedDB()
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"));
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

app.use(flash());
app.use(function(req, res, next){
    res.locals.login = req.isAuthenticated();
    res.locals.session = req.session;
    res.locals.currentUser= req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
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

app.post("/products",isLoggedIn,function(req, res){
    // var title=req.body.title;
    // var image=req.body.image;
    var newproduct=req.body.product;
    // var newproduct=product;
    
    product.create(newproduct,function(err, Product){
        if(err){
            console.log("Not worked");
            console.log(err);
        }
        req.flash("success","Successfully created a Product")
        res.redirect("/products");
    })
    
    
})

app.get("/products/new",isLoggedIn,function(req, res) {
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
//edit
app.get("/products/:id/edit",function(req, res) {
                product.findById(req.params.id, function(err, product){
                    if(err){
                        req.flash("error","Campground not Found")
                        res.redirect("back")
                    }   
                        
                            res.render("edit",{product: product})
                     })
})
//Update
app.put("/products/:id",function(req, res){
    product.findByIdAndUpdate(req.params.id , req.body.product, function(err, updatedproduct){
        if(err){
            req.flash("error","product not Found")
            res.redirect("/products")
        } else {
            req.flash("success","Update product")
            res.redirect("/products/"+req.params.id)
        }
    })
})
//Delete
app.delete("/products/:id",function(req, res){
    product.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/products")
        } else{
            req.flash("success","Deleted product")
            res.redirect("/products")
        }
    })
})
app.get("/add-to-cart/:id",isLoggedIn,function(req, res){
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

app.get("/shopping-cart",isLoggedIn,function(req, res){
  if(!req.session.cart){
      return res.render('shoppingcart',{products:null})
  }
  var cart =new Cart(req.session.cart);
  console.log(cart);
  res.render('shoppingcart',{products: cart.generateArray(),totalPrice:cart.totalPrice})
    
 
})
app.get("/checkout",isLoggedIn,function(req, res){
  if(!req.session.cart){
     res.redirect("/shopping-cart")
  }
  var cart =new Cart(req.session.cart);
  res.render('checkout',{total:cart.totalPrice})
    
 
})

app.post("/checkout",isLoggedIn,function(req, res){
    if(!req.session.cart){
     res.redirect("/shopping-cart")
  }
     var cart =new Cart(req.session.cart);
     var stripe = require("stripe")("sk_test_NfgFXY21RkHivlsD6rrBpnvD");
     stripe.charges.create({
                amount: cart.totalPrice*100,
                currency: "usd",
                source: req.body.stripeToken, // obtained with Stripe.js
                description: "Test Charge for learning Stripe"
}, function(err, charge) {
  if(err){
      console.log("err is here"+err)
      return res.redirect("/checkout")
  }else{
          var order=new Order({
          user:req.user,
          cart:cart,
          address:req.body.address,
          name:req.body.name,
          paymentId:charge.id
          
      })
      order.save(function(err, result){
          if(err){
              console.log(err)
          }
           console.log("success")
            req.session.cart=null;
           res.redirect("/userprofile")
      })
     
  }
});
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
    req.flash("success","Successfully Logged out")
    res.redirect("/products");
})

app.get("/userprofile",isLoggedIn,function(req, res){
    Order.find({user:req.user}, function(err, orders){
        if(err){
            return res.write("Error")
        }
        var cart;
        orders.forEach(function(order){
            cart=new Cart(order.cart)
            order.items=cart.generateArray()
           
        })
         res.render("userprofile",{orders: orders})
    })
    
})
app.get("/about",function(req, res){
    res.render("about")
})
function isLoggedIn(req, res, next){
    console.log("running");
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","Please Login First")
    res.redirect("/Login")
}






//Server Hosting


app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Server has Started");
})