const http = require("http");
const fs = require("fs");
 
const wait = (seconds) =>{
    return new Promise((resolve,reject) =>{
        setTimeout(() =>{
            resolve();
        },seconds * 1000);
    })
}

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
    
    if(req.url === "/data"){
 
        res.writeHead(200,{
            "Cache-Control":"s-maxage=20",
            "Vary":"X-Test-Cache"
            // max-age :浏览器缓存时间
            // s-maxage :代理缓存时间
            // Vary:只有请求头匹配才返回缓存
 
        })

        wait(2).then(() =>{
            res.end("success")
        })
    }

}).listen(8888,function(){
    console.log("Server listening on 8888")
})