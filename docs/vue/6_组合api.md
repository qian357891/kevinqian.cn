### reactive和ref

**注意区别开ref函数与模板ref，ref函数用来声明响应式数据，相当于组合api中的data，模板ref可以用来让父组件获取子组件属性**

在选项api中我们通过data的返回值来实现响应式数据，而在组合api中我们使用reactive和ref

两个函数都用与定义响应式数据。

引用类型用reactive，基本类型用ref

[Vue3 Composition API: 对比ref和reactive](https://zhuanlan.zhihu.com/p/267967246)



### 模板ref

与ref函数不同，模板ref作用于标签上，是一个属性。我们可以用ref属性来获取dom元素。

使用了 `<script setup>` 的组件是**默认私有**的：一个父组件无法访问到一个使用了 `<script setup>` 的子组件中的任何东西，除非子组件在其中通过 `defineExpose` 宏显式暴露，这样就能让父组件获取到子组件的属性了。



### defineProps

在选项api中我们使用props属性来传递prop，在组合api中我们使用`defineProps`函数（记得是通过标签中的属性传值）

```vue
<!-- 父 -->
<script setup lang="ts">
</script>
<template>
	<ItemCard :title="title" :price="price" class="bg-base-100 px-4 pt-4" />
</template>

<!-- 子：ItemCard.vue -->
<script setup lang="ts">
const props = defineProps({
    title:String,
    price:Number
});
</script>
<template>
	<h1
    class="mb-3 w-full flex-none text-2xl leading-none text-slate-900"
      >
    {{ props.title }}
  </h1>
  <div
    name="price"
    class="flex-auto text-lg font-medium text-slate-500"
  >
    ￥{{ props.price }}
  </div>
</template>
```

