# 我选择白嫖！使用vercel快速部署vuepress-next项目

> 本篇文章将使用vercel部署一个vuepress-next demo项目，关于如何快速搭建一个vuepress-next项目，可以参考这篇文章：[😮零成本也能快速开发个人博客？vuepress快速入门！ - 掘金 (juejin.cn)](https://juejin.cn/post/7168498967255187470)

### 什么是vercel？

vercel是一个免费的网站托管服务平台，虽然是一个外国的平台，但是 Vercel CDN 有香港节点。当你使用你自己的域名时，访问速度还是挺快的。如果你需要发布的站点是一个静态站点，那么你只需要像vercel这样的托管平台就能简单的对项目进行部署。



### 为什么选择vercel？

同样可以进行网站托管服务的平台有github page，nestify。但是vercel相对于它们更快，而且部署和发布也非常简单快速。如果你发布了一个项目，你只需要在git中push后，vercel就会自动进行更新。



### 开始部署

#### 在github中新建项目

我们先在github中新建一个项目：

![image-20221122130730099](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/77f6e1f7c9ae4e72884ca2eb01c1924b~tplv-k3u1fbpfcp-zoom-1.image)

然后我们在本地打开我们的项目，将pull拉取一下我们在github上新建的项目中`code`下的ssh key：

![image-20221122131104091](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cd5faea948c84076bc76726b08839cd7~tplv-k3u1fbpfcp-zoom-1.image)



然后我们将本地的代码进行push：

```sh
git add .
git commit -m demo
git push git@github.com:qian357891/vuepress-demo.git //ssh key
```

我们的项目现在就push到了github上

![image-20221122131438715](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/61567e086dbd420d94392599cc5891bb~tplv-k3u1fbpfcp-zoom-1.image)



#### 登录vercel并链接github仓库

[Login – Vercel](https://vercel.com/login?next=)

推荐使用github登录，登录后点击`add new`，然后点击`project`，我们开始导入git储存库，依然是选择github。

![image-20221122160935667](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e5af27ab457d4737bd04fa6358a15f6f~tplv-k3u1fbpfcp-zoom-1.image)



然后我们选择我们要部署的库vuepress-demo

![image-20221122161129310](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5da7014d53cf45a7949bfb1c10b9a31f~tplv-k3u1fbpfcp-zoom-1.image)



完成操作后点击`save`，我们回到刚才的页面。可以看到`vuepress-demo`出现到了我们的导入列表中：

![image-20221122161456477](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8677076c959144099e11892f70c88913~tplv-k3u1fbpfcp-zoom-1.image)



我们点击import，在出现的界面中进行如下的配置：（我们需要填入打包的指令和下载包的指令）。完成后点击**deploy**

![image-20221122172539850](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5b4efb2807564c7585f63035b9fc8133~tplv-k3u1fbpfcp-zoom-1.image)



随后，我们就完成了部署

![image-20221122175743341](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/98a43296e0234195809ed01a03402167~tplv-k3u1fbpfcp-zoom-1.image)



你可以通过vercel分配的网址打开，也可以使用自己的域名。

如果要使用自己的域名，你应该这样做：

- 在搜索栏中输入你的网址，并且`add`

![image-20221122175909198](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5a34c725e1c84e26988bb4b75f89b2f5~tplv-k3u1fbpfcp-zoom-1.image)

- 打开你的网址运营商的`添加解析`，将value的值输入。

![image-20221122181012385](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dd053b03700742e391b187c0b28a6aa1~tplv-k3u1fbpfcp-zoom-1.image)



- 回到vercel的域的设置，可以看到已经生效了

![image-20221122180907899](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8afb91b46f9e413b8ab073649c933bc4~tplv-k3u1fbpfcp-zoom-1.image)

整个部署就结束了，当你使用git push进行项目更新时，vercel也能够自动的进行更新。是不是很方便呢？