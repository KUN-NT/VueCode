let user=require('./User');
console.log(`userName:${user.userName}`);

let http=require('http');
let url=require('url');
let util=require('util');

let server=http.createServer((req,res)=>{
    res.statusCode=200;
    res.setHeader("Content-Type","text/plain;charset=utf-8");

    let path=url.parse(req.url)
    let reqContent=util.inspect(path);

    console.log(req.url)
    console.log(path)

    res.end(reqContent);
})

server.listen(3000,'127.0.0.1',()=>{
    console.log("Server Started.Address:http://127.0.0.1:3000")
})