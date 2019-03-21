var mongoose=require("mongoose")

var orderSchema = new mongoose.Schema({
   user:{
       type:mongoose.Schema.Types.ObjectId,
       ref:"user"
   },
   cart:{
       type:Object,
       ref:"Cart",
          },
    address:String,
    name:String,
    paymentId:String
});

module.exports=mongoose.model("Order",orderSchema);