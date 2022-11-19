### Class 与 Style 绑定

操作元素的 class 列表和内联样式是数据绑定的一个常见需求。因为它们都是 attribute，所以我们可以用 `v-bind` 处理它们：只需要通过表达式计算出字符串结果即可。不过，字符串拼接麻烦且易错。因此，在将 `v-bind` 用于 `class` 和 `style` 时，Vue.js 做了专门的增强。表达式结果的类型除了字符串之外，还可以是对象或数组。

https://v3.cn.vuejs.org/guide/class-and-style.html#%E7%BB%91%E5%AE%9A-html-class



### tailwindcss语法报错

安装 `PostCSS Language Support` 插件就可以解决 **`Unknown at rule @tailwind`** 的问题



### 动态控制样式

控制列表的删除状态

```vue
<div class="text-center">
    <div v-for="(item,index) in lesson" :key="index">
      <span :class="{'line-through': item.isDelate}">{{ item.title }}</span>
      <button @click="item.isDelate = !item.isDelate">{{item.isDelate?'取消':'删除'}}</button>
    </div>
</div>
```



### v-else/v-else-if

https://staging-cn.vuejs.org/api/built-in-directives.html#v-else



### v-for

`v-for`可以直接循环输出数字

key为字符串或者数值，要确保唯一值

```html
<div v-for="n in 8" :key="n">{{n}}</div>
```

可以遍历对象

```html
<div v-for="(value,key,index) in obj" :key="index">{{value}}-{{key}}-{{index}}</div>

<!--
obj:{
	name: 'kevin',
	age: 20,
} -->
```



### 组件标签也能使用属性

组件标签也能像html标签一样使用属性



### template标签

https://blog.csdn.net/u010510187/article/details/100356624



### for/in和for/of

**- V-for循环遍历数组时推荐使用of，语法格式为(item，index)**

- item:迭代时不同的数组元素的值
- index:当前元素的索引

**-for循环遍历对象时推荐使用in，语法格式为(item,name,index)**

- item:迭代时对象的键名键值
- name:迭代时对象的键名
- index:当前元素的索引



### 课程排序实例

```vue
<script>
import lesson from '../data/lesson'
export default{
  data(){
    return{
      lesson,
      sortType: 'asc',
      orderType: 'click'
    }
  },
  computed:{
    lessonList(){
      return this.lesson.sort((a,b)=>{
        return this.sortType === 'asc' ? a[this.orderType] - b[this.orderType] 
        : b[this.orderType] - a[this.orderType];
      })
    }
  }
}
</script>

<template>
  <div class="m-4 space-x-3">
    <!-- 排列依据按钮 -->
    <button @click="orderType = 'click'" :class="{'bg-red-700':orderType==='click'}">点击数</button>
    <button @click="orderType = 'comments'" :class="{'bg-red-700':orderType==='comments'}">评论数</button>
    <!-- 升序/降序按钮 -->
    <button @click="sortType = 'asc'" :class="{'bg-red-700':sortType==='asc'}">升序</button>
    <button @click="sortType = 'desc'" :class="{'bg-red-700':sortType==='desc'}">降序</button>
    <div v-for="(lesson,index) of lessonList" :key="index">
      课程名：{{ lesson.title }}-点击数：{{lesson.click}}-评论数：{{lesson.comments}}
    </div>
  </div>
</template>
```





### 事件/按键/鼠标 修饰符

https://staging-cn.vuejs.org/guide/essentials/event-handling.html#event-modifiers



### .passive修饰符

`.passive` 修饰符一般用于触摸事件的监听器，可以用来[改善移动端设备的滚屏性能](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener#使用_passive_改善的滚屏性能)。

- 浏览器只有等内核线程执行到事件监听器对应的JavaScript代码时，才能知道内部是否会调用preventDefault函数来阻止事件的默认行为，所以浏览器本身是没有办法对这种场景进行优化的。这种场景下，用户的手势事件无法快速产生，会导致页面无法快速执行滑动逻辑，从而让用户感觉到页面卡顿。

- 每次事件产生（像@scoll事件，每次滚动都会调用函数），浏览器都会去查询一下是否有preventDefault阻止该次事件的默认动作。我们加上passive就是为了告诉浏览器，不用查询了，我们没用preventDefault阻止默认动作。
- 这里一般用在**滚动监听**，@scoll，@touchmove 。因为滚动监听过程中，移动每个像素都会产生一次事件，每次都使用内核线程查询prevent会使滑动卡顿。**我们通过passive将内核线程查询跳过，可以大大提升滑动的流畅度。**
  



### vue首屏加载慢解决方法

https://zhuanlan.zhihu.com/p/364122068



### 表单输入绑定

https://staging-cn.vuejs.org/guide/essentials/forms.html