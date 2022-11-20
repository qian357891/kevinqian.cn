### 登录/登出后刷新部分组件

App.vue

```vue
<script setup lang="ts">
import HeadNav from "./components/HeadNav.vue";
// ...
import { nextTick, provide, ref } from "@vue/runtime-core";

const isRouterAlive = ref(true);
const reload = () => {
  isRouterAlive.value = false;
  nextTick(() => {
    isRouterAlive.value = true;
  });
};
provide("reload", reload);
</script>

<template>
  <div class="min-h-screen bg-base-300">
    <!--   -->
    <HeadNav v-if="isRouterAlive" />
    <RouterView></RouterView>
  </div>
</template>
```



Login.vue（登录）

```vue
<script setup lang="ts">
import { getCurrentInstance, inject, ref } from "vue";
import router from "../../router";
const { proxy } = getCurrentInstance() as any;

//注入依赖
const reload: any = inject("reload");

const username = ref("");
const password = ref("");

const login = () => {
  proxy.axios
    .post("xxx/xxx", {
      username: username.value,
      password: password.value,
    })
    .then((res: any) => {
      console.log(res);
      localStorage.setItem("xxxtokenxxx", res.data.token);
      router.push({ name: "Index" });
      reload();//调用reload函数
    });
};
</script>

<template>
	<!-- 绑定事件函数 -->
	<button @click="login()" class="btn btn-primary">登录</button>
	<!-- 错误：
		<button @click="login();relaod()" class="btn btn-primary">登录</button>
	-->
</template>
```

**注意：reload()函数只能在axios方法中的then中调用（要在存入token后），如果在外面调用的话，因为axios是promsie请求，是微任务，而reload是宏任务，如果直接调用会在axios请求前执行，所以虽然会刷新组件，但是那时候还没有将token存入localstorage**



HeaderNav.vue（登出）

```vue
<script setup lang="ts">
//...
import { inject } from "vue";
import router from "../router";
//...
    
const logout = () => {
  localStorage.removeItem("token");
  router.push({ name: "Index" });
};

const reload: any = inject("reload");
</script>

<template>
	<!-- -->
	<button @click="logout();reload();">退出</button>
    <!-- -->
</template>
```

