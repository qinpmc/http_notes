const http = require("http");
const fs = require("fs");

http.createServer(function (req, res) {
    console.log("request come", req.url);
    const html = fs.readFileSync("response4.html","utf-8");
    if(req.url === "/"){
        res.writeHead(200, {
            "Content-Type": "text/html",
            "Content-Security-Policy":"script-src 'self'; form-action 'self'; report-uri /report"  
            //只能访问本域名下js资源(**图片等可访问其他域名下资源**)  只能将表单提交到本域名  报告信息
            //  报告信息：检查浏览器network下：有report请求-post请求，内容如下

            // csp-report: {document-uri: "http://localhost:8888/", referrer: "", violated-directive: "script-src-elem",…}
            // blocked-uri: "https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js"
            // disposition: "enforce"
            // document-uri: "http://localhost:8888/"
            // effective-directive: "script-src-elem"
            // original-policy: "script-src 'self'; form-action 'self'; report-uri /report"
            // referrer: ""
            // script-sample: ""
            // status-code: 200
            // violated-directive: "script-src-elem"


            // 只报告，但允许加载-----inline的js 会执行， jquery会请求回来（没有才取仅仅报告时，该请求会被block）
            //"Content-Security-Policy-Report-Only":"script-src 'self'; form-action 'self'; report-uri /report"  

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