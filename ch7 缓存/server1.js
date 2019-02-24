var http = require('http')
var fs = require('fs')
var path = require('path')
var url = require('url')

//  缓存 "Cache-Control": "max-age=200"
http.createServer(function(req, res){
    if(req.url === "/"){
        fs.readFile("test1.html","utf-8",function(err,data){
            res.writeHead(200,{
                "Content-Type":"text/html"
            });
            res.end(data);
        })
    }
    if(req.url === "/script.js"){
        res.writeHead(200,{
            "Content-Type":"text/javascript",
            "Cache-Control": "max-age=200"
        })
        res.end("console.log('js script loaded...')")
    }

}).listen(8888)