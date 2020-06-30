var express = require('express');
var router = express.Router();

var User = require('./../models/users');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

//登录
router.post('/login', function (req, res, next) {
  var param = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  }
  User.findOne(param, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      if (doc) {
        //保存到客户端Cookie
        res.cookie("userId", doc.userId, {
          path: '/',
          maxAge: 1000 * 60 * 60,
        })
        res.cookie("userName", doc.userName, {
          path: '/',
          maxAge: 1000 * 60 * 60,
        })
        //保存到Session
        //需要使用express-session插件
        // req.session.user=doc;
        res.json({
          status: '0',
          msg: '',
          result: {
            userName: doc.userName
          }
        })
      }
    }
  })
});

//登出
router.post('/logout', (req, res, next) => {
  //清除Cookie
  res.cookie('userId', '', {
    path: '/',
    maxAge: -1
  })
  res.json({
    status: '0',
    msg: '',
    result: ''
  })
});

//检测是否登录
router.get('/checkLogin', (req, res, next) => {
  //查看Cookies中是都有登录信息
  if (req.cookies.userId) {
    res.json({
      status: '0',
      msg: '',
      result: req.cookies.userName || ''
    });
  } else {
    res.json({
      status: '1',
      msg: '未登录',
      result: ''
    })
  }
})

//查询当前用户的购物车数据
router.get('/cartlist', (req, res, next) => {
  var userId=req.cookies.userId;
  User.findOne({userId:userId},(err,doc)=>{
    if(err){
    res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
    if(doc){
        res.json({
          status:'0',
          msg:'',
          result:doc.cartList
        })
      }
    }
  })
})

//删除购物车商品
router.post('/cartDel', (req, res, next) => {
  var userId=req.cookies.userId;
  var productId=req.body.productId;
  User.update({
    userId,userId
  },{
    $pull:{
      'cartList':{
        'productId':productId
      }
    }
  },(err,doc)=>{
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      res.json({
        status:'0',
        msg:'',
        result:'success'
      })
    }
  })
})

//修改商品数量
router.post('/cartEdit', (req, res, next) =>{
  var userId=req.cookies.userId;
  var productId=req.body.productId;
  var productNum=req.body.productNum;
  var checked=req.body.checked;
  User.update({"userId":userId,"cartList.productId":productId},{
    "cartList.$.productNum":productNum,
    "cartList.$.checked":checked
  },(err,doc)=>{
    if(err){
      res.json({
        status:'1',
        msg:errr.message,
        result:''
      })
    }else{
      res.json({
          status:'0',
          msg:'',
          result:'success'
      })
    }
  })
})

//商品全选
router.post('/selectAll', (req, res, next) =>{
  var userId=req.cookies.userId,
      checkAll=req.body.checkAll=='1'?'1':'0';
  User.findOne({userId:userId},(err,user)=>{
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      if(user){
        user.cartList.forEach(item=>{
          item.checked=checkAll
        })
        user.save((err1,doc)=>{
          if(err1){
            res.json({
              status:'1',
              msg:err1.message,
              result:''
            })
          }else{
            res.json({
              status:'0',
              msg:'',
              result:'success'
            })
          }
        })
      }
    }
  })
})

router.get('/getCartCount',(req,res,next)=>{
  if(req.cookies&&req.cookies.userId){
    let userId=req.cookies.userId;
    User.findOne({userId:userId},(err,doc)=>{
      if(err){
        res.json({
          state:'1',
          msg:err.message,
          result:''
        })
      }else{
        let CartCount=0;
        let cartList=doc.cartList;
        cartList.map(item=>{
          CartCount+=parseInt(item.productNum);
        })
        res.json({
          state:'0',
          msg:'',
          result:CartCount
        })
      }
    })
  }
})

module.exports = router;
