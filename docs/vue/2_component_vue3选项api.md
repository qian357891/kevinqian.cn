## 组件

全局组件使用`component`函数

```js
app.component('hello-com', {
    template: `
        <div>hello</div>
    `
});
```

局部组件使用components属性

```js
const CountCom = {
    data() {
        return {
            count : 1
        }
    },
    template: `
        <div>{{count}}</div>
        <button @click="count += 1">自增</button>
    `
}


const app = Vue.createApp({

    // 组件映射
    components : {
        'count-com': CountCom
    },
    template:`
        <div>
            <count-com/>
        </div>
    `
});
```



### props

https://blog.csdn.net/u014018281/article/details/118214094

子组件

```vue
<script>
export default{
  props: ['title']
}
</script>

<template>
  <div class="m-4 space-x-3">
   {{title}}
  </div>
</template>
```

父组件

```vue
<LessonList title="gogogo"/>
```

props接收父组件中的传值。



可以用来做一类组件的样式

子组件

```vue
<script>
export default{
  props: {
    content: {
      type: String,
      default: '提交'
    },
    type: {
      type: String,
      default: 'btn-sub'
    }
  }
}
</script>

<template>
  <button :class="[type]">
    {{content}}
  </button>
</template>

<style>
  .btn-sub {
    @apply py-2 px-4 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75;
  }
  .btn-delete {
    @apply py-2 px-4 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75;
  }
</style>
```

父组件

```vue
<script setup>
import LessonList from './components/LessonList.vue';
</script>

<template>
  <div class="m-4 space-x-3">
    <LessonList/>
    <LessonList content="删除" type="btn-delete"/>
  </div>
</template>
```

![image-20220728160802258](C:\Users\Kevin\AppData\Roaming\Typora\typora-user-images\image-20220728160802258.png)

###  使用props的注意事项

**[vue中组件通过props进行组件通信的时候，props是单向数据流的，也就是只能通过父组件改变值传入到子组件，不能通过子组件改变父组件中的值。（记住这句话，很重要！）**但我们实际开发中，有一些场景是需要实现双向数据流的props，**如数据是一个引用类型时**



如果要实现双向绑定，可以**将props的值赋给data中的一个值**。必要时可以使用**watch**监听。



### $attrs

子组件LessonList.vue

```vue
<template>
  <button :class="[type]" v-bind="$attrs">{{content}}</button>
  <span>123</span>
</template>
```

父组件

```vue
<LessonList id="gogo" old="theOld"/>
<LessonList content="删除" type="btn-delete"/>
```

当子组件的根标签只有一个时，父组件中使用子组件，并且赋值属性。子组件可以拿到。

如果根标签有多个，必须使用`$attrs`和`v-bind`来指定赋值的标签



如果子组件是这样嵌套的，想在父组件中给`button`标签填属性，而不是给div添加属性。我们除了要用到`$attrs`和`v-bind`，还需要s使用`inheriteAttrs: false,`禁用掉vue的默认传属性

```vue
<div>
    <button :class="[type]" v-bind="$attrs">{{content}}</button>
</div>

<script>
export default{
  inheritAttrs: false,
	//.......
}
</script>
```



同样的，`$attrs`也可以用来传递事件，**虽然是在父组件中定义的事件，但他只能在子组件中使用**

例如：

子组件

```vue
<div>
  <button :class="[type]" >{{content}}</button>
  <h2 class="m-5" v-bind="$attrs">子组件</h2>
</div>
<script>
export default{
  inheritAttrs: false,
	//.......
}
</script>
```

父组件

```vue
<LessonList content="删除" type="btn-delete" @click="show" oo="oo"/>
```

这个例子中只有点击h2标签的内容才会调用函数



### vite+vue3动态绑定src引入图片

使用**new URL(url, import.meta.url)**

https://cn.vitejs.dev/guide/assets.html#new-url-url-import-meta-url

https://zhuanlan.zhihu.com/p/399939287

演示：

```vue
<script>
import lesson from '../data/lesson'
export default{
  inheritAttrs: false,
  data(){
    return{
      lesson
    }
  },
  methods: {
    getImageUrl(title){
        return new URL(`../img/${title}.jpg`, import.meta.url).href
    }
  }
}
</script>

<template>
  <div v-for="lesson in lesson" :key="lesson.id">
    <img :src="getImageUrl(lesson.title)" :alt="lesson.title">
  </div>
</template>
```



### 父组件向子组件传递event

通过**$emit**进行传递

父组件

```vue
<script>
  import lesson from "./data/lesson";
  import LessonList from './components/LessonList.vue';
  export default{
    components:{LessonList},
    data(){
      return{
        lesson
      }
    },
    methods:{
      delFunc(id){
        const index = this.lesson.findIndex(v=>v.id = id);
        this.lesson.splice(index,1);
    }
  }
}
</script>

<template>
  <div class="m-4 ">
    <div class="grid grid-cols-4 gap-4">
      <LessonList v-for="item in lesson" :key="item.id" 
      :lesson="item" @del="delFunc"/>
    </div>
  </div>
</template>
```

子组件

```vue
<template>
	<div>
		<img :src="getImageUrl(lesson.title)" :alt="lesson.title" />
		<span @click="del">x</span>
	</div>
</template>

<script>
export default {
	props: ['lesson'],
	methods: {
		del() {
				this.$emit('del', this.lesson.id)
		},
		getImageUrl(title){
        return new URL(`../img/${title}.jpg`, import.meta.url).href
    }
	}
}
</script>
```



### v-model

v-model 作用于组件上本质就是一个语法糖，就是往组件传入了一个名为 modelValue 的 prop，它的值是往组件传入的数据 data，另外它还在组件上监听了一个名为 update:modelValue 的自定义事件，事件的回调函数接受一个参数，执行的时候会把参数 $event 赋值给数据 data。正因为这个原理，所以我们想要实现自定义组件的 v-model，首先需要定义一个名为 modelValue 的 prop，然后在数据改变的时候，派发一个名为 update:modelValue 的事件。
