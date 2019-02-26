var mongoose=require("mongoose")

var productSchema = new mongoose.Schema({
    img: String,
    title:String,
    desp: String,
    price: String
    
});

module.exports=mongoose.model("Product",productSchema);