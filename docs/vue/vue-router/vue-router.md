### index文件配置

```ts
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    name: "Index",
    path: "/",
    component: () => import(`../components/Index/Index.vue`),
  },
  {
    name: "AddArtical",
    path: "/addartical",
    component: () => import(`../components/AddContent/AddArtical.vue`),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
```



### 使用router

在使用router时记得**使用`<RouterView>`标签**，来作为一个“容器”，进行组件的渲染。不然router配置的路由不会生效。



### 编程式导航

我们可以定义name的属性，来使用name的值来跳转页面

```ts
const routes: Array<RouteRecordRaw> = [
  {
    name: "Index",
    path: "/",
    component: () => import(`../components/Index/Index.vue`),
  },
  {
    name: "AddArtical",
    path: "/addartical",
    component: () => import(`../components/AddContent/AddArtical.vue`),
  },
];
```

然后通过传对象的方式来进行跳转

```vue
<RouterLink :to="{ name: 'Index' }">首页</RouterLink>
```



**或者使用事件函数，通过编程式导航来跳转**

```vue
<button @click="changePage('AddArtical')">添加文章</button>
```

```ts
import { useRouter } from "vue-router";
const router = useRouter();
const changePage = (url: string) => {
  // 如果传url地址
  // router.push(url)
    
  // 如果传name
  router.push({
    name: url,
  });
};
```



### 历史记录

我们可以在`router-link`中使用`replace`属性来使这个跳转没有历史记录

```vue
<RouterLink replace to="/addartical">添加文章</RouterLink>
```

如果是编程式导航，我们可以把`router.push()`改为`router.replace()`



对于历史记录的前进倒退，我们可以使用`router.go()`和`router.back()`，参数为数字，如1，-1。

传入的几，就前进或者倒退几个历史记录，`router.go(0)`为刷新页面



### 路由传参

**query传参的跳转用name和path都可以**

```vue
<button @click="toQuery(item)" class="btn btn-outline btn-primary">
  路由传参
</button>
```

```ts
import { useRouter } from "vue-router";
const router = useRouter();
const item = {
  name: "kevin",
  age: 20,
};
type Item = {
  name: string;
  age: number;
};
const toQuery = (item: Item) => {
  router.push({
    name: "AddArtical",
    query: item,
  });
};
```



如果要接收路由传递的参数，要**使用`useRoute()`**，注意：不是`useRouter()`

```ts
import { useRoute } from "vue-router";
const route = useRoute();
const { name, age } = route.query;
```

```vue
<div class="bg-cyan-300 w-full h-screen">{{ name }} {{ age }}</div>
```



**params传参跳转只能用name，不能使用path**

```ts
router.push({
    name: "AddArtical",
    params: item,
  });
```

```ts
const route = useRoute();
const { name, age } = route.params;
```

**但是需要注意的是，params传参不会显示到url地址栏上，而且刷新后传递的值会被清除掉**



所以我们可以**使用动态路由参数**，这样既能保护好传递的参数，又能让参数刷新不会被丢失

router/index.ts

```ts
  {
    name: "AddArtical",
    path: "/addartical/:id",
    component: () => import(`../components/AddContent/AddArtical.vue`),
  },
```

App.vue

```ts
import { useRouter } from "vue-router";
const router = useRouter();
const item = {
  id: 1,
  name: "kevin",
  age: 20,
};
type Item = {
  id: number;
  name: string;
  age: number;
};
const toQuery = (item: Item) => {
  router.push({
    name: "AddArtical",
    params: {
      id: item.id,
    },
  });
};
```

AddArtical.vue

```ts
const items = data.find((i: Item) => i.id === Number(route.params.id));
// 注意：因为router.params.id传过来的是string，而i.id是number，所以需要转换一下
```

```vue
<div class="bg-cyan-300 w-full h-screen">
  {{ items?.id }}
  {{ items?.name }}
  {{ items?.age }}
</div>
<!-- 因为是用的find查找，可能会找不到，所以要用 ? 来使其变量为可选 -->
```



### 嵌套路由

一些应用程序的 UI 由多层嵌套的组件组成。在这种情况下，URL 的片段通常对应于特定的嵌套组件结构（像vue文档这类的网站，在文档中有单独的子路由）

使用children属性

```ts
  {
    name: "Parent",
    path: "/parent",
    component: () => import(`../components/Demo/Parent.vue`),
    children: [
      {
        name: "Child1",
        path: "child1",
        component: () => import(`../components/Demo/Child1.vue`),
      },
      {
        name: "Child2",
        path: "child2",
        component: () => import(`../components/Demo/Child2.vue`),
      },
    ],
  },
```

Parent.vue

```vue
  <div class="bg-slate-400 h-screen">
    <RouterLink to="/parent/child1" class="btn btn-accent"
      >子组件1号</RouterLink
    >
    <RouterLink to="/parent/child2" class="btn btn-accent"
      >子组件2号</RouterLink
    >
    <RouterView></RouterView>
  </div>
```

Child1.vue/Child2.vue

```vue
<!-- 1内容 -->
<div class="">子组件1内容</div>
<!-- 2内容 -->
<div class="">子组件2内容</div>
```



### 命名视图

有时候想同时 (同级) 展示多个视图，而不是嵌套展示，例如创建一个布局，有 `sidebar` (侧导航) 和 `main` (主内容) 两个视图，这个时候命名视图就派上用场了。你可以在界面中拥有多个单独命名的视图，而不是只有一个单独的出口。如果 `router-view` 没有设置名字，那么默认为 `default`。

简单来说，命名视图可以在当前组件中插入多个`<RouterView>`

```ts
  {
    name: "Index",
    path: "/",
    component: () => import(`../components/Index/Index.vue`),
    children: [
      {
        path: "/parent1",
        components: {
          default: Child1,
        },
      },
      {
        path: "/parent2",
        components: {
          header: Child2,
          side: Child1,
        },
      },
    ],
  },
```

```vue
  <RouterView></RouterView>
  <RouterView name="header"></RouterView>
  <RouterView name="side"></RouterView>
```



### 重定向与别名

#### 重定向

可以对一个路由默认的url地址进行指定url地址的跳转

在路由的对象中添加`redirect`属性，值可以是字符串（path），或者对象，如`{path: '/user'}`。又或者是用回调函数。

```ts
const routes: Array<RouteRecordRaw> = [
  {
    name: "Index",
    path: "/",
    redirect: "/parent1",
    component: () => import(`../components/Index/Index.vue`),
    children: [
      {
        path: "/parent1",
        components: {
          default: Child1,
        },
      },
      {
        path: "/parent2",
        components: {
          header: Child2,
          side: Child1,
        },
      },
    ],
  },
];
```



对象形式

```ts
redirect: { path: "./parent1" },
```



回调函数形式

```ts
    redirect: (v) => {
      return { path: "/parent1", query: v.query };
    },
```



#### 别名 alias

重定向是指当用户访问 `/home` 时，URL 会被 `/` 替换，然后匹配成 `/`。那么什么是别名呢？

**将 `/` 别名为 `/home`，意味着当用户访问 `/home` 时，URL 仍然是 `/home`，但会被匹配为用户正在访问 `/`。**

```ts
{
	name: "Index",
    alias: ["/user", "/kk"],
    path: "/",
    component: () => import(`../components/Index/Index.vue`),
}
```



### 导航守卫

首先，导航守卫是在调用函数，传入参数为一个回调函数。这个回调函数的参数为`to`，`from`， `next`

**`to`**: 即将要进入的目标，**`from`**: 当前导航正要离开的路由，`next`为一个函数，是否进入目标路由。`next(false)`为不进入。

`return false`为取消当前导航



#### 全局前置守卫

使用 `router.beforeEach` 注册一个全局前置守卫

```ts
router.beforeEach((to, from, next) => {
  next();
});
```



#### 全局解析守卫



#### 全局后置钩子



#### 路由独享的守卫

可以直接在路由配置上定义 `beforeEnter` 守卫：

```ts
  {
    path: '/users/:id',
    component: UserDetails,
    beforeEnter: (to, from) => {
      // reject the navigation
      return false
    },
  },
```



#### 组件内的守卫



### router-link的active(选中改变样式)

**在vue-router中要使用选中样式的方法有两种：**

**1、直接在路由js文件中配置linkActiveClass**

 ```ts
 const router = createRouter({
   linkActiveClass: "routerLinkActive",//routerLinkActive为index.css中写的class
   //...
 });
 ```



**2、在router-link中写入active-class**

```html
<RouterLink active-class="bg-primary">
```

