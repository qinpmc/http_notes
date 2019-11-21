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



## demo7-csp

csp:content-security-policy 内容安全策略
1. 作用
 - 限制资源获取
 - 报告资源获取越权

2. 限制方式
- default-src 限制全局
- 制定资源类型（connect-src img-src font-src media-src frame-src style-src script-src manifest-src）


几种cp的设置：

```
 res.writeHead(200, {
            "Content-Type": "text/html",
            "Content-Security-Policy":"default-src http: https:"  //只能通过http 或者https 加载，script标签内的js不允许执行
            //控制台错误： Refused to execute inline script because it violates the following Content Security Policy directive: "default-src http: https:".
        })

 
"Content-Security-Policy":"default-src 'self'"  //只能访问本域名下资源 

"Content-Security-Policy":"default-src 'self'; form-action 'self'"  //只能访问本域名下资源 只能将表单提交到本域名

"Content-Security-Policy":"script-src 'self'; form-action 'self'; report-uri /report"  


// 只报告，但允许加载-----inline的js 会执行， jquery会请求回来（没有才取仅仅报告时，该请求会被block）
"Content-Security-Policy-Report-Only":"script-src 'self'; form-action 'self'; report-uri /report"  

```



在html页面也可以设置：

```
<meta http-equiv="Content-Security-Policy" content="connect-src 'self'; form-action 'self'">

 fetch("http://www.baidu.com") 
//(index):18 Refused to connect to 'http://www.baidu.com/' because it violates the following Content Security Policy directive: "connect-src 'self'".
```



## Nginx 

### Nginx 反向代理示例1(demo8-nginx1)

1. nginx.conf 中配置增加（针对不同的项目，可以配置不同的内容）：
 
``` 
include    servers/*.conf; 
 
```         

2. 在conf下建立servers文件夹，servers文件夹建立 test.conf 文件：     


```
    server {
        listen       7777;
        server_name  a.test.com;
 
        location / {
            proxy_pass http://127.0.0.1:8888;
			#proxy_set_header Host $host;
        }
    }

```
 

3.  hosts配置
在 C:\Windows\System32\drivers\etc\hosts 中增加：

```
127.0.0.1       a.test.com
```

4. 浏览器访问  http://a.test.com:7777 


5. proxy_set_header Host $host 说明：

如果不增加，console.log("request host ",req.headers.host); 输出的是nginx 代理后的host：request host  127.0.0.1:8888
增加后，输出的是： request host  a.test.com  



### Nginx 代理缓存(demo9-nginx-cache)

nginx 的配置：

- 1 nginx的nginx.conf 中增加： include    servers/*.conf; 从外部读取额外的配置

```
http {
    
    ... 
    #keepalive_timeout  0;
    keepalive_timeout  65;

    #gzip  on;
	
	include    servers/*.conf;


```
 
- 2 conf 文件夹下增加 servers文件夹，servers文件夹下创建test.conf文件,内容如下：


```
	proxy_cache_path cache levels=1:2 keys_zone=my_cache:10m; # 缓存的目录为 cache（nginx启动后自动创建 cache文件夹-在nginx目录下）， levels=1:2  2级目录   缓存名my_cache，10m大小
	
	server {
        listen       7777;  # 代理到7777 端口
        server_name  a.test.com;   # 服务器名称，需在C:\Windows\System32\drivers\etc\hosts 中增加 127.0.0.1   a.test.com
 
        location / {
			proxy_cache my_cache;
            proxy_pass http://127.0.0.1:8888;  # 实际服务的地址
			#proxy_set_header Host $host;
        }
    }
```


```
    res.writeHead(200,{
        "Cache-Control":"max-age=2,s-maxage=20 ",
        // max-age :浏览器缓存时间
        // s-maxage :代理缓存时间

        // private:只有浏览器才可以缓存数据
        // no-store: 不缓存
    })

    wait(2).then(() =>{
            res.end("success")
    })
```

1. 启动服务：node server.js
2. 在chrome浏览器输入 http://localhost:7777
3. 观察 E:\qinpmc\software\nginx-1.14.2\nginx-1.14.2\cache\3\bd，目录下生成文件：38d3d074277da9185971ec0e45a25bd3
4. 另外打开一个浏览器，如Firefox或者 edge，观察代理缓存的效果（本来需要等待2秒返回结果，在代理缓存存在的时候，刷新页面可以立即看到结果）。如果用同一个浏览器，则由于浏览器的缓存，难以观察效果

```
... 

KEY: http://127.0.0.1:8888/data
HTTP/1.1 200 OK
Cache-Control: max-age=2,s-maxage=20
Date: Thu, 21 Nov 2019 12:45:18 GMT
Connection: close

success
```
4. 可增加 private, 如 "Cache-Control":"max-age=2,s-maxage=20,private",表示只有浏览器缓存，此时代理nginx不作缓存
   可增加 no-store: 均不缓存



### Nginx 代理缓存和 Vary头 (demo9-nginx-cache-vary)

Vary响应头,比如：

```
Vary: Accept-Encoding
Vary: Accept-Encoding,User-Agent

```

Vary中有User-Agent，那么即使相同的请求，如果用户使用IE打开了一个页面，再用Firefox打开这个页面的时候，代理/客户端会认为这是不同的页面，                 
如果Vary中没有User-Agent，那么代理/客户端缓存会认为是相同的页面，直接给用户返回缓存的内容，而不会再去web服务器请求相应的页面。     
如果Vary变量比较多，相应的增加了缓存的容量。



```
//服务端
res.writeHead(200,{
            "Cache-Control":"s-maxage=20",
            "Vary":"X-Test-Cache"  
            // max-age :浏览器缓存时间
            // s-maxage :代理缓存时间
            // Vary:只有请求头匹配才返回缓存
 
        })
```

```
//客户端请求
        var index = 0;
        var dataEle = document.getElementById("data");
        document.getElementById("btn").addEventListener("click", function () {
            dataEle.innerHTML = "";
            fetch("/data", {
                headers: {
                    "X-Test-Cache": index++   // 故意使得每次请求的的X-Test-Cache 不同，造成缓存无法使用
                }

            }).then(function (rep) {
                return rep.text();
            }).then(function (text) {
                dataEle.innerHTML = text;
            })
        })
```



