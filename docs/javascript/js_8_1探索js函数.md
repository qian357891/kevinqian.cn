## 函数的基础知识

函数是将复用的代码块封装起来的模块，在 JS 中函数还有其他语言所不具有的特性。

### 函数的声明与定义

在js中函数Function也属于对象，下面的例子可以方便理解函数是对象。

```js
let func = new Function('title','console.log(title)');
func('obj');//obj
```



标准语法是使用函数声明来定义函数

```js
function dd(title){
  console.log(title);
}
dd('xiaoming');//xiaoming

let easyFunc = function(title){
  console.log(title);
}
easyFunc('easy');//easy
console.log(typeof easyFunc);//function
```



函数在对象属性中的声明和简写。

```js
let obj = {
  name: 'xiaoxiao',
  func: function(title){
    console.log(title);
  },
  //简写
  easyFunc(title){
    console.log(title);
  }
}
obj.func('zjl');//zjl
obj.easyFunc('easy');//easy
```



**在函数声明要将其使用let或者const声明，或者放在类与对象中。若使用全局声明，会将声明的对象添加到window对象中。**

**如果声明的函数与window中的方法同名，则会覆盖原有方法或者属性。**

```js
console.log(window.screenX); //1033 窗口左侧到屏幕左侧的距离
```



当我们定义了 `screenX` 函数后就覆盖了 window.screenX 方法

```js
function screenX(){
  console.log('覆盖');
}
console.log(window.screenX); 
// ƒ screenX(){
//   console.log('覆盖');
// }
```



### 函数的提升与匿名函数

标准声明的函数优先级比`var`更高，解析器会优先提取函数并放在代码树顶端，所以标准声明函数位置不限制。

```js
console.log(func);//[Function: func]
var func = 0;
function func(){}
```

变量函数定义不会被提升

```js
func();//no
function func(){
  console.log('no');
}
func();//no
var func = function(){
  console.log(123);
};
func();//123
```



函数是对象所以可以通过赋值来指向到函数对象的指针，当然指针也可以传递给其他变量，注意后面要以`;`结束（因为这是一个表达式）。下面使用函数表达式将 `匿名函数` 赋值给变量。

```js
let func = function(num){
  return ++num;
};
console.log(func(3));//4
let newFunc = func;
console.log(newFunc(5));//6
```



程序中使用匿名函数的情况非常普遍

```js
function sum(...args) {
  return args.reduce((a, b) => a + b);
}
console.log(sum(1, 2, 3, 4));//10
```



### 立即执行函数

立即执行函数指函数定义时立即执行

```js
(function(){
  console.log(123);
})()//123
```



可以用来定义私有作用域防止污染全局作用域（在es5中可以这样做，在es6我们一般使用类和模块化进行处理）

下面是两个js文件

```js
//demo.js
//利用闭包
(function(){
  function show(){
    console.log('show js1');
  }
  window.js1 = {show};
})();

//demo1,js
//利用闭包
(function(){
  function show(){
    console.log('show js2');
  }
  window.js2 = {show};
})();
```



使用 `let/const` 有块作用域特性，所以使用以下方式也可以产生私有作用域（当然，我们一般使用类和模块化进行处理）

```js
//demo.js
// 利用let的块作用域
{
  let way =  function(){
    console.log('way js1');
  }
  window.js1.way = way; //这样做的前提是window对象中已经有js1属性，然后让js1的属性作为对象接收way属性(一个函数)
}

//demo1.js
// 利用let的块作用域
{
  let way =  function(){
    console.log('way js2');
  }
  window.js2.way = way;//这样做的前提是window对象中已经有js2属性，然后让js2的属性作为对象接收way属性(一个函数)
}
```



两个文件导入html，如果直接定义函数，后导入的同名函数会覆盖掉前面导入文件的同名函数。

```html
<body>
  <script src="demo.js"></script>
  <script src="demo1.js"></script>
  <script>
    js1.show();//show js1
    js2.show();//show js2
    js1.way();//way js1
    js2.way();//way js2
  </script>
</body>
```



### 形参实参

形参是在函数声明时设置的参数，实参指在调用函数时传递的值。

- 形参数量大于实参时，没有传参的形参值为 undefined
- 实参数量大于形参时，多于的实参将忽略并不会报错

```js
// n1,n2 为形参
function sum(n1, n2) {
	return n1+n2;
}
// 参数 2,3 为实参
console.log(sum(2, 3)); //5
```

当没传递参数时值为 undefined

```js
let func = function(num1,num2){
  console.log(num1,num2);//2  undefined
  return num1+num2;
};
console.log(func(2));//NaN
```



### 函数默认值

es5设置函数默认值

```js
let func = function(num1,num2){
  num2 = num2 || 1 
  console.log(num1,num2);//2 1
  return num1+num2;
};
console.log(func(2));//3
```

es6设置函数默认值

```js
let func = function(num1,num2=1){
  console.log(num1,num2);//2 1
  return num1+num2;
};
console.log(func(2));//3
```



下面通过排序来体验新版默认参数的处理方式，下例中当不传递 type 参数时使用默认值 asc。

```js
let sortArr = function(arr,type = 'asc'){
  return arr.sort((a,b) => type === 'asc' ? a-b : b-a);
} 
console.log(sortArr([4,1,3,6,5]));//[ 1, 3, 4, 5, 6 ]
console.log(sortArr([4,1,3,6,5],'desc'));//[ 6, 5, 4, 3, 1 ]
```



在使用默认参数时，默认参数要放在最后面。

传参时，如果没有默认值的参数在后面，前面有默认值的参数也是需要传参。可以传undefined，但这样就没有设置默认值的意义了。所以在使用函数参数默认值的时候，要将其参数放在最后。

```js
//错误的姿势
let func = function(dis1=0,dis2=0,price){
  return price*(1-dis1)*(1-dis2);
}
console.log(func(0.5,undefined,1000));//500

//正确的姿势
let funcRight = function(price,dis1=0,dis2=0){
  return price*(1-dis1)*(1-dis2);
}
console.log(funcRight(1000,0.5));//500
```



### 函数参数与arguments

函数可以做为参数传递，这也是大多数语言都支持的语法规则。

```js
let i = 1;
let func = function(){
  console.log(i++);
};
setInterval(func,1000);//输出1~正无穷大

function numFilter(number){
  return number <=3 ;
}
console.log([1,3,6,7].filter(numFilter));//[ 1, 3 ]
```



arguments 是函数获得到所有参数集合，下面是使用 `arguments` 求和的例子。其中，**`arguments`**是一个类数组对象。

```js
let sum = function(){
  return [...arguments].reduce( (a,b) => a+b );
}
console.log(sum(1,2,3,4));//10
```



arguments是js的老特性，es6中我们一般用 **`...`** 剩余语法

```js
let sum = function(...arg){
  return arg.reduce( (a,b) => a+b );
}
console.log(sum(1,2,3,4));//10
```



### 箭头函数

箭头函数是函数声明的简写形式，在使用递归调用、构造函数、事件处理器时不建议使用箭头函数。

无参数时使用空扩号即可，若只有一行，可以不写{}大括号和return以及分号 ; 。当然，在这种情况下，会隐式地添加return。

如果返回值是一个对象，需要用小括号 `()` 包裹。

```js
let sum = () => 10;
console.log(sum());//10

let obj = () => ({name:'obj'});
console.log(obj());//{ name: 'obj' }
```



如果只有一个参数时，可以省略形参的括号。

```js
let peo = title => title;
console.log(peo('nb'));//nb
```

当然，参数不为一个的时候，必须要用小括号`()`包裹，不同参数间用逗号`,`隔开

```js
let sum = (num1,num2) => num1+num2;
console.log(sum(2,3));//5
```



### 递归调用

递归指函数内部调用自身的方式。

- 主要用于数量不确定的循环操作
- 要有退出时机否则会陷入死循环

下面通过阶乘来体验递归调用

递归调用传的--n而不是n--，是因为n--的话传入的依然是n（哪怕执行后n为n-1），这样会照成死循环。

```js
let factorial = num => num === 1 ? 1 : num * factorial(--num);
console.log(factorial(5));//120
```

累加计算方法

```js
let sum = (...num) => num.length === 0 ? 0 : num.pop() + sum(...num);
console.log(sum(1,2,3,4));//10
```

递归打印倒三角

```html
<body>
  <script>
    let star = function(row=5){
      return row 
      ? ( (document.write('*'.repeat(row) + '</br>')) || star(--row) )
      : document.write('');
    };
    star();
  </script>
</body>
```

使用递归修改课程点击数

```js
let lesson = [{
  name: 'js',
  click: 88
},{
  name: 'ts',
  click: 55
}]
let up = (arr, num = 100, i = 0) => {
  if(i === arr.length){
    return arr;
  }
  arr[i].click += num;
  return up(arr, num = 100, ++i);//需要加上return
}

console.log(up(lesson));//[ { name: 'js', click: 188 }, { name: 'ts', click: 155 } ]
```

**在这个利用递归修改课程点击数的例子中。刚开始，我认为函数体内末行的递归函数不需要return。但这是一个错误的想法，如果不使用return，那么该函数就没有返回值。在开头的if判断中的返回值，并不是最外层函数的返回值，而是最里层函数的返回值。如果没有return来返回递归函数的返回值，那么里层函数的返回值就无法传递到最外层。**



### 回调函数

在某个时刻被其他函数调用的函数称为回调函数。

回调是一个函数把非当前函数当做参数传递到自身内部来调用。

```js
let func = item => ++item;
let map = [1,2,3,4].map( func );
console.log(map);//[ 2, 3, 4, 5 ]

let func1 = function(item){
  return ++item
};
let func2 = function(funcItem,callback) {
  return callback(funcItem);
};
console.log(func2(2,func1));//3
```

在这个例子中，func和func1就是回调函数。



### 展开语法(...)

展开语法或称点语法体现的就是`收/放`特性，做为值时是`放`，做为接收变量时是`收`。

```js
let arr = [1,2,3];
let [a,b,c] =[...arr];
console.log(a,b,c);//1 2 3
let [...arg] = 'string';
console.log(arg);//[ 's', 't', 'r', 'i', 'n', 'g' ]
```

使用展示语法可以替代 `arguments` 来接收任意数量的参数

```js
function func(...arg){
  console.log(arg);
}
func(1,2,3,4,5);//[ 1, 2, 3, 4, 5 ]
```

也可以用于接收部分参数。当然，运用了展开语法的参数得放在最后。

```js
function func(num1,num2,...arg){
  console.log(arg);
}
func(1,2,3,4,5,6,7);//[ 3, 4, 5, 6, 7 ]
```



### 标签参数

使用函数来解析标签字符串，第一个参数是字符串值的数组，其余的参数为标签变量。

```js
function hd(str, ...values) {
  console.log(str); //[ 'js', '-', '=', '' ]
  console.log(values); //[ '人人做后盾', 'houdunren', 'demo' ]
}
let name = '人人做后盾',url = 'houdunren',kpi = 'demo';
hd `js${name}-${url}=${kpi}`;
```
