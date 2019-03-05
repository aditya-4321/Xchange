var mongoose=require("mongoose")

var productSchema = new mongoose.Schema({
    img: String,
    title:String,
    desp: String,
    price: Number
    
});

module.exports=mongoose.model("Product",productSchema);