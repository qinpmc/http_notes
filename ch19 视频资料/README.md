# HTTP


## cache-control-demo:

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


## cache-control-demo2:

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


## demo3-cookie:
 
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


## demo4-长链接:

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






## demo5-数据协商

1. 请求头    
Accept

Accept-Encoding

Accept-Language

User-Agent

2. 响应头

Content-Type       ----对应Accept

Content-Encoding   ----对应Accept-Encoding

Accept-Language    ----对应Accept-Language

常见请求头：
```

Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3
Accept-Encoding: gzip, deflate, br
Accept-Language: zh-CN,zh;q=0.9
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36

```

压缩文件返回（server1.js）：可以减小文件的体积
```
const zlib = require("zlib");

...
 res.writeHead(200,{
            "Content-Type":"text/html",
            "Content-Encoding":"gzip"
        })
 
 res.end(zlib.gzipSync(html));
```



response2.html
表单默认的提交方式：enctype="application/x-www-form-urlencoded"

```
    <form action="/form" enctype="application/x-www-form-urlencoded" method="POST">
        <input type="text" name="name">
        <input type="password" name=pwd>
        <input type="submit">
    </form>

```

application/x-www-form-urlencoded 时控制台的效果如下：

```
Form Data
name=qq&pwd=11
```


response2.html
表单的提交方式：enctype="multipart/form-data"

```

    <form action="/form" enctype="multipart/form-data" method="POST">
        <input type="text" name="name">
        <input type="password" name=pwd>
        <input type="file" name="file1">
        <input type="file" name="file2">
        <input type="submit">
    </form>
```

当 enctype= "application/x-www-form-urlencoded" 时控制台的效果如下：
**注意，此时提交的内容file为空，如果有file，chrome浏览器 network看不到 form data**


```
Form Data
------WebKitFormBoundaryScX1kYiDb8iHK27l
Content-Disposition: form-data; name="name"

qq
------WebKitFormBoundaryScX1kYiDb8iHK27l
Content-Disposition: form-data; name="pwd"

11
------WebKitFormBoundaryScX1kYiDb8iHK27l
Content-Disposition: form-data; name="file1"; filename=""
Content-Type: application/octet-stream


------WebKitFormBoundaryScX1kYiDb8iHK27l
Content-Disposition: form-data; name="file2"; filename=""
Content-Type: application/octet-stream


------WebKitFormBoundaryScX1kYiDb8iHK27l--


```

采用 ajax请求，提交表单，可以在chrome 的network中看到 form data 的数据：

```
      var form = document.getElementById("form1");
        form.addEventListener("submit",function(e){
            e.preventDefault();
            var formData = new FormData(form);
            fetch("/from",{
                method:"POST",
                body:formData
            })
        })




```
  
## demo6-redirect
使用 重定向 redirect ，302 代表暂时性转移(Temporarily Moved )
如果使用301，表示永久代表永久性转移 ，此时浏览器如果不清除缓存，浏览器不会访问原来的地址，会直接请求新地址（可以从 node服务的控制台查看 request come /new ,不会有request come /）
此时，即使服务端发生改变，比如修改不跳转（比如下例中 请求路径为 "/" ，不发生跳转），浏览器仍会请求 "/new" 地址


```

if (req.url === "/") {
        
        res.writeHead(302, {  //302 临时跳转  ,如果改为200，不会跳转
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

```