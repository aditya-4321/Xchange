function cart(oldcart){
    this.items=oldcart.items || {};
    this.totalQty=oldcart.totalQty || 0;
    this.totalPrice=oldcart.totalPrice || 0;
    
    this.add =function(item, id){
        var storeditem =this.items[id];
        if(!storeditem){
            storeditem= this.items[id] = {item: item, qty:0,price: 0};
        }
        storeditem.qty++;
        storeditem.price = storeditem.item.price * storeditem.qty;
        this.totalQty++;
        this.totalPrice += storeditem.item.price;
    }

 
 this.generateArray = function(){
     var arr = [];
     for(var id in this.items){
         arr.push(this.items[id]);
     }
     return arr;
 };

}

module.exports= cart;