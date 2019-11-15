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

    }else{
        const img = fs.readFileSync("road1.jpg");
        res.writeHead(200,{
            "Content-Type":"image/jpg"
        })
 
        res.end(img);
    }
    
}).listen(8888,function(){
    console.log("Server listening on 8888")
})