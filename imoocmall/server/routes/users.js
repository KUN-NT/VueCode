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

module.exports = router;
