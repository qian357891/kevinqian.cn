### win10家庭版

win10的

[Win10家庭中文版安装Docker Desktop（亲测成功，建议收藏）](https://blog.csdn.net/qq_45590494/article/details/114760564#:~:text=Win10%E5%AE%B6%E5%BA%AD%E4%B8%AD%E6%96%87%E7%89%88%E5%AE%89%E8%A3%85Docker%20Desktop%EF%BC%88%E4%BA%B2%E6%B5%8B%E6%88%90%E5%8A%9F%EF%BC%8C%E5%BB%BA%E8%AE%AE%E6%94%B6%E8%97%8F%EF%BC%89%201%201.%20%E6%B7%BB%E5%8A%A0Hyper-V%20%E6%88%91%E4%BA%86%E8%A7%A3%E5%88%B0%EF%BC%8C%E5%AF%B9%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E6%9C%89%E8%A6%81%E6%B1%82%E6%98%AF%E5%9B%A0%E4%B8%BA%EF%BC%9A%20%E5%8F%AA%E6%9C%89Win10%20%E4%B8%93%E4%B8%9A%E7%89%88%E3%80%81%E4%BC%81%E4%B8%9A%E7%89%88%E6%88%96%E6%95%99%E8%82%B2%E7%89%88%E6%89%8D%E8%87%AA%E5%B8%A6Hyper-V%EF%BC%8C%E8%80%8C%E5%AE%B6%E5%BA%AD%E4%B8%AD%E6%96%87%E7%89%88%E6%B2%A1%E6%9C%89,6%206.%20%E5%90%8E%E7%BB%AD%E5%B7%A5%E4%BD%9C%20...%207%207.%20%E6%B5%8B%E8%AF%95%E4%BD%BF%E7%94%A8%EF%BC%9A%E6%90%AD%E5%BB%BANginx%E6%9C%8D%E5%8A%A1%E5%99%A8%20)



[windows 10 安装docker](https://zhuanlan.zhihu.com/p/397311465)



https://www.cnblogs.com/zhengyuanyuan/p/14412651.html



[【Docker闪退】【解决方法】It looks like there is an error with Docker Desktop, restart it to fix it](https://blog.csdn.net/baidu_30506559/article/details/125838506)



[windows启动Docker失败 An error occurred](https://blog.csdn.net/qq_34033853/article/details/110246866)

win10的docker desktop内置docker-compose和cli等插件

docker-compose.yml 示例：

注意：`-`与内容之间有一个空格

```
version: '3'

services:
  db:
    image: postgres
    restart: always
    ports:
      - "5432:5432"
    environment:
      POSTGRES_PASSWORD: 123456
```

运行：

```
docker-compose up
```

