# URL与资源

![URL](URL.png)

上图为node.js给出的url组成，图中url 上方的是遗留的 url.parse() 返回的对象的属性，下方的则是 WHATWG标准 的 URL 对象的属性。


## 1 URL语法

URL语法建立在由下面9部分构成的通用格式上。其中，URL最重要的3个部分是方案(scheme)、主机(host)和路径(path)

```
<scheme>://<user>:<password>@<host>:<port>/<path>:<params>?<query>#<frag>
```

![通用URL](通用URL.png)

## 1.1 方案
方案实际上是规定如何访问指定资源的主要标识符，它会告诉负责解析URL的应用程序应该使用什么协议。
常见的方案：
- HTTP：HTTP是一种超文本传输协议方案
- https：与方案http是一对。唯一的区别在于方案https使用了网景的SSL， SSL为HTTP连接提供了端到端的加密机制。其语法与HTTP的语法相同，默认端口为443。
- Mailto： Mailto URL指向的是E-mail地址。如：mailto:joe@hardware.com
- ftp：文件传输协议URL可以用来从FTP服务器上下载或向其上传文件，并获取FTP服务器上的目录结构内容的列表，如ftp://anonymous:joe%40hardware.com@prep.ai.mit.edu:21/pub/gnu/
- rtsp,rtspu：RTSP URL是可以通过实时流传输协议(Real Time Streaming Protocol)解析的音/视频媒体资源的标识符，如rtsp://www.hardware.com:554/interview/cto_video。
- file：方案file表示一台指定主机(通过本地磁盘、网络文件系统或其他一些文件共享系统)上可直接访问的文件。如file://OFFICE-FS/policies/casual-fridays.doc
- telnet：是TCP/IP协议族中的一员，是Internet远程登录服务的标准协议和主要方式，如telnet://slurp:webhound@joes-hardware.com:23/

## 1.2 主机和端口

URL的主机和端口组件提供了哪台机器及机器上的位置两组信息。
主机组件标识了因特网上能够访问资源的宿主机器。可以用上述主机名(www.hardware.com)或者IP地址来表示主机名

## 1.3 用户名和密码
很多服务器都要求输入用户名和密码才会允许用户访问数据。FTP服务器就是这样一个常见的实例.

## 1.4 路径
URL的路径组件说明了资源位于服务器的什么地方.

示例：http://www.hardware.com:80/seasonal/index-fall.html ，
这个URL中的路径为/seasonal/index-fall.html，很像UNIX文件系统中的文件系统路径。路径是服务器定位资源时所需的信息。
可以用字符“/”将HTTP URL的路径组件划分成一些路径段(path segment)，每个路径段都有自己的参数(param)组件。

## 1.5 参数

对很多方案来说，只有简单的主机名和到达对象的路径是不够的，为了向应用程序提供它们所需的输入参数，以便正确地与服务器进行交互，URL中有一个参数组件。
这个组件就是URL中的名值对列表，**由字符“;”将其与URL的其余部分(以及各名值对)分隔**开来。它们为应用程序提供了访问资源所需的所有附加信息。
ftp://prep.ai.mit.edu/pub/gnu;type=d，参数type=d，参数名为type，值为d。
http://www.hardware.com/hammers;sale=false/index.html;graphics=true，
这个例子就有**两个路径段**，hammers和index.html。hammers路径段有参数sale，其值为false。index.html段有参数graphics，其值为true

## 1.6 查询字符串
很多资源，比如数据库服务，都是可以通过提问题或进行査询来缩小所请求资源类型范围的.
问号(?)右边的内容被称为查询(query)组件，査询字符串以一系列“名/值”对的形式出现，名值对之间用字符“&”分隔。

http://www.hardware.com/inventory-check.cgi?item=12731&color=blue&size=large

## 1.7 片段

有些资源类型，比如HTML，除了资源级之外，还可以做进一步的划分。比如，对一个带有章节的大型文本文档来说，资源的URL会指向整个文本文档.
URL支持使用片段(frag)组件来表示一个资源内部的片段。比如，URL可以指向HTML文档中一个特定的图片或小节。
片段挂在URL的右手边，最前面有一个字符“#”。比如：
http://www.hardware.com/tools.html#drills

## 2 URL快捷方式
URL包含 绝对的和相对的URL。
相对的URL必须相对另一个，称为基础（base)URL。

基础（base)URL：
- 在资源中显示提供：比如html文档中定义<BASE>标记，它用于转换HTML文档中所有的相对URL。
- 封装资源的基础URL：如果没有显示指定，可以将它所属资源的URL作为基础。
比如，http://www.joes-hardware.com/tools.html中有个链接：<a href="./hammers,html">,则base url为http://www.joes-hardware.com。
- 没有基础URL：某些情况下没有基础URL，意味着有一个相对URL，又是可能是不完整或损坏的URL。

## 3 URL 字符

URL的设计者们认识到有时人们可能会希望URL中包含除通用的安全字母表之外的二进制数据或字符。因此，需要有一种转义机制，能够将不安全的字符编码为安全字符，再进行传输。
人们设计了一种编码机制，用来在URL中表示各种不安全的字符。这种编码机制就是通过一种“转义”表示法来表示不安全字符的，这种转义表示法包含一个百分号(%)，后面跟着两个表示字符ASCII码的十六进制数。

![转义](转义.jpg)

### 3。1 编码方法

1. encodeURI：不会对下列字符编码  ASCII字母、数字、~!@#$&*()=:/,;?+'
2. encodeURIComponent：不会对下列字符编码 ASCII字母、数字、~!*()'
3. escape：是对字符串(string)进行编码(而另外两种是对URL)，作用是让它们在所有电脑上可读。编码之后的效果是%XX或者%uXXXX这种形式。
其中 ASCII字母、数字、@*/+ ，这几个字符不会被编码，其余的都会。

- escape：是对字符串(string)进行编码，当你需要对URL编码时，请忘记这个方法，这个方法是针对字符串使用的，不适用于URL。
- encodeURI：对URL编码,
 encodeURI("http://www.cnblogs.com/season-huang/some other thing")结果： "http://www.cnblogs.com/season-huang/some%20other%20thing";
- encodeURIComponent:对URL编码,比encodeURI编码的范围更大.
encodeURIComponent("http://www.cnblogs.com/season-huang/some other thing")结果："http%3A%2F%2Fwww.cnblogs.com%2Fseason-huang%2Fsome%20other%20thing"。
连 "/" 都被编码。
当需要编码URL中的参数的时候，那么encodeURIComponent是最好方法：

```
var param = "http://www.cnblogs.com/season-huang/"; //param为参数
param = encodeURIComponent(param);
var url = "http://www.cnblogs.com?next=" + param;
console.log(url) //"http://www.cnblogs.com?next=http%3A%2F%2Fwww.cnblogs.com%2Fseason-huang%2F"
// 参数中的 "/" 可以编码，如果用encodeURI肯定要出问题，因为后面的/是需要编码的
```






