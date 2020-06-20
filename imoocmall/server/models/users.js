var mongoose=require('mongoose');

var userSchema=new mongoose.Schema({
    "userId":String,
    "userName":String,
    "userPwd":String,
    "orderList":Array,
    "cartList":[
        {
            "productId":String,
            "productName":String,
            "salePrice":Number,
            "productNum":Number,
            "checked":String,
            "productImage":String
        }
    ],
    "addressList":Array
});

module.exports=mongoose.model("User",userSchema);