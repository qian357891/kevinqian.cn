---
date: 2022-11-26
category:
  - 前端
tag:
  - TypeScript
  - vue
archive: true
---

# pinia+axios+vue3实现路由守卫

### 为什么需要路由守卫

在实际开发中，我们会遇到这样一个常见的需求：某些页面只允许登录后查看，如果未登录，则跳转到登录页面。或许是有些页面有权限的需求。

而这时，我们就需要使用到路由守卫。

> 在本篇文章中，我们使用pinia作为我们的状态管理库，路由使用vue-router4，vue版本为3.2。



### 状态管理文件

在store文件中我们应该注意以下的几个操作：

- 在`state`中声明属性的默认值
- 在`actions`中声明我们store的方法，在`authToken`方法中我们、调用了封装的`axiosGet`函数，这个函数用来调用axios的get方法（本篇文章使用的函数可以在这里找到：[vue3+TypeScript使用二次封装的axiosAPI - 掘金 (juejin.cn)](https://juejin.cn/post/7169978360037113892)）。
- 在`axiosGet`的then方法中我们改变属性的值。

文件位置：
```
|-- src

	|-- store

 	     |-- index.ts

```

index.ts
```ts
import { defineStore } from "pinia";
import { axiosGet } from "../axios/api";
import { User } from "../Interface/Interface";

export const useStore = defineStore("main", {
  state: () => {
    return {
      ifPassAuth: false,
      userData: {} as User,
    };
  },
  actions: {
    // 验证Token，返回userData
    async authToken() {
      await axiosGet("api/users")
        .then((res) => {
          this.userData = res.data;
          this.ifPassAuth = true;
        })
    },
    // ...
  },
});
```

在我们声明的store中，我们有一个验证是否登录的函数`authToken`，。



### 路由文件

关于路由守卫，在router文件中我们应该注意以下的几个操作：

- 在路由对象中声明meta属性的值，meta属性是一个对象，它的作用是**我们能通过meta对象中的一些属性来判断当前路由是否需要进一步处理**。
- 我们通过`router.beforeEach`方法来实现路由守卫，它的参数是一个回调函数。这个回调函数的参数为`to,from,next`，分别为要跳转的路由对象，跳转前的原路由对象，next跳转函数。
- 我们通过if-else来判断`to.meta`是否有我们想要判断的属性，`next()`为跳转原目标路由，可以传参，类似于`router.push`方法。

```
|-- src

	|-- router

 	     |-- index.ts
```

index.ts
```ts
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { useStore } from "../store";

const routes: Array<RouteRecordRaw> = [
//...
  {
    name: "Index",
    path: "/",
    component: () => import(`@comps/Index/Index.vue`),
  },
  // 添加文章
  {
    name: "AddArticle",
    path: "/addarticle",
    component: () => import(`../components/xxxxx/xxxxxxx.vue`),
    meta: {
      isLogin: true,
    },
  },
  // 所有评论
  {
    name: "AllComment",
    path: "/article/content/:articleId/all-comment",
    component: () => import(`../components/xxx/xxxx.vue`),
    meta: {
      isLogin: true,
    },
  },
  // 管理员页面
  {
    name: "Admin",
    path: "/xxx/xxxxxx",
    component: () => import(`../components/xxx/xxxx.vue`),
    meta: {
      isAdmin: true,
    },
  },
  //...
];

const router = createRouter({
  linkActiveClass: "routerLinkActive",
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  // next();
  if (to.meta.isAdmin) {
    if (useStore().userData.role === "root") {
      next();
    } else {
      next({ name: "Index" });
    }
  } else if (to.meta.isLogin) {
    if (useStore().ifPassAuth) {
      next();
      // console.log(useStore().ifPassAuth);
    } else {
      next({ name: "Login" });
    }
  } else {
    next();
  }
});

router.afterEach((to, from, next) => {
  // 跳转后滚动条在顶部
  window.scrollTo(0, 0);
});

export default router;
```



### 主函数文件

由于我们需要在`router`主函数执行前执行我们的`authToken`方法，所以我们可以封装一个`beforeAppMount`函数，来执行根组件挂载前的需要执行的函数。

我们可以看到，`store.authToken();`比`app.use(router)`先执行，所以我们的router中拿到的`userData`和`ifPassAuth`是验证后的值。

main.ts

```ts
import { createApp } from "vue";
import "./index.css";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import { useStore } from "./store";
//...

const app = createApp(App);
//...

const beforeAppMount = async () => {
  app.use(createPinia());
  const store = useStore();
  await store.authToken();
};

beforeAppMount().then(() => {
  app.use(router).mount("#app");
});
```



以上就是使用pinia+vue3+axios+vue-router实现一个简单的路由守卫的主要内容。