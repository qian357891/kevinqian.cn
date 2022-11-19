

![2.1.png](https://qiankun825.oss-cn-hangzhou.aliyuncs.com/img/9532783679e2433cb9167d5469579b11~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

### 创建项目

首先通过vite创建一个 Vue+TS项目：

```sql
pnpm create vite@latest electron-demo -- --template vue-ts
```

接着安装 Electron 开发依赖：

```
pnpm install electron -D
```

在安装Electron的时候，可能会安装失败，你可以尝试这个步骤：[解决Electron安装很慢的办法 - 掘金 (juejin.cn)](https://juejin.cn/post/6855526489904349198)

如果package.json里有type:module的配置项，那么你应该把它删掉。



### 创建主进程代码

我们需要写一个Electron入口文件，