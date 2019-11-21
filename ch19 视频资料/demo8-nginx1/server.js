const http = require("http");
const fs = require("fs");
 


//  
http.createServer(function(req,res){
    console.log("request come",req.url);
    console.log("request host ",req.headers.host);
    if(req.url === "/"){
        const html = fs.readFileSync("response.html","utf-8");
        res.writeHead(200,{
            "Content-Type":"text/html",
        })
 
         
        res.end(html);

    }
    
}).listen(8888,function(){
    console.log("Server listening on 8888")
})