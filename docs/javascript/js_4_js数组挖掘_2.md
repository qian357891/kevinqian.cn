## 数组排序

### sort()排序

```js
let a = [1,3,5,8,2];
arr = a.sort(function(a,b){
  return a-b;
})
console.log(arr);//[ 1, 2, 3, 5, 8 ]

let buy = [
  {name:'oppo',price:2000},
  {name:'iPhone',price:8000},
  {name:'vivo',price:2500},
]
console.log(buy.sort(function(a,b){
  return b.price-a.price;
}));
// ┌─────────┬──────────┬───────┐
// │ (index) │   name   │ price │
// ├─────────┼──────────┼───────┤
// │    0    │ 'iPhone' │ 8000  │
// │    1    │  'vivo'  │ 2500  │
// │    2    │  'oppo'  │ 2000  │
// └─────────┴──────────┴───────┘
```



## 数组循环

### for/in

```js
let arr = [1,3,5,8,2];
for (const index in arr) {
  arr[index]+=10;
}
console.log(arr);//[ 11, 13, 15, 18, 12 ]
```

### for/of

**对于引用类型，可以在for/of中改变值，因为为同一内存空间。值类型不行。**

for/of只能用来遍历iterable（可迭代类型）

```js
let arr = [{name:'demo'},{name:'node'},{name:'nest'}];
for (const value of arr) {
  value.name = `添加${value.name}`;
}
console.log(arr);//[ { name: '添加demo' }, { name: '添加node' }, { name: '添加nest' } ]
```

### forEach()

```js
const array = [{name:'demo'},{name:'node'},{name:'nest'}];
array.forEach((element,index,array) => {
  // console.log(array); 循环输出n(数组元素个数)次原数组
  console.log(element.name.substr(0,2));
    //输出de
    //no
    //ne
    
  // console.log(array[index].name.substr(1,3)); 
    //输出
    //emo
    //ode
    //est
});
```



## Iterator迭代器

Array.keys()和Array.values()返回的都是Object [Array Iterator] {}  一个数组迭代器对象

迭代器是通过使用 `next()` 方法实现 *Iterator protocol*的任何一个对象，该方法返回具有两个属性的对象： `value`，这是序列中的 next 值；和 `done` ，如果已经迭代到序列中的最后一个值，则它为 `true` ，反之为`false`。如果 `value` 和 `done` 一起存在，则它是迭代器的返回值。

Array.entries()可以看做是keys()和values()方法的组合

```js
let arr = [1,2];
let keys = arr.keys();
console.log(keys.next());//{ value: 0, done: false }
console.log(keys.next());//{ value: 1, done: false }
console.log(keys.next());//{ value: undefined, done: true }

let arr1 = ['demo','nest'];
let keys1 = arr1.values();
let {value,done} = keys1.next();//使用对象的解构赋值
console.log(value,done);//demo false

let arr = ['小白','小黑'];
console.log(arr.entries().next());//{ value: [ 0, '小白' ], done: false }
```

对于迭代器，有专门的for/of来进行循环操作

```js
let arr = ['小白','小黑'];
for (const value of arr) {
  console.log(value);//循环输出 小白 小黑
}

for (const keys of arr.keys()) {
  console.log(keys);
  //输出
  //0
  //1
}

for (const [key, value] of arr.entries()) {
  console.log(key, value);
  //输出
  //0 '小白'
  //1 '小黑'
}
```



## every()和some()

`every()` 方法用于检测数组所有元素是否都符合指定条件（通过函数提供）。

`every()` 方法使用指定函数检测数组中的所有元素：

- 如果数组中检测到有一个元素不满足，则整个表达式返回 `false`，且剩余的元素不会再进行检测
- 如果所有元素都满足条件，则返回 `true`。

```js
let key = ['js','node'];
let every1 = key.every(item => {
  console.log(item);
  return true;
});
console.log(every1);
//输出
//js
//node
//true

let every2 = key.every(item => {
  console.log(item);
  return false;
});
console.log(every2);
//输出
//js
//false
```



`some()` 方法用于检测数组中的元素是否满足指定条件（函数提供）。

`some()` 方法会依次执行数组的每个元素：

- 如果有一个元素满足条件，则表达式返回`true`, 剩余的元素不会再执行检测。
- 如果没有满足条件的元素，则返回`false`。

```js
let key = ['js','node'];
let every1 = key.some(item => {
  console.log(item);
  return true;
});
console.log(every1);
//输出
//js
//false

let every2 = key.some(item => {
  console.log(item);
  return false;
});
console.log(every2);
//输出
//js
//node
//true
```



可以用于输入内容是否含有部分或者全部**关键词**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <input type="text" name="title">
  <span></span>
  <script>
    let key = ['js','node'];
    let title = document.querySelector('[name="title"]');
    title.addEventListener('keyup',function(){
      const res = key.some(keyword => this.value.includes(keyword));
      document.querySelector('span').innerHTML = res?'':'必须包含js,node关键词'
    });
  </script>
</body>
</html>
```



## 数组的filter过滤器

可以用来过滤数组中的指定元素，来生成一个符合要求的新数组

```js
let arr = [
  {title:'js', category:'弱类型'},
  {title:'pyton', category:'弱类型'},
  {title:'ts', category:'强类型'}
];
const newArr = arr.filter(arr => arr['category'] === '弱类型');
console.log(newArr);
// [
//   { title: 'js', category: '弱类型' },
//   { title: 'pyton', category: '弱类型' }
// ]
```



自定义过滤函数

```js
let arr = [1,2,3,4,5];
function filter(arr,callback){
  let newArr = [];
  for (const value of arr) {
    if(callback(value)) {//这里调用传入函数，实参为遍历的value
      newArr.push(value);
    }
  }
  return newArr;
}
console.log(filter(arr,function(value){
  return value > 2;
}));//[ 3, 4, 5 ]
```



## 数组的map映射

map()中的参数为一个函数（必选），函数参数依然为value（必选），index（可选），arr（可选）。

map()返回一个新数组， 不会改变原数组。

```js
let arr = [
  {title:'js', category:'弱类型'},
  {title:'pyton', category:'弱类型'},
  {title:'ts', category:'强类型'}
];

let newArray = arr.map( (value,index,arr)=>{
  return  {
    title: `ham - ${value.title}`,
    category: `ham = ${value.category}`,
    click: 100
  };
})
console.log(arr);
// [
//   { title: 'js', category: '弱类型' },
//   { title: 'pyton', category: '弱类型' },
//   { title: 'ts', category: '强类型' }
// ]

console.log(newArray);
// [
//   { title: 'ham - js', category: 'ham = 弱类型', click: 100 },
//   { title: 'ham - pyton', category: 'ham = 弱类型', click: 100 },
//   { title: 'ham - ts', category: 'ham = 强类型', click: 100 }
// ]
```



## reduce()方法

### reduce()基本用法

参数为 一个函数func（必选），初始值initialValue（可选）。func的参数为  上一个返回值previousValue（必选），当前值currentValue（必选），currentIndex（可选），arr（可选）。

若指定了初始值 `initialValue`，则 `currentValue` 则将使用数组第一个元素；否则 `previousValue` 将使用数组第一个元素，而 `currentValue` 将使用数组第二个元素（这个时候循环次数将会少一次）。 

```js
let arr = [1,2,3,4,5];
function func(arr){
  return arr.reduce((pre,cur,index,arr)=>{
      console.log(pre,cur);
      return cur;//返回cur，则pre为上一轮的cur
  },0)//设置pre的初始值，能够循环5（length）次。
}

func(arr);
// 输出
// 0 1
// 1 2
// 2 3
// 3 4
// 4 5
```



### 使用reduce()来取最大元素

```js
let arr = [1,2,3,2,2,4];

function func1(arr){
  return arr.reduce((pre,cur)=>{
      return pre > cur ? pre : cur;
  })
}

console.log(func1(arr));// 4
```



### 使用reduce()方法来进行计数

写一个函数传入数组和数字，查找元素值为该数字的个数

```js
let arr = [1,2,3,2,2];

function func2(arr,num){
  let total = 0;
  return arr.reduce( (pre,value) => {
    return total += num === value? 1 : 0;
  } )
}
console.log(func2(arr,2));//3
```



### reduce()解决购物车问题

#### 求购物车的商品总价

```js
let car = [
  {name: '笔记本电脑', price: 4000},
  {name: '台式电脑', price: 3500},
  {name: '显示屏', price: 800},
];
function totalPrice(arr){
  let total = 0;
  return arr.reduce((preObj,curObj)=>{
    return total += curObj['price'];
  },0)//需要设置pre初始值为0，cur就会从第一项开始取
}
console.log(totalPrice(car));//8300
```



#### 按照价格过滤商品

并且输出商品名称

```js
let car = [
  {name: '笔记本电脑', price: 4000},
  {name: '台式电脑', price: 3500},
  {name: 'iPhone', price: 10500},
  {name: 'imac', price: 12500},
  {name: '显示屏', price: 800},
];
function filterGoods(arr,price){
  return arr
    .reduce((newArr,curObj)=>{
    if (curObj.price>price) newArr.push(curObj);
    return newArr;
  },[])
    .map(item => item.name);
}
console.log(filterGoods(car,10000));//[ 'iPhone', 'imac' ]
```



#### 去除重复的商品

```js
let car = [
  {name: '笔记本电脑', price: 4000},
  {name: '台式电脑', price: 3500},
  {name: '台式电脑', price: 3500},
  {name: '显示屏', price: 800},
  {name: '显示屏', price: 800}
];
function filterGoods(arr){
  return arr.reduce((newArr,curObj)=>{
    let find = newArr.find( v => v.name === curObj.name );
    if (!find) newArr.push(curObj);
    return newArr;
  },[])
}
console.log(filterGoods(car));
// 输出
// [
//   { name: '笔记本电脑', price: 4000 },
//   { name: '台式电脑', price: 3500 },
//   { name: '显示屏', price: 800 }
// ]
```

