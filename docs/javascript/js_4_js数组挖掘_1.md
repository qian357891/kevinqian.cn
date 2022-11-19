## Array.of() 

创建一个具有可变数量参数的新数组实例，而不考虑参数的数量或类型

```JS
let cms = new Array(6);
console.log(cms.length);//6
console.log(cms);//[ <6 empty items> ] (六个空的数组元素)
let cmsl = Array.of(6);
console.log(cmsl.length);//1
console.log(cmsl);//6 (1个元素)
console.log(Array.of(1,2,3,4));//[ 1, 2, 3, 4 ]
```



## Array.from()

利用Array.from()拆分字符串或者对象为数组，字符串也可以用字符串的split()方法。

Array.from()方法返回一个新的**[`数组`]**实例。

当传入参数为一个对象时，必须要有length属性，以及键值要为数字（键值为返回数组的索引）。

### 语法

```js
Array.from(object, mapFunction, thisValue)
```

### 参数

| 参数          | 描述                                        |
| ------------- | ------------------------------------------- |
| *object*      | 必需，要转换为数组的对象。                  |
| *mapFunction* | 可选，数组中每个元素要调用的函数。          |
| *thisValue*   | 可选，映射函数(mapFunction)中的 this 对象。 |



```js
const str = 'sdfas';
console.log(Array.from(str));//[ 's', 'd', 'f', 'a', 's' ]
const obj = {
  0: 'xiaoming',
  1: 18,
  length: 2
}
console.log(Array.from(obj));//[ 'xiaoming', 18 ]
//对于对象，首先key要为数值，而且key要从0开始递增。其次得有length属性
console.log(Array.from([1, 2, 3], x => x + x));//[2, 4, 6]);
```



## ...  展开语法与剩余语法

对于字符串

```js
console.log(...'string');//s t r i n g
```

对于数组

```js
const array1 = ['dun','cmds'];
const array2 = ['fuck','luck','duck'];
const array3 = [...array1,...array2];
console.log(array3);
```



展开语法将数组展开为其中的各个元素，而剩余语法则是将多个元素收集起来并“凝聚”为单个元素。

对于函数，可以让函数的参数为不确定的个数

```js
function sum(...args) {
  let theSum = 0;
  for (const key in args) {
    theSum += args[key];
  }
  return theSum;
}
console.log(sum(5,5,4,3));//17
console.log(sum(5,5,4,3,9,6));//32
```



## 解构赋值

通过**解构赋值，**可以将属性/值从对象/数组中取出，赋值给其他变量。

**注意：**扩展运算符（`...`）只能出现在解构赋值中的末尾。

```js
let arr = ['xiaoxiao', 18];
let arr_ = ['xiaoxiao', 18, 'yuwen'];
let [name, age] = arr;
let [itemName, ...item] = arr_
console.log(name, age);//xiaoxiao 18
console.log(itemName, item);//xiaoxiao [ 18, 'yuwen' ]
console.log(itemName, ...item);//xiaoxiao 18 yuwen

let [theName, year] = ['不秃头'];
console.log(year);//undefined
let [theSecondName, secondYear = 2022] = ['bututou'];//可以设置默认值
console.log(secondYear);//2022
```

对于给函数传值

```js
function show([arg1,arg2]){
  console.log(arg1, arg2);
}
show(['houhou', 2020]);//houhou 2020
```



## 向数组添加元素

### 向数组的末尾添加元素

使用array.push()方法。

```js
function rangeArray(start, end){
  let array = [];
  for(let i = start; i <= end ; i++){
    array.push(Math.floor(start+Math.random()*(end-start+1)));
  }
  return array;
}
console.table(rangeArray(1,15));//一个由1~15构成的随机数组（15个元素）
```

使用array[index] 直接赋值

```js
let array = [1];
array[1] = 2;
array[2] = 3;
console.log(array);//[ 1, 2, 3 ]
```

### 向数组的开头添加元素

使用array.unshift() 方法。

```js
let arr = ['houhou','小小'];
arr.unshift(123);
arr.unshift(456);
console.log(arr);//[ 456, 123, 'houhou', '小小' ]
```



## 删除数组元素

shift()方法删除数组最开头的元素

```js
let arr = ['houhou','小小',123,'kk'];
arr.shift();
arr.shift();
console.log(arr);//[ 123, 'kk' ]
```

pop()方法删除数组最末尾的元素

```js
let arr = ['houhou','小小',123,'kk'];
arr.pop();
arr.pop();
console.log(arr);//[ 'houhou', '小小' ]
```

 

## Array fill()方法

fill() 方法用于将一个固定值替换数组的元素。

### 语法

```js
array.fill(value, start, end)
```

### 参数

| 参数    | 描述                                                         |
| :------ | :----------------------------------------------------------- |
| *value* | 必需。填充的值。                                             |
| *start* | 可选。开始填充位置(默认为0)                                  |
| *end*   | 可选。停止填充位置，第几个，而不是下标 (默认为 *array*.length) |



```js
let arr = ['houhou','小小',123,'kk'];
arr.fill('niubi',1,3);
console.log(arr);//[ 'houhou', 'niubi', 'niubi', 'kk' ]
```



## Array slice()方法和splice()方法

### slice()方法

`slice()` 方法以新的数组对象，返回数组中被选中的元素。

`slice()` 方法选择从给定的 *start* 参数开始的元素，并在给定的 *end* 参数处结束，但不包括。

**注释：**`slice()` 方法不会改变原始数组。

```js
let arr = ['houhou','小小',123,'kk'];
console.log(arr.slice(1,2));//[ '小小' ]
console.log(arr);//[ 'houhou', '小小', 123, 'kk' ]
```



### splice()方法

#### 语法

```
array.splice(index, howmany, item1, ....., itemX)
```

#### 参数值

| 参数                | 描述                                                         |
| :------------------ | :----------------------------------------------------------- |
| *index*             | 必需。整数，指定在什么位置添加/删除项目，使用负值指定从数组末尾开始的位置。 |
| *howmany*           | 可选。要删除的**项目数**。如果设置为 0，则不会删除任何项目。 |
| *item1, ..., itemX* | 可选。要添加到数组中的新项目，index为几，就从下标几开始添加（让array[index]=item，下标向后移）。 |

`splice()` 方法向/从数组添加/删除项目，并返回删除的项目。

**注释：**`splice()` 方法会改变原始数组。

```js
let arr = ['houhou','小小',123,'kk'];
console.log(arr.splice(1,2));//[ '小小', 123 ]
console.log(arr);//[ 'houhou', 'kk' ]

let array = [1,2,3,4,5];
let hd = array.splice(1,3, '添加一', '添加二');
//该步骤截取了array[1],array[2],array[3](从下标1开始，截取3个)，并且从下标1开始，向数组添加后面的元素。

console.log(hd);//[ 2, 3, 4 ]
console.log(array);//[ 1, '添加一', '添加二', 5 ]
```



## 数组元素交换位置

编写一个函数，传入数组，两个需要交换元素的下标。传出交换后的元素。

### 使用splice()方法

```js
let array = [1,2,3,4,5];
function move(array, from, to){
  //保证传入参数的可行性
  if (from <= 0 || to <= 0 || from > array.length || to > array.length){
    return '函数参数错误';
  }    
  let newArray = [...array];
  let fromItem = newArray.splice(from,1,newArray[to]);
  newArray.splice(to,1,...fromItem);
  return newArray;
}
console.log(move(array,1,3));//[ 1, 4, 3, 2, 5 ]
```



### 使用解构赋值

```js
let array = [1,2,3,4,5];
function move(array, from, to){
  //保证传入参数的可行性
  if (from <= 0 || to <= 0 || from > array.length || to > array.length){
    return '函数参数错误';
  }    
  let newArray = [...array];
  [newArray[from],newArray[to]] = [newArray[to],newArray[from]];
  return newArray;
}
console.log(move(array,1,3));//[ 1, 4, 3, 2, 5 ]
```



## 清空数组

### array = []

```js
let array = [1,2,3,4,5];
let newArray = array;
array = [];//会重新开辟一块内存空间，里面的值为[],并将array指向新内存空间。而newArray依然指向原内存空间，所以不会改变。
console.log(array);//[]
console.log(newArray);//[ 1, 2, 3, 4, 5 ]
```



### array.length = 0

```js
let array = [1,2,3,4,5];
let newArray = array;
array.length = 0;//直接改变原内存空间的值，所以两个数组都为空数组
console.log(array);//[]
console.log(newArray);//[]
```



## 数组的拆分和合并

数组拆分为字符串，字符串合并为数组

```js
let array = ['xiaoxiao','mingming'];
let str = array.toString();
console.log(str);//xiaoxiao,mingming
let hd = str.split(',');
console.log(hd);//[ 'xiaoxiao', 'mingming' ]
console.log(hd.join('-'));//xiaoxiao-mingming
```



### 使用...扩展运算符

```js
let array = [1,2,3,4,5];
let secondArray = ['xiaoxiao', 'mingming'];
array = [...array, ...secondArray];
console.log(array);//[ 1, 2, 3, 4, 5, 'xiaoxiao', 'mingming' ]
```



### 使用concat()方法

```js
let array = [1,2,3,4,5];
let secondArray = ['xiaoxiao', 'mingming'];
array = array.concat(secondArray);
console.log(array);//[ 1, 2, 3, 4, 5, 'xiaoxiao', 'mingming' ]
```



## 使用copyWithin() 方法 复制元素

### 语法

```
array.copyWithin(target, start, end)
```

### 参数

| 参数     | 描述                                                         |
| :------- | :----------------------------------------------------------- |
| *target* | 必需。复制到指定目标索引位置。                               |
| *start*  | 可选。元素复制的起始位置。                                   |
| *end*    | 可选。停止复制的索引位置 (默认为 *array*.length)。如果为负值，表示倒数。(左开右闭) |

例如：

```js
let array = [1,2,3,4,5,6];
array.copyWithin(3,0,2);
console.log(array);//[ 1, 2, 3, 1, 2, 6 ]
```



## 数组的查找

### indexOf()方法 和 lastIndexOf()方法

#### 语法

```js
stringObject.indexOf(searchvalue,fromindex)
stringObject.lastIndexOf(searchvalue,fromindex)
```

| 参数        | 描述                                                         |
| :---------- | :----------------------------------------------------------- |
| searchvalue | 必需。规定需检索的字符串值。                                 |
| fromindex   | 可选的整数参数。规定在字符串中开始检索的位置。它的合法取值是 0 到 stringObject.length - 1（以及负的整数，相对于“倒数第几个元素”）。如省略该参数，则将从字符串的首字符开始检索。 |

查找对应元素的值的下标，返回按顺序查找到的**第一个元素的下标**。如果没有该元素，返回**-1**。严格类型查找。

indexOf()方法从左到右查找（从前到后） ， lastIndexOf()方法从右往左查找（从后往前）

```js
let arr = [1,2,3,4,5,6,4];

console.log(arr.indexOf(4));//3
console.log(arr.indexOf(-8));//-1
console.log(arr.indexOf(4,2));//3
console.log(arr.indexOf(4,4));//6
console.log(arr.indexOf(4,-1));//6
console.log(arr.indexOf(4,-5));//3


console.log(arr.lastIndexOf(5));//4
console.log(arr.lastIndexOf(-8));//-1
```



### includes()方法

返回真与假，严格类型查找。

```js
let arr = [1,2,3,4,5,6,'0'];
console.log(arr.includes(2));//true
console.log(arr.includes('0'));//true
console.log(arr.includes(0));//false
console.log(arr.includes(7));//false

//按照indexOf()的写法
if (arr.indexOf(2) !== -1) {
  console.log('找到了');
}//找到了

//按照includes()的写法
if (arr.includes(2)) {
  console.log('找到了');
}//找到了
```



## Array.find()和Array.findIndex()

对于引用类型，不能使用includes() indexOf()等方法查找，因为引用类型查找时，要看是否为同一内存空间。

如：

```js
let [a,b] = [1,1]
console.log(a===b);//true

let [arr1,arr2] =[[],[]];
console.log(arr1===arr2);//false

let [obj1,obj2] =[{},{}];
console.log(obj1===obj2);//false
```



**`find()` **方法返回数组中满足提供的测试函数的第一个元素的值。否则返回 **undefined**。

**`findIndex()` **方法返回索引值，否则返回**-1**。

```js
let lessons = [{name:'js'},{name:'ts'},{name:'nest'}];
console.log(lessons.find(item => item.name === 'js'));//{ name: 'js' }
console.log(lessons.find(item => item.name === 'go'));//undefined
console.log(lessons.findIndex(item => item.name === 'nest'));//2
console.log(lessons.findIndex(item => item.name === 'rust'));//-1
```

