var mongoose= require("mongoose");
var product= require("./models/products");


var data=[
    {
         img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiihyl6VClvNtWyHssvJP226TfKWI5HAL6J1uu78kaOQVNTdX8",
         title: "smartphone",
         desp: "If your mind is full of horseshit,it will aggravate your situation",
         price: "20k$"
    }, 
    {
         img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiihyl6VClvNtWyHssvJP226TfKWI5HAL6J1uu78kaOQVNTdX8",
         title: "smartphone",
         desp: "If your mind is full of horseshit,it will aggravate your situation",
         price: "20k$"
    },
    {
         img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiihyl6VClvNtWyHssvJP226TfKWI5HAL6J1uu78kaOQVNTdX8",
         title: "smartphone",
         desp: "If your mind is full of horseshit,it will aggravate your situation",
         price: "20k$"
    },  
    {
         img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiihyl6VClvNtWyHssvJP226TfKWI5HAL6J1uu78kaOQVNTdX8",
         title: "smartphone",
         desp: "If your mind is full of horseshit,it will aggravate your situation",
         price: "20k$"
    },
    {
         img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiihyl6VClvNtWyHssvJP226TfKWI5HAL6J1uu78kaOQVNTdX8",
         title: "smartphone",
         desp: "If your mind is full of horseshit,it will aggravate your situation",
         price: "20k$"
    },
    {
         img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiihyl6VClvNtWyHssvJP226TfKWI5HAL6J1uu78kaOQVNTdX8",
         title: "smartphone",
         desp: "If your mind is full of horseshit,it will aggravate your situation",
         price: "20k$"
    }
]
 
function seedDB(){
product.remove({},function(err){
    if(err){
        console.log(err);
    }
    else{
        console.log("Removed all the Products");
        data.forEach(function(seed){
            
              product.create(seed, function(err ,product){
            if(err){
                console.log(err);
            }
            else{
                console.log("Created a Product");
            }
        })
        })
    }
    })

}
module.exports= seedDB
