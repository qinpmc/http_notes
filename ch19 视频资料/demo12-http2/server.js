const http = require("http");
const fs = require("fs");

http.createServer(function(req,res){
    console.log("request come",req.url);
    const html = fs.readFileSync("response.html","utf-8");
    const img = fs.readFileSync("test.jpg");
    if(req.url === "/"){
       
        res.writeHead(200,{
            "Content-Type":"text/html",
            "Connection":"close",
            "Link":"</test.jpg>; as=image; rel=preloadd"  // 服务器推送本地test.jpg
        })
        res.end(html);
    } else {
        
        res.writeHead(200,{
            "Content-Type":"image/jpg",
            "Connection":"close"
        })
        
        res.end(img);
    }
    
}).listen(8888,function(){
    console.log("Server listening on 8888")
})