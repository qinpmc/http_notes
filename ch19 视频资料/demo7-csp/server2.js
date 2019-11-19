const http = require("http");
const fs = require("fs");

http.createServer(function (req, res) {
    console.log("request come", req.url);
    const html = fs.readFileSync("response.html","utf-8");
    if(req.url === "/"){
        res.writeHead(200, {
            "Content-Type": "text/html",
            "Content-Security-Policy":"default-src 'self'"  //只能访问本域名下资源 
            //Refused to load the script 'https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js' because it violates the following Content Security Policy directive: 
            // "default-src  'self'".

            "Content-Security-Policy":"default-src 'self' https://cdn.bootcss.com"  //只能访问本域名下资源 和 https://cdn.bootcss.com 下资源
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