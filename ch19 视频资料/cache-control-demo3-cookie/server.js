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
            "Content-Type":"text/javascript",
            //"Set-Cookie":"id=123"
            //"Set-Cookie":["id=123","name=qq"] // 设置多个cookie，没有设置时间，关闭浏览器，cookie清除
            "Set-Cookie":["id=123; max-age=10","name=qq; HttpOnly"] // id=123 这个cookie有效时间10秒； name=qq cookie 只能http访问，document.cookie无法访问--js无法访问
        })
        res.end(jsFile);
    }
    
}).listen(8888,function(){
    console.log("Server listening on 8888")
})