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

        const etag = req.headers["if-none-match"];
        if(etag==="777"){
             
            res.writeHead(304,{
                "Content-Type":"text/javascript",
                "Cache-Control":"max-age=200000,no-cache",
                "Etag":"777",
                "Last-Modified":"Fri, 1 Nov 2019 07:28:00 GMT"
            })
            res.end(""); //不返回内容
        }else{
            const jsFile = fs.readFileSync("responseScript.js","utf-8");
            res.writeHead(200,{
                "Content-Type":"text/javascript",
                "Cache-Control":"max-age=200000,no-cache",
                "Etag":"777",
                "Last-Modified":"Fri, 1 Nov 2019 07:28:00 GMT"
            })
            res.end(jsFile);
        }
        
    }
    
}).listen(8888,function(){
    console.log("Server listening on 8888")
})