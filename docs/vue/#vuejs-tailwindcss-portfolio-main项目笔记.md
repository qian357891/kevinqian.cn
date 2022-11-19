# vuejs-tailwindcss-portfolio-main项目笔记

**里面的举例不一定都是项目内容，但实现的方式都是一样的。**

## 关于项目中的Vue3/Html



### （一）aria-label属性（html）

例如：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title></title>
</head>
<body>
    <button title="Close"> X </button>
    <br />
    <br />
    <button aria-label="Back to the page" title="Close" > X </button>
</body>
</html>
```



现在，您需要一个虚拟屏幕阅读器模拟器，它将在浏览器上运行以观察差异。因此，chrome浏览器用户可以安装[chromevox](https://chrome.google.com/webstore/detail/chromevox/kgejglhpjiefppelpmljglcjbhoiplfn)扩展，mozilla用户可以使用[fangs screen reader](https://addons.mozilla.org/en-US/firefox/addon/fangs-screen-reader-emulator/)插件

安装完成后，将耳机戴在耳朵上，打开html页面，逐个将焦点放在两个按钮上(按tab键)。你可以听到..。专注于`first x button` ..只会告诉你`x button` ..但是在`second x button`的情况下..您将只听到`back to the page button` 

**这是一个为有视力障碍web用户提供的属性**



### （二）局部组件的使用（components）

#### 1.注册局部组件

```vue
<script>
import Button from './reusable/Button.vue';
//省略
export default {
	components: { Button },
	}
</script>

<template>
<!--调用组件（可以理解为定义的标签）-->
    </Button>
</template>
```



**` import Button from './reusable/Button.vue';`**先导入文件

```js
	export default {
	components: { Button },
	}
```

再局部注册组件，其中**` components: { Button },`**实际上是**`components: { Button:Button },` **  **即：`components: { obj:标签名 }`**



#### 2.props

prop是父组件给子组件传值的工具



下面是Button.vue

```vue
<script>
export default {
	props: ['title'],
	data: () => {
		return {
			//
		};
	},
};
</script>

<template>
	<button>{{ title }}</button>
</template>
```

其中**`props: ['title'],`** 定义了一个叫“title”的prop属性**`<button>{{ title }}</button>`**中用模板字面量调用”title“

在子组件中：

```vue
<Button title="Hire Me"/>
```

这里就是用**`title="Hire Me"`**传值 最后得到的就是**`<button>Hire Me</button>`**



###  （三）\<a>标签中的download属性(html)

```html
<!--  -->
<a href="/i/w3school_logo_white.gif" download="w3logo">
	<img border="0" src="/i/w3school_logo_white.gif" alt="W3School">
</a>
```

 如图：

 ![W3School](https://www.w3school.com.cn/i/w3school_logo_white.gif)

**download 属性中的值为下载的文件名。(其中download的值也可以设置后缀来规定下载文件的类型。如果没有写后缀，浏览器将自动检测正确的文件扩展名并添加到文件)**

**在\<a> 标签中必须设置 href 属性。**



### （四）使用vue内置的\<transition>标签/组件来实现过渡动画

语法格式：

```vue
<transition name = "name">
   <div></div>
</transition>
```

name是自己命名的class的名称，用来写动画样式，如果不写name 则默认是v

如：

```css
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
```

class 具体含义如下：

#### 进入enter

**v-enter-from：**定义进入过渡的开始状态。在元素被插入之前生效，在元素被插入之后的下一帧移除。**vue2.0中的语法** **v-enter**
**v-enter-active：**定义进入过渡生效时的状态。在整个进入过渡的阶段中应用，在元素被插入之前生效，在过渡/动画完成之后移除。这个类可以被用来定义进入过渡的过程时间，延迟和曲线函数。
**v-enter-to:** 2.1.8版及以上 定义进入过渡的结束状态。在元素被插入之后下一帧生效 (与此同时**v-enter-from** 被移除)，在过渡/动画完成之后移除。

#### 离开leave

**v-leave:** 定义离开过渡的开始状态。在离开过渡被触发时立刻生效，下一帧被移除。
**v-leave-active：**定义离开过渡生效时的状态。在整个离开过渡的阶段中应用，在离开过渡被触发时立刻生效，在过渡/动画完成之后移除。这个类可以被用来定义离开过渡的过程时间，延迟和曲线函数。
**v-leave-to:** 2.1.8版及以上 定义离开过渡的结束状态。在离开过渡被触发之后下一帧生效 (与此同时 v-leave 被删除)，在过渡/动画完成之后移除。



另外，也可以使用**Animate.css**动画库





## 关于项目中的Tailwind css/美化



### （一）英文字体大小写的转换

```html
<p class="normal-case ...">The quick brown fox ...</p> 
<p class="uppercase ...">The quick brown fox ...</p>
<p class="lowercase ...">The quick brown fox ...</p>
<p class="capitalize ...">The quick brown fox ...</p>
```

效果如下

 ![image-20220506130608550](C:\Users\Kevin\AppData\Roaming\Typora\typora-user-images\image-20220506130608550.png)



### （二）feather-icons的使用

先npm下载文件到项目中

在vue文件中导入后

```js
import feather from 'feather-icons';
```

要在页面上使用图标，请将`data-feather`带有图标名称的属性添加到元素，如：

```
<i data-feather="circle"></i>
```



### （三）Tailwind css断点

| 断点 | 屏幕类型                          | 最小宽度          |
| ---- | --------------------------------- | ----------------- |
| sm   | 小型屏幕（small），手机           | min-width:640px;  |
| md   | 中等屏幕（medium），平板          | min-width:768px;  |
| lg   | 大型屏幕（large），笔记本         | min-width:1024px; |
| xl   | 超大屏幕（extra large），台式机   | min-width:1280px; |
| 2xl  | 超大屏幕（extra large），大显示屏 | min-width:1536px; |



