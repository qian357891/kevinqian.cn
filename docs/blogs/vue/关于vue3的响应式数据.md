```js
let i = ref(1); 
const demo = () => {
  i.value ++;
  console.log(i);
}
```

```vue
<div>
  <button @click="demo">+</button>
  <div>{{i}}</div>
</div>
```

ref将数据变成响应式数据，进行数据操作时需要用value属性来操作。

**vue3中reactive和ref的区别**https://juejin.cn/post/7073722163924041741  https://www.php.cn/vuejs/483317.html

**vue3.0 响应式原理**https://juejin.cn/post/6858899262596448270