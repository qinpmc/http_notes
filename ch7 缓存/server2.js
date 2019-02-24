var http = require('http')
var fs = require('fs')
var path = require('path')
var url = require('url')

// 缓存验证  etag   if-none-match
http.createServer(function(req, res){
    const etag = req.headers["if-none-match"];
    if(req.url === "/"){
        fs.readFile("test2.html","utf-8",function(err,data){
            res.writeHead(200,{
                "Content-Type":"text/html"
            });
            res.end(data);
        })
    }
    if(req.url === "/script.js"){
        const etag = req.headers["if-none-match"];
        console.log(etag);
        if(etag==="etag777"){
            res.writeHead(304,{
                "Content-Type":"text/javascript",
                "Cache-Control": "max-age=200,no-cache",
                "Last-Modified":"123",
                "Etag":"etag777"
            });
            res.end();

        }else{
            res.writeHead(200,{
                "Content-Type":"text/javascript",
                "Cache-Control": "max-age=200,no-cache",
                "Last-Modified":"123",
                "Etag":"etag777"
            });
            res.end("console.log('js script loaded...')")
        }
    }
}).listen(8888)