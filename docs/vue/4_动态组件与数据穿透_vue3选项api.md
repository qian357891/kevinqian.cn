### 动态组件

有的需求会想要在两个组件间来回切换，比如 Tab 界面：



上面的例子是通过 Vue 的 `<component>` 元素和特殊的 `is` attribute 实现的：

```vue
<!-- currentTab 改变时组件也改变 -->
<component :is="currentTab"></component>
```

在上面的例子中，被传给 `:is` 的值可以是以下几种：

- 被注册的组件名
- 导入的组件对象

你也可以使用 `is` attribute 来创建一般的 HTML 元素。

当使用 `<component :is="...">` 来在多个组件间作切换时，组件会在被切换掉后卸载。我们可以通过 [ `<KeepAlive>`组件](https://staging-cn.vuejs.org/guide/built-ins/keep-alive.html)强制不活跃的组件仍然保持“存活”的状态。



### 数据穿透

父组件使用`provide`，任意层级的子组件使用`inject`。可以实现数据穿透，从而不需要一级一级的使用prop传参。

如果要实现响应式：

- 传递的参数为一个对象，利用对象传递为传址的js特性
- 传递一个计算属性（computed）

父组件

```vue
<script>
//....
export default {
  provide() {
    return {
      siteTitle: this.db[0].title,
    };
  },
//....
};
</script>

<!--
......
-->
```

子组件

```vue
<script>
export default {
//....
  inject: ["siteTitle"],
  data() {
    return {
      inputKey: this.siteTitle,
    };
  },
//....
};
</script>

<!--
......
-->
```





### ref

我们可以通过`ref`来使父组件调用子组件的属性和方法

父组件

```vue
<script>
export default {
//......
  methods: {
    callShow() {
      this.$refs.component.show();
    },
  },
//......
};
</script>

<!-- .... -->
<button @click="callShow">App调用子组件的方法</button>
<component :is="curComponent" ref="component" />
<!-- .... -->
```

子组件

```vue
<script>
export default {
//....
  methods: {
    show() {
      alert(`${this.inputValue}组件的show方法`);
    },
  },
//....
};
</script>
<!-- ....  -->
```





### 实例演示

文件结构为App.vue根组件，component文件夹里面的子组件，data文件夹里面的db.js





App.vue

```vue
<script>
import WeChat from "./components/WeChat.vue";
import Site from "./components/Site.vue";
import db from "./data/db";
export default {
  components: { Site, WeChat },
  provide() {
    return {
      siteTitle: this.db[0].title,
    };
  },
  data() {
    return {
      curComponent: "we-chat",
      db,
      components: [
        { title: "微信管理", name: "we-chat" },
        { title: "站点管理", name: "site" },
      ],
    };
  },
  methods: {
    callShow() {
      this.$refs.component.show();
    },
  },
};
</script>

<template>
  <div class="m-4">
    <button
      v-for="(component, index) of components"
      :key="index"
      @click="curComponent = component.name"
      :class="{ 'bg-green-700 text-white': component.name === curComponent }"
    >
      {{ component.title }}
    </button>
    <button @click="callShow">App调用子组件的方法</button>
    <KeepAlive>
      <component :is="curComponent" ref="component" />
    </KeepAlive>
  </div>
</template>

<style scoped>
button {
  @apply m-4 p-2 border-gray-200 border-2 shadow-md hover:shadow-lg;
}
</style>
```



Card.vue

```vue
<script setup></script>

<template>
  <div>
    <header>
      <slot name="header" />
    </header>
    <main>
      <slot />
    </main>
  </div>
</template>

<style scoped lang="scss">
div {
  @apply border-2 border-slate-200 mt-4 rounded-md;
  header {
    @apply border-b-2 border-slate-200 p-3 bg-slate-200;
  }
  main {
    @apply p-3;
  }
}
</style>
```



Site.vue

```vue
<script>
export default {
  inject: ["siteTitle"],
  data() {
    return {
      inputValue: "www.kk.com",
      inputKey: this.siteTitle,
    };
  },
  methods: {
    show() {
      alert(`Site组件的show方法`);
    },
  },
};
</script>

<template>
  <div class="">
    <card>
      <template #header>站点管理</template>
      <x-input title="站点网址" v-model="inputValue" />
      <x-textarea title="站点说明" v-model="inputKey" />
    </card>
  </div>
</template>

<style scoped></style>
```



WeChat.vue

```vue
<script>
export default {
  data() {
    return {
      inputValue: "wechat",
      inputKey: "abcd",
    };
  },
  methods: {
    show() {
      alert(`${this.inputValue}组件的show方法`);
    },
  },
};
</script>

<template>
  <div class="">
    <card>
      <template #header>微信管理</template>
      <x-input title="微信号" v-model="inputValue" />
      <x-input title="密钥" v-model="inputKey" />
    </card>
  </div>
</template>

<style scoped></style>
```



XInput.vue

```vue
<script>
export default {
  props: ["title", "modelValue"],
  // emits: ["update:modelValue"],
  data() {
    return {
      content: this.modelValue,
    };
  },
  watch: {
    content(v) {
      this.$emit("update:modelValue", v);
    },
  },
};
</script>

<template>
  <div class="">
    <label>
      <div>{{ title }}</div>
      <input type="text" v-model="content" />
    </label>
  </div>
</template>

<style scoped lang="scss">
label {
  @apply flex mt-2;
  div {
    @apply mr-4 text-gray-500 w-20;
  }
  input {
    @apply border-2 rounded-md pl-1 pr-1;
  }
}
</style>
```



XTextarea.vue

```vue
<script>
export default {
  props: ["title", "modelValue"],
  data() {
    return {
      key: this.modelValue,
    };
  },
  watch: {
    key(v) {
      this.$emit("update:modelValue", v);
    },
  },
};
</script>

<template>
  <label>
    <div>{{ title }}</div>
    <textarea cols="30" rows="5" v-model="key"></textarea>
  </label>
</template>

<style scoped lang="scss">
label {
  @apply flex mt-2;
  div {
    @apply mr-4 text-gray-500 w-20;
  }
  textarea {
    @apply border-2 rounded-md pl-1 pr-1;
  }
}
</style>
```



db.js

```js
export default [
  { id: 1, title: 'vue3', preview: '/images/vue.jpg', price: 129 },
  { id: 2, title: 'typescript', preview: '/images/ts.jpg', price: 79 },
  { id: 1, title: 'javascript', preview: '/images/js.png', price: 88 },
]
```

