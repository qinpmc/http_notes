const http = require("http");
const fs = require("fs");

http.createServer(function (req, res) {
    console.log("request come", req.url);
    const html = fs.readFileSync("response.html","utf-8");
    if(req.url === "/"){
        res.writeHead(200, {
            "Content-Type": "text/html",
            "Content-Security-Policy":"default-src http: https:"  //只能通过http 或者https 加载，script标签内的js不允许执行
            //控制台错误： Refused to execute inline script because it violates the following Content Security Policy directive: "default-src http: https:".
        })
        res.end(html);
    }else{
        res.writeHead(200, {
            "Content-Type": "text/javascript"
        })
        res.end("console.log('js from server')");  //可以执行
    }
  
}).listen(8888, function () {
    console.log("Server listening on 8888")
})