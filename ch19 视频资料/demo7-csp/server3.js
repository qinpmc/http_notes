const http = require("http");
const fs = require("fs");

http.createServer(function (req, res) {
    console.log("request come", req.url);
    const html = fs.readFileSync("response3.html","utf-8");
    if(req.url === "/"){
        res.writeHead(200, {
            "Content-Type": "text/html",
            "Content-Security-Policy":"default-src 'self'; form-action 'self'"  //只能访问本域名下资源 只能将表单提交到本域名
            // Refused to send form data to 'http://www.baidu.com/' because it violates the following Content Security Policy directive: "form-action 'self'".
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