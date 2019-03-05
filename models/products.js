var mongoose=require("mongoose")

var productSchema = new mongoose.Schema({
    img: String,
    title:String,
    desp: String,
<<<<<<< HEAD
    price: Number
=======
    price: String
>>>>>>> e91cfe6440f0616f8faf478c84a7c6b9445c8b4a
    
});

module.exports=mongoose.model("Product",productSchema);