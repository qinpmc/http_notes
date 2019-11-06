# HTTP


cache-control-demo:

1. 运行服务端：node server.js
2. 浏览器运行：http://localhost:8888

server.js中

```
... 
    } else if(req.url === "/responseScript.js"){
        const jsFile = fs.readFileSync("responseScript.js","utf-8");
        res.writeHead(200,{
            "Content-Type":"text/javascript",
            "Cache-Control":"max-age=10"
        })
        res.end(jsFile);
... 
```

浏览器请求过一次后，再次请求，在 浏览器network中可以看到 size 中是 from cache；


cache-control-demo2:

1. 运行服务端：node server.js
2. 浏览器运行：http://localhost:8888

```
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

```
浏览器请求过一次后，再次请求，在 浏览器network中可以看到请求头中带有：


```
If-Modified-Since: Fri, 1 Nov 2019 07:28:00 GMT
If-None-Match: 777
```
Etag(响应头) ------- If-None-Match（请求头）
Last-Modified(响应头) ------- If-Modified-Since（请求头）



