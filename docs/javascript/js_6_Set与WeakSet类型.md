## Set（集合）

### Set的创建

用于存储任何类型的唯一值，无论是基本类型还是对象引用。

- 只能保存值没有键名
- 严格类型检测如字符串数字不等于数值型数字
- 值是唯一的
- 遍历顺序是添加的顺序，方便保存回调函数

new Set()可以传入数组，返回一个类似于数组的对象。对象中的元素的值都是唯一的（相同值会被过滤）

```js
let arr = new Set([1,2,3,1,1,2,3,4]);
console.log(arr);//Set(4) { 1, 2, 3, 4 }
arr.add(5);
arr.add(5);
console.log(arr);//Set(6) { 1, 2, 3, 4, 5, '5' }
console.log(typeof arr);//object
```



### Set的基本 方法/属性

```js
let set = new Set(['xiaoming','xiaohong','xiaobai','xiaohei']);

//获取元素数量
console.log(set.size);//4

//删除指定元素，有指定元素返回true，没有则返回false
console.log(set.delete('xiaoming'));//true
console.log(set.delete('xiaoxiao'));//false
console.log(set.size);//3

//查询是否有该元素，返回布尔值
console.log(set.has('xiaohei'));//true

//清除所有元素
set.clear();
console.log(set.size);//0
```



### Set与Array的类型转换

有时候我们需要Set与Array类型相互转换，来借助相互的类型的方法或者特性。从而实现需求。

```js
let set = new Set([1,2,3,4,5,6,7,8,9]);
//Set借助Array的filter来实现过滤大于5的数字
arr = [...set].filter( item => item <= 5);
console.log(set);//Set(9) { 1, 2, 3, 4, 5, 6, 7, 8, 9 }
set = new Set(arr)
console.log(arr);//[ 1, 2, 3, 4, 5 ]
console.log(set);//Set(5) { 1, 2, 3, 4, 5 }

//Array借助Set的唯一值的特性来过滤相同值的元素
let arr1 = [1,2,3,3,2,1,4];
let set1 = new Set(arr1);
console.log(set1);//Set(4) { 1, 2, 3, 4 }
arr1 = Array.from(set1);
console.log(arr1);//[ 1, 2, 3, 4 ]
```



### Set的遍历

Set的遍历与数组类似.

Set使用 `keys()/values()/entries()` 都可以返回迭代对象，因为`set`类型只有值所以 `keys与values` 方法结果一致。

```js
let set = new Set(['xioaming','xiaohong']);
console.log(set.keys());//SetIterator {'xioaming', 'xiaohong'}
console.log(set.values());//SetIterator {'xioaming', 'xiaohong'}
console.log(set.entries());//SetIterator {'xioaming' => 'xioaming', 'xiaohong' => 'xiaohong'}
```

使用forEach和for/of遍历

```js
let set = new Set([1,2,3,4,5]);
set.forEach((value,key) => console.log(value,key));//value与key相等

for (const value of set) {
  console.log(value);
}
```



### Set的一些实际运用

可以用来收集用户在搜索框内提交的关键词，然后可以用里面的一些作为热门关键词

```html
<body>
  <input type="text">
  <ul></ul>
  <script>
    let obj = {
        words: new Set(),
        keyword(word) {
            this.words.add(word);
        },
        show() {
            let ul = document.querySelector('ul');
            ul.innerHTML = '';
            this.words.forEach((item) => {
                ul.innerHTML += ('<li>' + item + '</li>');
            })
        }
    }
  
    document.querySelector('input').addEventListener('blur', function () {
        obj.keyword(this.value);
        obj.show();
    });
  </script>
</body>
```



### Set处理并集 交集 差集

在实际开发中，可能会需要将两个用户的共同爱好或者不同爱好提取出来。这时候我们可以用Set来进行处理。

```js
let a = new Set([1,2,3,4,5]);
let b = new Set([4,5,1,9]);

//并集
console.log(new Set([...a,...b]));//Set(6) { 1, 2, 3, 4, 5, 9 }
//交集
console.log(
  Array.from(a).filter( value => b.has(value) )//[ 1, 4, 5 ]
);
//差集
console.log(
  Array.from(a).filter( value => !b.has(value) )//[ 2, 3 ]
);
```



## WeakSet（弱集）

### WeakSet的创建

WeakSet结构同样不会存储重复的值，它的成员必须只能是对象类型的值。

- 垃圾回收不考虑WeakSet，即被WeakSet引用时引用计数器不加一，所以对象不被引用时不管WeakSet是否在使用都将删除
- 因为WeakSet 是弱引用，由于其他地方操作成员可能会不存在，所以不可以进行`forEach( )`遍历等操作
- 也是因为弱引用，WeakSet 结构没有keys( )，values( )，entries( )等方法和size属性
- 因为是弱引用所以当外部引用删除时，希望自动删除数据时使用 `WeakMap`

通过`new WeakSet()`进行声明，如果有初值的时候，注意**值**必须是引用类型（Object 或者继承自 Object 的类型）,否则会报错。

```js
// console.log(new WeakSet('asdf'));//WeakSret is not defined
// console.log(new WeakSret(['qwer','asdf']));
//WeakSret is not defined 这里虽然看上去是传入的是一个数组，但是传入构造函数的是两个字符串
console.log(new WeakSet());
```



### WeakSet的 基本方法/属性

```js
let obj1 = {age:18};
let weak = new WeakSet([obj1]);//传入一个含有obj对象的元素
let obj2 = {age:16};
//添加
weak.add(obj2);
//查询
console.log(weak.has(obj2));//true
console.log(weak.has(obj1));//true
//删除
weak.delete(obj1);
console.log(weak);
```



### js垃圾回收与WeakSet

在js中，如果一个内存空间没有被引用。则会被js垃圾回收机制删除内存空间。

```js
let obj = {
  name: 'xiaoming'
}
console.log(obj);//{ name: 'xiaoming' }
obj = null;//让该对象不指向任何内存空间（当前obj未设置值）
console.log(obj);//null 这时候 {name: 'xiaoming'}没有被引用，js就会对该内存空间进行垃圾回收
```



```js
let obj1 = {age:18};
let arr = ['qwer'];
//如果直接向里面传值，而不是值的引用，打印WeakSet时无法读到值。
//因为开辟的内存空间没有被引用，被js的垃圾回收机制清理了
let weak = new WeakSet([obj1,arr,['asdf']]);
let obj2 = {age:16};
obj1 = {};//obj指向了新的内存空间
obj1 = {age:18};//这里的{age:18}与原来的不是同一个内存空间
weak.add(obj2);
console.log(weak.has(obj2));//true
console.log(weak.has(obj1));//false
// weak.delete(obj1);
console.log(weak);
setTimeout(() => {
console.log(weak);
}, 1000);
```



在打印的WeakSet中可以看到：WeakSet认为里面有四个值，但实际上只有两个值。而出现这种情况的原因是：WeakSet里面的值因为没有被引用（垃圾回收不考虑WeakSet），所以实际上已经被进行垃圾回收了。可以看到下面延迟打印的WeakSet里面就只有被引用的值。



**实践应用场景为储存DOM元素**
