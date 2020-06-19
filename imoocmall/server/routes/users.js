var express = require('express');
var router = express.Router();

var User=require('./../models/users');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//登录
router.post('/login', function(req, res, next) {
  var param={
    userName:req.body.userName,
    userPwd:req.body.userPwd
  }
  User.findOne(param,(err,doc)=>{
    if(err){
      res.json({
        status:'1',
        msg:err.message
      })
    }else{
      if(doc){
        //保存到客户端Cookie
        res.cookie("userId",doc.userId,{
          path:'/',
          maxAge:1000*60*60,
        })
        //保存到Session
        // req.session.user=doc;
        res.json({
          status:'0',
          msg:'',
          result:{
            userName:doc.userName
          }
        })
      }
    }
  })
});


//登出
router.post('/logout',(req,res,next)=>{
  //清除Cookie
  res.cookie('userId','',{
    path:'/',
    maxAge:-1
  })
  res.json({
    status:'0',
    msg:'',
    result:''
  })
});

module.exports = router;
