### slot 插槽

我们可以将某个组件通过slot的形式，插入到另一个组件中

```vue
<one-component>
	<two-component>
</one-component>
```



在one-component组件中

```vue
<div>
	<span>123</span>
	<slot />
</div>
```

这样，two-component组件就可以插入到slot中，也就是说，相当于将slot替换为`<two-component>`



### slot的作用域

使用数据时，数据在哪个组件被声明，就调用哪个组件的数据

```vue
<one-component>
	<div>{{num}}</div>
</one-component>
```

在上面的例子中调用本文件中的num，而不是`one-component`中的num



### slot的后备内容

可以使用`<slot></slot>`来设置插槽的默认内容

```vue
<LessonList></LessonList>
<LessonList>123</LessonList>
```



LessonList文件：

```vue
<div>
	<slot>ok</slot>
</div>
```

页面显示ok和123



### 具名插槽

当一个组件中有多个插槽时，需要使用具名插槽，`<slot name=""/>`。

实际上不设name的插槽name为default`<slot name="default"/>`。



当你使用这个插槽的时候，需要使用`template`标签，`<template v-slot:name></template>`。

子组件

```vue
<template>
  <div>
    <header class="text-lg">
      <slot name="header" />
    </header>
    <main class="text-sm">
      <slot name="main" />
    </main>
    <footer class="text-xs">
      <slot name="footer" />
    </footer>
  </div>
</template>
```

父组件

```vue
<template>
  <div class="m-4">
    <LessonList>
      <template v-slot:header>插槽内容与插口</template>
      <template v-slot:main
        >在某些场景中，我们可能想要为子组件传递一些模板片段，让子组件在它们的组件中渲染这些片段。</template
      >
      <template v-slot:footer
        >举个例子，这里有一个 FancyButton 组件，可以像这样使用：</template
      >
    </LessonList>
  </div>
</template>
```



当然 `v-slot:name`也有简写形式`#name`

```vue
<template>
  <div class="m-4">
    <LessonList>
      <template #header>插槽内容与插口</template>
      <template #main
        >在某些场景中，我们可能想要为子组件传递一些模板片段，让子组件在它们的组件中渲染这些片段。</template
      >
      <template #footer
        >举个例子，这里有一个 FancyButton 组件，可以像这样使用：</template
      >
    </LessonList>
  </div>
</template>
```



### slot与prop的实例操作

可以通过slot的slotProps来进行传值，子组件插槽的属性就是slotProps对象中的属性。

父组件

```vue
<script>
import LessonList from "./components/LessonList.vue";
import lesson from "./data/lesson";
export default {
  components: { LessonList },
  data() {
    return {
      lesson,
    };
  },
  methods: {
    del(title) {
      const index = this.lesson.findIndex((v) => v.title === title);
      this.lesson.splice(index, 1);
    },
  },
};
</script>

<template>
  <div class="m-4">
    <LessonList
      v-for="lesson in lesson"
      :title="lesson.title"
      #default="slotProps"
    >
      {{ lesson.url }}
      <button @click="del(slotProps.title)">删除</button>
    </LessonList>
  </div>
</template>
```

子组件

```vue
<template>
  <div>
    <div class="border-2 border-gray-900 m-4">
      <slot :title="title" />
    </div>
  </div>
</template>

<script>
export default {
  props: ["title"],
};
</script>
```

当然，如果使用具名插槽只能使用`template`标签的形式

