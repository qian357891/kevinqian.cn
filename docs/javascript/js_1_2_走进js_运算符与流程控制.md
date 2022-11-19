## 前端访问流程

前端的代码是在**浏览器运行**的，而服务器只是相当于一个**文件托管**（在在不进行服务端渲染的情况下）。



## 作用域

作用域不同可以声明相同的变量名，如：

```js
const a = 'qwer';
function add() {
    const a = 'zxcv';
}
```

可以正常运行



## 变量的声明

在声明变量时，js会开辟一个内存空间。

```js
const a = 'qwer';
const a = 'asdf';//报错
let b = 'zxcv';
let b = 'dfgh';//报错
var c = 'jjj';
var c = 'ggg';//不会报错
```

这里a指向的是`字符串qwer`的内存空间，而再次声明（同一作用域），则会让变量名指向**新的内存空间**，而对于**const**和**let**是不允许的，用**var**可以。 



对于Number，String等原始类型，让变量1赋值给变量2，会直接开辟一块新的内存空间。当变量1中内存空间的值改变，不会引起变量2的值的改变。

对于Object引用类型，让变量1赋值给变量2，变量2会指向变量1的内存空间，当变量1的值发生改变时，变量2的值也会改变（浅拷贝）。

```js
let numOne = 1;
let numTwo = numOne;
numOne = 2;
console.log(numOne); //2
console.log(numTwo); //1

const a = { name: 'xiaozhou' };
const b = a;
b.name = 'xiaoming';
console.log(a); //{name:xiaoming}
console.log(b); //{name:xiaoming}
```



## Object.freeze()

对于对象，就算const声明对象，但还是可以更改对象属性。

如果不想让对象的属性被修改，可以使用Object.freeze()方法。

```js
const Host_ = {
  url: 'xiaoxiao',
  port: '3000',
};

Object.freeze(Host_);
Host_.port = '80';
console.log(Host_);
```



## const&let暂时性死区TDC

var，let，const都能在编译时进行**变量提升**，但只有var会把值初始化为undefined。

```
console.log(a);//undefined
console.log(b);//报错
console.log(c);//报错
var a = 1;
let b = 2;
const c = 3;
console.log(a);//1
console.log(b);//2
console.log(c);//3
```



## window全局对象

如window.name是窗口名称，如果用var声明变量，可能会覆盖掉window全局对象的属性。



## 函数默认值

**ES6**开始已经支持默认参数了

```js
function multiply(a, b = 1) {
  return a*b;
}

multiply(5); // 5
```



## ES6原生选择器

### 1.querySelector

```js
element = document.querySelector(selectors);
```

element 是一个 **element**对象（DOM 元素）。
selectors 是一个字符串，包含一个或是多个 **CSS 选择器** ，多个则以逗号分隔。
找到一个后立刻返回找到的第一个节点对象，如果没有则返回null

### 2.querySelectorAll

```js
var matches = document.querySelectorAll("div.note, div.alert");
```

找出所有匹配的节点后，返回对应的元素节点数组



## js的一些运算上特性

在给变量赋值时使用逻辑运算符：**或||**的时候，会将为真（非0）的值，赋值给变量。

```js
let a = 0;
let b = 2;
let f = b || a;
let g = a || b;
console.log(f); //2
console.log(g); //2
```

可以利用这个特性赋值

```js
let sex =  prompt('输入数据')|| '保密' ;//'保密'是真
console.log(sex);//输入内容非空时（真）,将输入的内容赋值给sex。若为空，则赋值“保密”

// es6中可以用函数参数默认值来实现
function copy(num) {
  return '*|'.repeat(num || 5);
}
console.log(copy(3));// 输出*|*|*|（复制三次）
console.log(copy());// 输出*|*|*|*|*|（复制五次）
```



## 原生js的弹窗

alert() 弹出个提示框 （确定） 
confirm() 弹出个确认框 （确定，取消） 
prompt() 弹出个输入框 让你输入东西



## es6中的repeat()

string.repeat () 方法**通过将给定字符串复制并连接指定次数来返回一个新字符串**。参数为复制的次数。

```js
const s = '*|';
function copy(num) {
  console.log(s.repeat(num));
}
copy(3);// 输出*|*|*|（复制三次）
```



## es6对象赋值（对象的解构赋值）

```js
const obj = {name:'xiaozhou', age:'18',weight:'60'};
const {name,age,weight} = obj;//对象的解构赋值
const obj1 = {name,age,weight} = obj;//连等是从右往左执行的
console.log(name,age,weight);//xiaozhou 18 60
console.log(obj1);//{ name: 'xiaozhou', age: '18', weight: '60' }
```

