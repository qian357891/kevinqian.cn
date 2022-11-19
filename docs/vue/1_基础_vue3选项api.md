## 应用实例

### CreateApp

> 顾名思义，CreateApp 作为 vue 的启动函数，返回一个应用实例

使用Vue.createApp()创建一个新的 **应用实例**

其中，createApp中的参数为一个对象

```js
const app = Vue.createApp({})
```



## 挂载应用



### mount

应用实例必须在调用了 `.mount()` 方法后才会渲染出来。该方法接收一个“容器”参数，可以是一个实际的 DOM 元素或是一个 CSS 选择器字符串：

```html
<div id="app"></div>
```

当然，你可以链式操作

```js
Vue.createApp({}).mount('#app');
```

应用根组件的内容将会被渲染在容器元素里面。容器元素自己将不会被视为应用的一部分。

`.mount()` 方法应该始终在整个应用配置和资源注册完成后被调用。同时请注意，不同于其他资源注册方法，它的返回值是根组件实例而非应用实例。



### 应用和组件

```js
const app = Vue.createApp({
  data() {
    return {
      title: 'kevin'
    }
  },
});
app.component('tom',{
  data() {
    return {
      name: 'tom'
    }
  },
  template: `<h2>{{name}}</h2>`
})
app.mount('#app');
```

其中tom是根组件的子组件

```html
<div id="app">
  <h1>{{title}}</h1>
  <tom/>
</div>
```

当根组件没有设置 `template` 选项时，Vue 将自动使用容器的 `innerHTML` 作为模板。



## vue指令与data属性

v-text是vue的一个指令（类似于html标签属性），与vue的模板语法`{{}}`作用相似

```html
<h1>{{title}}</h1>
<h1 v-text="title"></h1>
```



另外双大括号将会将数据插值为纯文本，而不是 HTML。若想插入 HTML，你需要使用 `v-html`指令 ：

```html
<p>Using text interpolation: {{ rawHtml }}</p>
<p>Using v-html directive: <span v-html="rawHtml"></span></p>
```

这里看到的 `v-html` attribute 被称为一个**指令**。指令由 `v-` 作为前缀，表明

它们是一些由 Vue 提供的特殊 attribuite（属性），它们将为渲染的 DOM 应用特殊的响应式行为。

**安全警告**

在网站上动态渲染任意 HTML 是非常危险的，因为这非常容易造成 **XSS 漏洞**。请仅在内容安全可信时再使用 `v-html`，并且**永远不要**使用用户提供的 HTML 内容（除非过滤掉了危险内容）。



## Attribute 绑定

双大括号不能在 HTML attributes 中使用。相应的，应该使用 `v-bind` 指令：

```html
<h1 v-bind:tt="title"></h1>
```

`v-bind` 指令指示 Vue 将元素的 `id` attribute 与组件的 `dynamicId`（动态id） property 保持一致。如果绑定的值是 `null` 或者 `undefined`，那么该 attribute 将会从渲染的元素上移除。



### 简写

简写语法：

```html
<h1 :tt="title"></h1>
<!-- title: 'kevin', data对象返回值中的title属性为'kevin'-->
```

**在浏览器中可以看到节点为：\<h1 tt="kevin">\</h1>**

开头为 `:` 的 attribute 可能和一般的 HTML attribute 看起来不太一样，但它的确是合法的 attribute 名称字符，并且所有支持 Vue 的浏览器都能正确解析它。此外，他们不会出现在最终渲染的标签中。简写语法是可选的。



### 动态参数

指令参数上也可以使用一个 JavaScript 表达式

使用中括号`[]`来绑定动态参数

```html
<h1 :[title]="value"></h1>

<!-- 
title: 'kevin',
value: 'a value', 
-->
```

**\<h1 kevin="a value">\</h1>**



#### 动态参数值的限制

动态参数期望结果为一个字符串，或者是 `null`。特殊值 `null` 意为显式移除该绑定。任何其他非字符串的值都将触发一个警告。

#### 动态参数语法的限制

动态参数表达式因为某些字符的缘故有一些语法限制，比如空格和引号，在 HTML attribute 名称中都是不合法的。





### 动态绑定多个值

如果你有像这样的一个包含多个 attribute 的 JavaScript 对象：

```js
data() {
  return {
    objectOfAttrs: {
      id: 'container',
      class: 'wrapper'
    }
  }
}
```

通过不带参数的 `v-bind`，你可以将它们绑定到单个元素上：

```html
<div v-bind="objectOfAttrs"></div>
```



### 修饰符

修饰符是以点开头的特殊后缀，表明指令需要以一些特殊的方式被绑定。例如 `.prevent` 修饰符会告知 `v-on` 指令对触发的事件调用 `event.preventDefault()`：

```html
<form @submit.prevent="onSubmit">...</form>
```



## 模板语法可以写表达式

模板语法可以写**单个表达式**

如：

```html
<h3>{{n===1?value:title}}</h3>
```



## 事件处理



### 监听事件

你可以使用 `v-on` 指令 (简写为 `@`) 来监听 DOM 事件和运行 JavaScript 代码。用法：`v-on:click="methodName"` 或 `@click="handler"`。

事件处理器的值可以是：

1. **内联事件处理器**：事件被触发时执行的内联 JavaScript 语句 (与 `onclick` 类似)。
2. **方法事件处理器**：一个组件的属性名、或对某个方法的访问。



#### 内联事件处理器

内联事件处理器通常用于简单场景，例如：

```html
data() {
  return {
    count: 0
  }
}
<button @click="count++">Add 1</button>
<p>Count is: {{ count }}</p>
```



#### 方法事件处理器

随着事件处理器的逻辑变得愈发复杂，内联代码方式变得不够灵活。因此 `v-on` 也可以接受一个方法名或对某个方法的调用。

举个例子：

```HTML
const app = Vue.createApp({
  data() {
    return {
      title: 'kevin',
      value: 'a value',
      n: 1
    };
  },
  methods: {
    up(){
      n = this.n++;
    }
  }
});
<button @click="up">up</button>
```



## 计算属性

https://staging-cn.vuejs.org/guide/essentials/computed.html#writable-computed

推荐使用**计算属性**来描述依赖响应式状态的复杂逻辑。使用方法与data类似



## 侦听器

在选项式 API 中，我们可以使用 [`watch` 选项](https://staging-cn.vuejs.org/api/options-state.html#watch)在每次响应式 property 发生变化时触发一个函数。

