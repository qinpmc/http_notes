const http = require("http");
const fs = require("fs");

http.createServer(function (req, res) {
    console.log("request come", req.url);
    const html = fs.readFileSync("response5.html","utf-8");
    if(req.url === "/"){
        res.writeHead(200, {
            "Content-Type": "text/html"
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