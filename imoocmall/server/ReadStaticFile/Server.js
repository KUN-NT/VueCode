let http = require('http');
let url = require('url');
let util = require('util');
let fs = require('fs');

http.createServer((req, res) => {
    let pathName = url.parse(req.url).pathname;
    console.log(pathName);
    fs.readFile(pathName.substring(1), (err, data) => {
        if (err) {
            res.writeHead(404, {
                'Content-Type': 'text/html'
            });
        } else {
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            res.write(data.toString());
            console.log(data.toString());
        }
        res.end();
    });

}).listen(3001, '127.0.0.1', () => {
    console.log("Server Started.Address:http://127.0.0.1:3001")
})