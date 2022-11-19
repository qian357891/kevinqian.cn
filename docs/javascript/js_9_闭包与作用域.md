## 作用域

全局作用域只有一个，每个函数又都有作用域（环境）。

- 编译器运行时会将变量定义在所在作用域
- 使用变量时会从当前作用域开始向上查找变量
- 作用域就像攀亲亲一样，晚辈总是可以向上辈要些东西



### 使用规范

作用域链只向上查找，找到全局 window 即终止，应该尽量不要在全局作用域中添加变量。

函数被执行后其环境变量将从内存中删除。下面函数在每次执行后将删除函数内部的 total 变量。

同时，需要注意的是，每次调用函数时都会重新开辟内存空间。

```js
function count() {
  let total = 0;
}
count();
```



### 延伸函数环境生命周期

在函数体中，声明了变量。在函数调用后会进行垃圾清理。并且每次调用函数都会重新开辟新的内存空间。

所以每次的变量n都不是同一个变量n。

```js
function outer(){
  let n = 1;
  function inner(){
    console.log(++n);
  }
  inner();
}

outer();//2
outer();//2
```



在js的垃圾清理中，如果引用类型没有被引用，就会被清理掉。

在函数体中我们有一个函数，如果对他进行引用，那么就不会被进行垃圾清理，同时，因为在引用的函数中，使用了n。

所以变量n也不会被清理。

所以反复调用a()，可以发现n的值在改变。

```js
function outer(){
  let n = 1;
  return function inner(){
    console.log(++n);
  }
}

let a = outer();//这里outer的返回值是inner函数 所以相当于a引用了inner函数，outer内部的环境变量不会被清除
a();//2
a();//3
let b = outer();
b();//2
b();//3
```



对于函数的调用，我们要知道的是：

- f()执行f函数，返回子函数
- f()()执行子函数，返回孙函数
- f()()()执行孙函数，返回重孙函数

注意，如果想这样执行，函数结构必须是这样：f的函数体里要return 子函数，子函数里要return 孙函数，如果没有return关键字，是不能这样连续执行的，会报错的。

```js
function outer(){
  let n = 1;
  return function inner(){
    let m = 1;
    return function inin(){
      console.log('m:' + ++m,'n:' + ++n);
    }
  }
}

let a = outer()();//这里outer的返回值是inin函数 所以相对于a = inin
a();//m:2 n:2
a();//m:3 n:3
```



### 构造函数中作用域的使用形态

构造函数也是很好的环境例子，子函数被外部使用父级环境将被保留

```js
function User(){
  let n = 1;
  this.show = function(){
    console.log(++n);
  }
}

let user = new User();
user.show();//2
user.show();//3
```

上面的例子，我们可以把他看成下面的代码

```js
function User(){
  let n = 1;
  let show = function(){
    console.log(++n);
  };
  return {
    show: show
  };
}

let user = new User();
user.show();//2
user.show();//3
```



### let/const

使用 `let/const` 可以将变量声明在块作用域中（放在新的环境中，而不是全局中）

```js
{
	let a = 9;
}
console.log(a); //ReferenceError: a is not defined
if (true) {
	var i = 1;
}
console.log(i);//1
```



### var/let 在for循环中的执行原理

let有块作用域。同时，要注意的是**在每次执行循环体之前，JS 引擎会把 i 在循环体的上下文中重新声明及初始化一次。**

```js
for(let i=0;i<3;i++){}
拆分开来
{let i=0;}
{let i=1;}
{let i=2;}
```

for循环中每一次的let和函数都在块作用域中，i会直接在块作用域中找到当前循环的变量`i`的值。



而var没有块作用域，for循环中每次`i`都在全局变量中找到`i`，在执行setTimeout()函数时，for循环已经结束了，i为4。

所以使用var声明时，会打印4。

```js
for (let i = 1; i <= 3; i++){
  setTimeout(function() {
    console.log(i);
  }, 1000);
}
//输出
//1
//2
//3

for (var i = 1; i <= 3; i++){
  setTimeout(function() {
    console.log(i);
  }, 1000);
}
//输出
//4
//4
//4
```



### 模拟出var的伪块级作用域

var没有块级作用域，但是有函数作用域。所以我们可以利用立即执行函数来模拟出var的伪块级作用域。‘

对于立即执行函数，要知道的是：

- 该函数表达式在定义时就会调用

- 该函数将拥有自己独立的词法作用域，外部无法访问

- 该函数可以访问到外部的变量

```js
for (var i = 1; i <= 3; i++){
  (function(a){
    setTimeout(function() {
      console.log(a);
    }, 1000);
  })(i);
}
//输出
//1
//2
//3
```



### 多级作用域嵌套

```js
//for中用let声明变量
let arr = [];
for (let i=1;i<=3;i++){
  arr.push(function(){
    return i;
  })
}
console.log(arr.length);//3
console.log(arr[0]());//1
console.log(arr[1]());//2
console.log(arr[2]());//3

//for中用var声明变量
let arr = [];
for (var i=1;i<=3;i++){
  arr.push(function(){
    return i;
  })
}
console.log(arr.length);//3
console.log(arr[0]());//4
console.log(arr[1]());//4
console.log(arr[2]());//4
```

同样的，要想使用var来模拟块作用域，可以用立即执行函数来包裹。

```js
let arr = [];
for (var i=1;i<=3;i++){
  (function(a){
      arr.push(function(){
        return a;
    });
  })(i);
}
console.log(arr.length);//3
console.log(arr[0]());//1
console.log(arr[1]());//2
console.log(arr[2]());//3
```



## 闭包使用

### 基本示例

闭包指子函数可以访问外部作用域变量的函数特性，即使在子函数作用域外也可以访问。如果没有闭包那么在处理事件绑定，异步请求时都会变得困难。

- JS 中的所有函数都是闭包
- 闭包一般在子函数本身作用域以外执行，即延伸作用域

如果我们要对数组的区间进行筛选，可以用filter方法，但是如果要返回多次，没办法进行一个复用。

```js
let  arr = [1,2,3,4,5,6,7,8,9];

console.log(arr.filter( item => {
  return item>2 && item<7;
} ));

console.log(arr.filter( item => {
  return item>4 && item<9;
} ));
```



我们可以用一个函数对filter方法进行封装，其中我们就用到了闭包的特性

```js
let  arr = [1,2,3,4,5,6,7,8,9];

function between(a,b){
  return item => {
    return item>a && item<b; //该函数作用域能访问到a,b  item也能访问到filter的item
  }
}

console.log(arr.filter(between(2,8)));//[ 3, 4, 5, 6, 7 ]
console.log(arr.filter(between(5,9)));//[ 3, 4, 5, 6, 7 ]
```



### 移动动画

在不使用闭包的情况下，如果进行多次点击，动画会出现抖动，因为每次执行函数都会重新开辟内存空间，left会被重复声明。

```html
<style>
  button{
    position: absolute;
  }
</style>
<body>
  <button message="btn1">按钮1</button>
  <!-- <button message="btn2">按钮2</button> -->
  <script>
    let btn = document.querySelectorAll('button');
    btn.forEach(element => {
      element.addEventListener('click',()=>{
        let left = 1;
        setInterval(() => {
          element.style.left = left++ +'px';
        }, 100);
      })
    });
  </script>
</body>
```



如果只是不想让画面抖动，我们可以将left的定义放在他的父级作用域中

```html
<style>
  button{
    position: absolute;
  }
</style>
<body>
  <button message="btn1">按钮1</button>
  <!-- <button message="btn2">按钮2</button> -->
  <script>
    let btn = document.querySelectorAll('button');
    btn.forEach(element => {
      let left = 1;//放在父级作用域中，执行函数时left不会被重复声明
      element.addEventListener('click',()=>{
        setInterval(() => {
          element.style.left = left++ +'px';
        }, 100);
      })
    });
  </script>
</body>
```



但是你会发现多次点击会造成移动速度变快。

这是因为每次执行事件监听函数都会开辟新的内存空间，每次都会有setInterval定时器执行。

我们可以让每次开辟的内存空间不执行定时器。

```html
<style>
  button{
    position: absolute;
  }
</style>
<body>
  <button message="btn1">按钮1</button>
  <!-- <button message="btn2">按钮2</button> -->
  <script>
    let btn = document.querySelectorAll('button');
    btn.forEach(element => {
      let bind = false;
      let left = 1;
      element.addEventListener('click',()=>{
        if(!bind){
          bind = setInterval(() => {
            element.style.left = left++ +'px';
          }, 100);
        }
      })
    });
  </script>
</body>
```



### 利用闭包进行购物车的排序

```js
let car = [{
  name: 'ipone',
  price: 8888,
  num: 3
},{
  name: 'imac',
  price: 12000,
  num:1
},{
  name: 'ipad',
  price: 6000,
  num:2
}];
function btterSort(way,type='asc'){
  return (a,b) => {
    return type === 'asc' ? a[way] - b[way] : b[way] - a[way]; 
  }
}
let [...priceWay] = car.sort(btterSort('price'))
console.log(priceWay);
//[
//   { name: 'ipad', price: 6000, num: 2 },
//   { name: 'ipone', price: 8888, num: 3 },
//   { name: 'imac', price: 12000, num: 1 }
// ]
let [...numWay] = car.sort(btterSort('num','desc'))
console.log(numWay);
//[
//   { name: 'ipone', price: 8888, num: 3 },
//   { name: 'ipad', price: 6000, num: 2 },
//   { name: 'imac', price: 12000, num: 1 }
// ]
```



### 闭包问题

**内存泄漏**

闭包特性中上级作用域会为函数保存数据，从而造成的如下所示的内存泄漏问题

```html
<body>
  <div dd="houdunren">在线学习</div>
  <div dd="hdcms">开源产品</div>
</body>
<script>
  let divs = document.querySelectorAll('div');
  divs.forEach(item => {
    item.addEventListener('click',()=>{
      console.log(item.getAttribute('dd'));
      console.log(item);
    })
  })
</script>
```

上面的例子中，我们也许只想取到节点元素中的 dd的属性。

但是由于闭包的特性，会一直保留整个节点元素。这会对内存一定程度的造成浪费。

下面通过清除不需要的数据解决内存泄漏问题

```html
<body>
  <div dd="houdunren">在线学习</div>
  <div dd="hdcms">开源产品</div>
</body>
<script>
  let divs = document.querySelectorAll('div');
  divs.forEach(item => {
    let dd = item.getAttribute('dd');
    item.addEventListener('click',()=>{
      console.log(dd);
      console.log(item);//null
    })
    item = null;
  })
</script>
```

可以看到，让item = null 从而让节点元素没有被引用，所以就会被进行垃圾回收了。

**为什么item = null;在后面，前面函数中的item会为null，而不是执行了一次后再为null？**

**因为在这里只是绑定dom事件**（这里，只是**绑定** `item` 的点击事件的回调函数，只是**绑定**一下，一瞬间的事，不需要阻塞）**，而不是直接执行。**



### 闭包中this的历史遗留问题

this 总是指向调用该函数的对象，即函数在搜索 this 时只会搜索到当前活动对象。

下面是函数因为是在全局环境下调用的，所以 this 指向 window，这不是我们想要的。

其中`func()`的返回值为`function(){return this;}`所以使用`func()()`来调用方法里面的函数

注意这并不是由obj对象来调用，而是window全局对象。

在对象方法的普通函数中，使用this，这时的对象的引用不是他的上层方法的对象，而是全局对象window

```html
<body>

</body>
<script>
  let obj = {
    site: 'dd',
    func(){
      return function(){
        return this;
      };
    }
  };
  console.log(obj.func()());//window对象
</script>
```

使用箭头函数解决这个问题

```html
<body>

</body>
<script>
  let obj = {
    site: 'dd',
    func(){
      return ()=>{
        return this.site;
      };
    }
  };
  console.log(obj.func()());//dd 指向obj这个对象
</script>
```
