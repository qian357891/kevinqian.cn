## for in和for of

for循环不能直接用来遍历对象。

**for..in语句是一种严格的迭代语句，用于枚举对象中的非符号键属性(包括它的原型链上的可枚举属性**)，我们可以简单理解为它适合遍历对象。

```js
const obj = {name:'xiaohong',age:18};
for (const key in obj){
	console.log(obj[key])//遍历得到的是索引值
}//输出 xiaohong 18
```

**for...of语句是一种严格的迭代语句，用于遍历可迭代对象的元素。**

```js
const arr = [1,2,3];
for (const value of arr){
	console.log(value)//遍历得到的是值
}//输出 1 2 3
```



## instanceof

### 语法

```
object instanceof constructor
```

### 参数

- `object`

  某个实例对象

- `constructor`

  某个构造函数

**`instanceof`** **运算符**用于检测构造函数的 `prototype` 属性是否出现在某个实例对象的原型链上。

```js
let hd = [];
let hdmc = {};
console.log(hd instanceof Array);//true
console.log(hd instanceof Object);//true
console.log(hdmc instanceof Array);//true
console.log(hdmc instanceof Object);//true
```



## 模板字面量

在模板字面量中，${}中不仅可以写变量名，还可以调用函数和写表达式。

```js
function a(){
  return 'kunkun.com'
}
let s = `www.${a()}`;
console.log(s);//www.kunkun.com

let d = `www.${1+1}`;
console.log(d);//www.2
```

### 模板字面量的**嵌套**

```js
function a(){
  return 'kunkun.com'
}
let s = `www.${`123${a()}456`}`;
console.log(s);//www.123kunkun.com456
```

### tag标签

```js
let a = '秃头';
let b = 'tutou';

function tag(string,...vars){
  console.log(vars);
  console.log(string);
}
tag`中文${a},英文${b}`;
//输出[ '秃头', 'tutou' ]
//   [ '中文', ',英文', '' ]
```



## includes()方法

es6新增语法。

### 语法

```
string.includes(searchvalue, start)
```

### 参数值

| 参数          | 描述                                     |
| :------------ | :--------------------------------------- |
| *searchvalue* | 必需，要查找的字符串。                   |
| *start*       | 可选，设置从那个位置开始查找，默认为 0。 |

### 返回值

| 类型    | 描述                                            |
| :------ | :---------------------------------------------- |
| Boolean | 如果找到匹配的字符串返回 true，否则返回 false。 |

示例:

```js
const str = 'Hello world';
if (str.includes('llo')){
  console.log('找到了');
}//输出 '找到了'
```



## 电话号码模糊处理

```js
function phone(number, len = 3){
  return String(number).slice(0, -1*len)+'*'.repeat(len);
}
console.log(phone(123423487));//123423***
console.log(phone(123423487,5));//1234*****

function phone_(number, len = 7){
  return '*'.repeat(len)+String(number).slice(len-11);
}
console.log(phone_(13340307654));//*******7654
```



## Boolean隐式转换

如果用于if语句等**表达式**中，会将表达式中的值的类型转换为**布尔类型**。

数值类型除了0之外都为true，字符串类型除了 ‘’（空字符串）都是true。

其中，**引用类型（如数组，对象）转换为布尔类型，值都为true**。



如果不同类型的值进行**比较操作**，遵循下列基本规则：

1. 如果有一个操作数是布尔值，则在比较相等性之前先将其转换为数值——false转换为0，而true转换为1；
2. 如果一个操作数是字符串，另一个操作数是数值，在比较相等性之前先将字符串转换为数值；
3. 如果一个操作数是对象，另一个操作数不是，则调用对象的valueOf()方法，用得到的基本类型值按照前面的规则进行比较；

```js
let number = 1;
console.log(number === true);//flase
console.log(number == true);//true

let number_ = '11';
console.log(number_ == true);//flase 将true转换为1,11与1不相等

//数组
let arr = [];
console.log(Number(arr));// 0
console.log(arr == false);// true

let arrTwo = [2], arrTwo_ = [1];
console.log(Number(arrTwo));//2
console.log(Number(arrTwo_));//1
console.log(arrTwo == true);// flase
console.log(arrTwo_ == true);//true

let arrThree = [1,2,3];
console.log(Number(arrThree));//NaN
console.log(arrThree == true);//false

console.log([1,2,3] == [1,2,3]);//false 因为两边都会先转换为数值类型，都为NaN，而NaN不与任何数相等（包括NaN）
console.log({} == {});//false
```



## Number

在对于对象强制转换时，得到的值为NaN，但也有特例：

```js
console.log(Number({}));//输出NaN
console.log(Number(
  {
    valueOf: function(){
      return 99;
    } 
  }
));//输出99
```

定制小数的保留位数，toFixed()函数（四舍五入）：

```js
console.log((5.567).toFixed(2));//5.57
console.log((5.564).toFixed(2));//5.56
console.log((5.564).toFixed(1));//5.6
```



## Math

用Math内置对象实现，向上取整和向下取整，四舍五入。

```js
console.log(Math.ceil(5.11));//6
console.log(Math.floor(5.99));//5
console.log(Math.round(5.5));//6
console.log(Math.round(5.4));//5
```

**Math.random()** 函数返回一个浮点数， 伪随机数在范围从**0 到**小于**1**，

```js
console.log(Math.random());//输出0~1，左开右闭
console.log(Math.random()*8);//输出0~8，左开右闭
//要从0取到多少，就乘多少，左开右闭
console.log(5 + Math.floor(Math.random()*(10 - 5)));//输出5~10，左开右闭
```



### 随机点名

利用Math对象的random方法，和取整方法，来实现随机取数组元素。

```js
const stu = ['张三','李四','王五','钱六','赵七'];
let random = Math.floor(Math.random()*stu.length);
let random_2 = 2 + Math.floor(Math.random()*(stu.length - 2));
console.log(stu[random],random);//赵七 4  钱六 3
console.log(stu[random_2],random_2);//从'王五'（下标为2）开始点名。

//封装方法，传入数组，开始于第几个人（可选），结束于第几个人（可选）。返回名字
function arrayRandom(array, start = 1, end = array.length) {
  start--;//因为是传入的 开始于第几个人，而不是下标。所以需要减一。
  let index = start + Math.floor(Math.random()*(end - start));
  return array[index];
}
console.log(arrayRandom(stu,3,4));//只会输出'王五'和'钱六'。
```



## Date

Date()和new Date()返回的值都是当前的时间，但是Date()返回的是字符串，而new Date()返回的是对象。

```js
console.log(Date());//Sun Jun 26 2022 21:42:12 GMT+0800 (香港标准时间)
console.log(new Date());//2022-06-26T13:42:12.146Z
console.log(typeof(Date()));//string
console.log(typeof(new Date()));//object
```

Date() \*1为NaN   （new Date())*1为当前的时间戳

```js
console.log(Date()*1);//NaN
console.log((new Date())*1);//1656251038880   （输出时间戳）
```



利用console.time()和console.timeEnd()可以得到某段代码的运行时间

```js
console.time('for');
for (let index = 0; index < 100000; index++) {}
console.timeEnd('for');//输出 for: 1.555ms
```



### 封装一个格式化时间的函数

```js
const time = new Date();
function formatTime(time, format = 'YYYY-MM-DD HH:mm:ss'){
  let thisTime = {
    YYYY: time.getFullYear(),
    MM: time.getMonth() + 1,
    DD: time.getDate(),
    HH: time.getHours(),
    mm: time.getMinutes(),
    ss: time.getSeconds()
  }
  for (const key in thisTime) {
    format = format.replace(key, thisTime[key]);
  }
  return format;
}
console.log(formatTime(time));//2022-6-26 22:12:12
console.log(formatTime(time,'YYYY年MM月DD日 HH:mm:ss'));//2022年6月26日 22:14:7
```

