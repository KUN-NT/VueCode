// 1、加载插件
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// var ejs=require('ejs');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var goodsRouter = require('./routes/goods');

// 2、实例化express对象
var app = express();

// 3、设置视图模板引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// 使用html
// app.engine('.html',ejs.__express);
// app.set('view engine', 'html');

// 4、设置中间件
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//登录拦截
app.use((req,res,next)=>{
  if(req.cookies.userId){
    next();
  }else{
    //请求以下路由不予拦截
    if(req.originalUrl=='/users/login'
      ||req.originalUrl=='/users/loginout'
      //||req.originalUrl.indexOf('/goods/list')>-1
      ||req.path=='/goods/list'){
        next();
      }else{
        res.json({
          status:'10001',
          msg:'请先登录',
          result:''
        })
      }
  }
})

//设置路由
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/goods', goodsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
