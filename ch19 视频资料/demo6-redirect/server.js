const http = require("http");
const fs = require("fs");

http.createServer(function (req, res) {
    console.log("request come", req.url);
    if (req.url === "/") {
        
        res.writeHead(302, {  //302 临时跳转,如果改为200，不会跳转
            "Location": "/new",

        })
        res.end("");
    } else if (req.url === "/new") {
        const html = fs.readFileSync("response.html", "utf-8");
        res.writeHead(200,{
            "Content-Type":"text/html"
        })
        res.end(html);

    }

}).listen(8889, function () {
    console.log("Server listening on 8889")
})