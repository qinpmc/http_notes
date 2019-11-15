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


demo3-cookie:
 
node.js服务端设置cookie :

```


if(host === "a.test.com:8888"){
            
            res.writeHead(200,{
                "Content-Type":"text/html",
                "Set-Cookie":["id=007; max-age=10","age=12; domain=test.com"]  //下方请求responseScript.js 时，就会带上cookie（注意：domain 是 test.com）
            })
           
        }
...
		
res.writeHead(200,{
            "Content-Type":"text/javascript",
            //"Set-Cookie":"id=123"   //设置单个cookie
            //"Set-Cookie":["id=123","name=qq"] // node.js设置多个cookie，没有设置时间，关闭浏览器，cookie清除
            "Set-Cookie":["index=123; max-age=10","name=qq; HttpOnly"] // id=123 这个cookie有效时间10秒； name=qq cookie 只能http访问，document.cookie无法访问--js无法访问
        })

```

cookie 的几个参数：
- max-age=<non-zero-digit> ：存活时间，s
- domain=<domain-value> : 指定 cookie 可以送达的主机名
- Secure ：一个带有安全属性的 cookie 只有在请求使用SSL和HTTPS协议的时候才会被发送到服务器。
- HttpOnly:只能http访问，设置了 HttpOnly 属性的 cookie 不能使用 JavaScript 经由  Document.cookie 属性、XMLHttpRequest 和  Request APIs 进行访问，以防范跨站脚本攻击（XSS）
- Path=<path-value> ：指定一个 URL 路径，这个路径必须出现在要请求的资源的路径中才可以发送 Cookie 首部。


demo4-长链接:

链接建立耗费时间，因此使用长链接，请求头中：
Connection: keep-alive

```
html 中使用7个图片

    <img src="./road1.jpg" alt="">
    <img src="./road2.jpg" alt="">
    <img src="./road3.jpg" alt="">
    <img src="./road4.jpg" alt="">
    <img src="./road5.jpg" alt="">
    <img src="./road6.jpg" alt="">
    <img src="./road7.jpg" alt="">

```
chrome浏览器最多使用6个链接，因此创建7个图片（每个图片的地址不同，保证不复用链接）；chrome浏览器network中将 online 改为 Fast 3G，打开Connection ID    
可以看到链接的id号    






