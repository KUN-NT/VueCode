var mongoose=require('mongoose');

var Schme=mongoose.Schema;
var productSchema=new Schme({
    "productId":String,
    "productName": String,
    "salePrice":Number,
    "productNum":Number,
    "checked":String,
    "productImg":String,
    "productUrl":String
});

module.exports=mongoose.model('Good',productSchema);