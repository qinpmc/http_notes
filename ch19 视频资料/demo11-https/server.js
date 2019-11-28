const http = require("http");
const fs = require("fs");

http.createServer(function(req,res){
    console.log("request come",req.url);
    if(req.url === "/"){
        const html = fs.readFileSync("response.html","utf-8");
        res.writeHead(200,{
            "Content-Type":"text/html"
        })
        res.end(html);
    } else if(req.url === "/responseScript.js"){
        const jsFile = fs.readFileSync("responseScript.js","utf-8");
        res.writeHead(200,{
            "Content-Type":"text/javascript"
        })
        
        res.end(jsFile);
    }
    
}).listen(8888,function(){
    console.log("Server listening on 8888")
})