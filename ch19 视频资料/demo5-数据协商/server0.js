const http = require("http");
const fs = require("fs");


// 一般的服务器返回
http.createServer(function(req,res){
    console.log("request come",req.url);
    if(req.url === "/"){
        const html = fs.readFileSync("response.html","utf-8");
        res.writeHead(200,{
            "Content-Type":"text/html"
        })
 
        res.end(html);

    }
    
}).listen(8888,function(){
    console.log("Server listening on 8888")
})