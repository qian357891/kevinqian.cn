## Map
### Map的声明

Map是一个对象，他的键名可以为对象。普通对象的键名只能为字符串。

```js
let map1 = new Map();
//添加一个键值对
map1.set({},'obj');
console.log(map1);
let map2 = new Map([[{name: 'objNew'},'objNew'], [[1,2,3],'123']]);
//Map(1) { {} => 'obj' }

console.log(map2);
//Map(2) { { name: 'objNew' } => 'objNew', [ 1, 2, 3 ] => '123' }
```

使用构造函数`new Map`创建Map对象，实际上是在对数组进行遍历。

```js
let map = new Map();
let arr = [[{},'obj'],[[1,2,3],123]];
arr.forEach(([key,value]) => {
  map.set(key,value);
});
console.log(map);//Map(2) { {} => 'obj', [ 1, 2, 3 ] => 123 }
```

对于键是对象的`Map`， 键保存的是内存地址，值相同但内存地址不同的视为两个键。

```js
let obj = {name: 'objNew'};
let map = new Map([[obj,'objNew'], [[1,2,3],'123']]);
console.log(map.has({name: 'objNew'}));//false
console.log(map.has(obj));//true
```





### Map的增删查

- 使用set方法添加元素（支持链式操作）。

- 使用delete删除元素。

- 使用has查找元素是否存在。
- 使用size查询元素个数。

- 使用get获取元素的值。
- 使用clear方法清除所有元素。

```js
let obj = {name: 'objNew'};
let map = new Map([[obj,'objNew'], [[1,2,3],'123']]);
//添加
map.set({},'123').set({age: 18},18);
//查询元素个数
console.log(map.size());//4
console.log(map);
// Map(4) {
//   { name: 'objNew' } => 'objNew',
//   [ 1, 2, 3 ] => '123',
//   {} => '123',
//   { age: 18 } => 18
// }

//查找元素是否存在
console.log(map.has({name: 'objNew'}));//false
console.log(map.has(obj));//true
//获取元素的值
console.log(map.get({name: 'objNew'}));//undefined
console.log(map.get(obj));//objNew
//清除所有元素
map.clear();
console.log(map);//Map(0) {}
```



### Map的遍历

使用 `keys()/values()/entries()` 都可以返回可遍历的迭代对象。

```js
let map = new Map([[{age: 18}, 18],['xiaoming',20]]);
console.log(map.keys());//[Map Iterator] { { age: 18 }, 'xiaoming' }
console.log(map.values());//[Map Iterator] { 18, 20 }
console.log(map.entries());//[Map Entries] { [ { age: 18 }, 18 ], [ 'xiaoming', 20 ] }
```



使用`for/of`遍历操作

```js
let map = new Map([[{age: 18}, 18],['xiaoming',20]]);

for (const key of map.keys()) {
  console.log(key);
}
// { age: 18 }
// xiaoming

for (const value of map.values()) {
  console.log(value);
}
// 18
// 20

for (const [key, value] of map) {
  console.log(key,value);
}
// // { age: 18 } 18
// // xiaoming 20
```



使用`forEach`遍历操作

```js
let map = new Map([[{age: 18}, 18],['xiaoming',20]]);

map.forEach((value,key) => {
  console.log(value,key);
});
// 18 { age: 18 }
// 20 xiaoming
```



### Map的类型转换

Map可以用展开语法将其转换为数组，然后进而使用数组的方法。然后再用new Map()传值得到新的Map。

 ```js
 let map = new Map([['cxk.com','鸡你太美'],['夜曲','周杰伦'],['最伟大的作品','周杰伦']]);
 let newArr = [...map].filter( item => {
   return item[1].includes('周杰伦');
 })
 console.log(newArr);//[ [ '夜曲', '周杰伦' ], [ '最伟大的作品', '周杰伦' ] ]
 
 let newMap = new Map(newArr);
 console.log(newMap);//Map(2) { '夜曲' => '周杰伦', '最伟大的作品' => '周杰伦' }
 console.log(...newMap.keys());//夜曲 最伟大的作品
 ```



### DOM操作时对Map的使用

```html
<body>
	<div name="zjl">最伟大的作品</div>
	<div name="xzq">你还要我怎样</div>
	<script>
		let map = new Map();
		document.querySelectorAll('div').forEach( item => {
			map.set(item, {
				name: item.getAttribute('name')//在map中遍历添加的元素中 key为div节点对象，value为div的name
			});
		});
		console.log(map);		
		map.forEach((config, element) => {
			element.addEventListener('click', ()=>{
				alert(config.name)//点击div时 弹窗显示点击的div的name
			})
		})
</script>
</body>
```

 实例操作，提交表单，需要同时勾选两个选项若没勾就禁止提交，没勾哪个选项就弹出提示。

```html
<body>
    <!-- onsubmit="return sub()"中只有return true才能提交表单-->
	<form action="" onsubmit="return sub()">
		接受协议：
		<input type="checkbox" name="agreement" message="请同意协议">
		我是学生：
		<input type="checkbox" name="student" message="网站只对学生开放">
		<input type="submit">
	</form>
	<script>
		function sub(){
			let map = new Map();
			let input = document.querySelectorAll('[message]');
			input.forEach(node =>{
				map.set(node,{
					error: node.getAttribute('message'),
					status: node.checked
				});
			});
			return [...map].every( ([node,message]) => {
                //如果message.status为true（勾选），message.status为true，
                //如果message.status为false（没勾选），message.status为alert(message.error)
				message.status || alert(message.error);//利用逻辑短路来简化if语句
				return message.status;
			})
		}
	</script>
</body>
```



## WeakMap

**WeakMap** 对象是一组键/值对的集

- 键名必须是对象
- WeaMap对键名是弱引用的，键值是正常引用

- 垃圾回收不考虑WeaMap的键名，不会改变引用计数器，键在其他地方不被引用时即删除
- 因为WeakMap 是弱引用，由于其他地方操作成员可能会不存在，所以不可以进行`forEach( )`遍历等操作
- 也是因为弱引用，WeaMap 结构没有keys( )，values( )，entries( )等方法和 size 属性
- 当键的外部引用删除时，希望自动删除数据时使用 `WeakMap`

### WeakMap的基本使用

将DOM节点保存到`WeakSet`

```html
<body>
  <div>houdunren</div>
  <div>hdcms</div>
</body>
<script>
  const hd = new WeakMap();
  document
    .querySelectorAll("div")
    .forEach(item => hd.set(item, item.innerHTML));
  console.log(hd); //WeakMap {div => "hdcms", div => "houdunren"}
</script>
```

WeakMap的增删查

```js
let weakMap = new WeakMap();
let arr = [1,2,3];
//添加
weakMap.set(arr,'arr');
console.log(weakMap);
//检索
console.log(weakMap.has(arr));
//删除
weakMap.delete(arr);
console.log(weakMap);
```



### WeakMap与垃圾回收

与WeakSet相似，他们都是弱引用。键名对象不会增加引用计数器，如果一个对象不被引用了会自动删除。

```js
let map = new WeakMap();
let hd = {};
map.set(hd, "hdcms");
hd = null;
console.log(map);//WeakMap {{...} => 'hdms'} 实际上里面是空的

setTimeout(() => {
  console.log(map);//WeakMap {}  延迟打印，系统检测到后，就不会出现这个问题了
}, 1000);
```



**实践应用场景为储存DOM元素和私有变量**
