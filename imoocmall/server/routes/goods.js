var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/goods');

//连接数据库
mongoose.connect('mongodb://127.0.0.1:27017/dumall');
mongoose.connection.on("connected", function () {
    console.log("MongoDB connected success.")
});

//监听连接失败信息
mongoose.connection.on("error", function () {
    console.log("MongoDB conected fail.")
});

//监听连接的断开信息
mongoose.connection.on("disconnected", function () {
    console.log("MongoDB connected disconnexted.")
});

//查询商品列表数据
router.get("/list", (req, res, next) => {
    //获取url中参数
    //http://localhost:3000/goods?pageIndex=1&pageSize=10&sort=1
    let pageIndex = parseInt(req.param('pageIndex'));
    let pageSize = parseInt(req.param('pageSize'));
    let priceLevel = req.param('priceLevel');
    let sort = req.param('sort');

    let skip = (pageIndex - 1) * pageSize;
    let params = {};

    let priceGt = '', priceLte = '';
    if (priceLevel != "all") {
        switch (priceLevel) {
            case '0': priceGt = 0; priceLte = 500; break;
            case '1': priceGt = 500; priceLte = 1000; break;
            case '2': priceGt = 1000; priceLte = 2000; break;
        }
        params = {
            'salePrice': {
                $gt: priceGt,
                $lte: priceLte
            }
        }
    }


    //分页  skip跳过多少条数据 limit展示多少条数据
    let goodModels = Goods.find(params).skip(skip).limit(pageSize);
    //排序
    goodModels.sort({ 'salePrice': sort });

    //执行上述操作 并设置回调函数
    goodModels.exec((err, doc) => {
        if (err) {
            res.json({
                status: '1',
                msg: err.message
            })
        } else {
            res.json({
                status: '0',
                msg: '',
                result: {
                    count: doc.length,
                    list: doc
                }
            })
        }
    })
});

//加入购物车
router.post("/addCart", (req, res, next) => {
    var userId = "admin", productId = req.body.productId;
    var User = require('../models/users');
    User.findOne({ userId: userId }, (err, userDoc) => {
        if (err) {
            res.json({
                status: "1",
                msg: err.message
            })
        } else {
            if (userDoc) {
                let goodsItem = {};
                userDoc.cartList.forEach(item => {
                    if (item.productId == productId) {
                        goodsItem = item;
                        item.productNum++;
                    }
                });
                if (JSON.stringify(goodsItem)!="{}") {
                    userDoc.save((err2, doc) => {
                        if (err2) {
                            res.json({
                                status: "1",
                                msg: err2.message
                            })
                        } else {
                            res.json({
                                status: '0',
                                msg: '',
                                result: 'success'
                            })
                        }
                    })
                } else {
                    Goods.findOne({ productId: productId }, (err1, goodsDoc) => {
                        if (err1) {
                            res.json({
                                status: "1",
                                msg: err1.message
                            })
                        } else {
                            if (goodsDoc) {
                                goodsDoc.productNum = 1;
                                goodsDoc.checked = 1;

                                userDoc.cartList.push(goodsDoc);
                                userDoc.save((err2, doc) => {
                                    if (err2) {
                                        res.json({
                                            status: "1",
                                            msg: err2.message
                                        })
                                    } else {
                                        res.json({
                                            status: '0',
                                            msg: '',
                                            result: 'success'
                                        })
                                    }
                                })
                            }
                        }
                    })
                }
            }
        }
    })
});

module.exports = router;