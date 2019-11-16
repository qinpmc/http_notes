const http = require("http");
const fs = require("fs");
const zlib = require("zlib");


// 压缩文件 返回
http.createServer(function(req,res){
    console.log("request come",req.url);
    if(req.url === "/"){
        const html = fs.readFileSync("response.html","utf-8");
        res.writeHead(200,{
            "Content-Type":"text/html",
            //"Content-Encoding":"gzip"
        })
 
        //res.end(zlib.gzipSync(html));
        res.end(html);

    }
    
}).listen(8888,function(){
    console.log("Server listening on 8888")
})