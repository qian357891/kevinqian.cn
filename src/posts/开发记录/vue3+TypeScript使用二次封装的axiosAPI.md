---
date: 2022-11-25
category:
  - 前端
tag:
  - TypeScript
  - vue
archive: true
---

> axios作为我们使用vue时进行前后端交互常用的库，我们应该对其进行封装来便于我们使用，以及对其进行一些配置。
>
> 下面这篇文章将会对axios进行一些简单的二次封装，并且介绍如何结合TypeScript一起使用。



### 二次封装axios

我们创建一个axios文件夹，index.ts文件来创建一个axios实例，api.ts文件来对axios实例进行简单的封装。

```
|-- src
        |-- axios
             |-- api.ts
             |-- index.ts
```



#### 创建一个axios实例

index.ts

```ts
import axios from "axios";

// 创建实例
const axiosInstance = axios.create({
  baseURL: "http://xxx.xx:xxxx",
});

// 添加请求拦截器
const interceptor = axiosInstance.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    config.headers!["Authorization"] =
      "Bearer " + localStorage.getItem("token");
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axiosInstance.interceptors.response.use(
  (response) => {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response;
  },
  (error) => {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

export { axiosInstance };
```



#### 基于axios实例进行简单的封装

然后我们通过创建的axios实例来简单的封装几个api

api.ts

```ts
import { axiosInstance } from ".";

const axiosGet = (url: string) => {
  return axiosInstance({
    method: "get",
    url,
  });
};

const axiosPost = (url: string, data: any) => {
  return axiosInstance({
    method: "post",
    url,
    data,
  });
};

const axiosPatch = (url: string, data: any) => {
  return axiosInstance({
    method: "patch",
    url,
    data,
  });
};

const axiosDelete = (url: string) => {
  return axiosInstance({ method: "delete", url });
};

export { axiosGet, axiosPost, axiosPatch, axiosDelete };
```



#### 使用这些api的一个例子

api的使用：

```ts
import { axiosGet, axiosDelete } from "../../axios/api";
const res = await axiosGet(`api/comment/${articleId}`);
```



我们在上面对api的使用中，在顶层使用了`await`关键字。如果直接在vue中这样使用将会报错。因为在编译后的`script`标签没有`async`属性。

所以在这里我们使用了vue3的一个内置组件`<Suspense>`：

app.vue

```vue
<div class="col-span-4 min-h-screen">
    <!-- 主要内容区 -->
    <Suspense><RouterView></RouterView></Suspense>
    <!--  -->
</div>
```



### 与TypeScript结合

当我们使用axios传递的数据时，我们肯定也需要知道数据的类型，但我们不需要手写类型。

可以使用vscode中的插件：`JSON TO TS`：

![image-20221125212326034](https://qiankun825.oss-cn-hangzhou.aliyuncs.com/img/image-20221125212326034.png)



在此之前我们需要先拿到一个json数据，数据可以在浏览器中使用log打印，但是建议后端使用像`Swagger UI`这样的库来生成一个Api接口文档。

我们新建一个文件来放我们的interface，因为这样我们在使用的时候能够得到更好的代码补全，复制数据后在文件中使用`ctrl+shift+alt+v`来自动生成相应的interface，并且将其export出去：

Interface.ts：

```ts
interface Article { //默认生成RootObject，我们将其改为Article
  id: number;
  title: string;
  content: string;
  url: string;
  pic: string;
  price: number;
  prePrice: number;
  createTime: string;
  updateTime: string;
  examine: number;
  upVote: number;
  downVote: number;
  user: User;
  tags: Tag[];
}

interface Tag {
  id: number;
  tagname: string;
  categoryId: number;
}

interface User {
  id: string;
  username: string;
  password: string;
  phone: string;
  email: string;
  avatar: string;
  role: string;
  brand: string;
  money: number;
}

export type { User, Tag, Article };
```



下面我们在实际应用中对封装的axiosGet函数和我们对应数据的interface进行结合使用：

```vue
<script setup lang="ts">
//...
type ArticleContent = Omit<
  Article,
  "id" | "updateTime" | "downVote" | "upVote"
>;

const articleContent:ArticleContent = reactive({
  createTime: "",
  examine: 0,
  pic: "",
  prePrice: 0,
  price: 0,
  tags: [] as Tag[],
  title: "",
  url: "",
  user: {} as User,
  content: "",
});
onMounted(async () => {
  axiosGet(`api/article/${articleId}`).then((res: any) => {
    Object.assign(articleContent, res.data as ArticleContent)
  //...
});
//...
</script>

<template>
	<!-- -->
	<span>发布于：{{ articleContent.createTime }}</span>
    <!-- -->
</template>
```



这时，当我们使用这个对象的属性或者方法时，便能够得到完整的提示：

![image-20221125230404552](https://qiankun825.oss-cn-hangzhou.aliyuncs.com/img/image-20221125230404552.png)