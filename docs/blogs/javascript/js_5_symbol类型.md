## symbol类型的创建

用于创建一个独一无二的数据，创建时不能使用new，Symbol()括号里面为描述内容（可选）。

```js
let a = Symbol();
let b = Symbol();
console.log(typeof a);//symbol
console.log(a);//Symbol()
console.log(typeof b);//symbol
console.log(b);//Symbol()
console.log(a===b);//false

let cart = Symbol('购物车');
let goods = Symbol('购物车')
console.log(typeof cart);//symbol
console.log(cart);//Symbol(购物车)
console.log(typeof goods);//symbol
console.log(goods);//Symbol(购物车)
console.log(cart===goods);//false
```

同时，Symbol()不能添加属性

```js
let hd = Symbol();
hd.name = "xiaoming";
console.log(hd.name);//undefined
```

注意：symbol类型不能参与运算（不能转换为数值），但是可以转换为布尔值

```js
let sb = Symbol();
// console.log(1+sb);//error：Cannot convert a Symbol value to a number
console.log(Boolean(sb));//true
```





## Symbol().description 属性

不能向symbol类型添加属性，但我们可以使用symbol类型的description属性来获取声明symbol的描述。

```js
let hd = Symbol("连连看");
console.log(hd.description); //连连看
```



## Symbol.for()

根据描述获取Symbol，如果不存在则新建一个Symbol （这个时候，相同描述的symbol为同一symbol）

- 使用Symbol.for会在系统中将Symbol登记
- 使用Symbol则不会登记

```js
let a = Symbol.for('cxk');
let b = Symbol.for('cxk');
console.log(a === b);//true
```



## Symbol.keyFor()

获取使用Symbol.for()创建的symbol的描述。

```js
let a = Symbol.for('cxk');
console.log(Symbol.keyFor(a));//cxk

let b = Symbol("连连看");
console.log(Symbol.keyFor(b)); //undefined
```



## 作为对象属性

Symbol 是独一无二的所以可以保证对象属性的唯一。

- Symbol 声明和访问使用 `[]`（变量）形式操作
- 也不能使用 `.` 语法因为 `.`语法是操作字符串属性的。

如果不用使用 `[]`（变量）形式操作，则会将`symbol` 当成字符串`symbol`处理

```js
let theSymbol = Symbol('连连看');
let obj = {
  category: '小游戏',
  [theSymbol]: 'llk'
}
console.log(obj[theSymbol]);//llk

let theSymbol1 = Symbol('撸啊撸');
let obj1 = {
//会将theSymbol1当成普通字符串处理，这时候Symbol的唯一性起不了作用
  theSymbol1: 'lol'
}
console.log(obj1.theSymbol1);//lol
```



## 实际操作

### 解决同名属性被覆盖

```js
let grade1 = {
  李四: {js: 90,ts:85},
  李四: {js: 60,ts:55}
}
console.log(grade1);
//{ '李四': { js: 60, ts: 55 } }只会输出一个李四，后面的将前面同名的李四覆盖掉了

let grade2 = {
  [Symbol('李四')]: {js: 90,ts:85},
  [Symbol('李四')]: {js: 60,ts:55}
}
console.log(grade2);
//{ [Symbol(李四)]: { js: 90, ts: 85 }, [Symbol(李四)]: { js: 60, ts: 55 } }
//由于symbol的唯一性，所以不会被覆盖


let stu1 = {
  name: '李四',
  key: Symbol('第一个')
}

let stu2 = {
  name: '李四',
  key: Symbol('第二个')
}

let grade3 = {
  [stu1.key]: {js: 90, ts: 85},
  [stu2.key]: {js:60, ts: 55}
}
console.log(grade3[stu1.key],grade3[stu2.key]);
//{ js: 90, ts: 85 } { js: 60, ts: 55 }
```

### 缓存操作

使用`Symbol`可以解决在保存数据时由于名称相同造成的覆盖问题。

```js
class Demo{
  static data = {};
  static set(name, value) {
    return this.data[name] = value
  }
  static get(name) {
    return this.data[name];
  }
}

let user = {
  name: 'apple',
  dec: '用户'
};

let cart = {
  name: 'apple',
  dec: '购物车'
};

Demo.set('apple',user);
Demo.set('apple',cart);
console.log(Demo.get('apple'));//{ name: 'apple', dec: '购物车' }

let user1 = {
  name: 'apple',
  dec: '用户',
  key: Symbol('会员名')
};

let cart1 = {
  name: 'apple',
  dec: '购物车',
  key: Symbol('商品名')
};

Demo.set(user1.key,user1);
Demo.set(cart1.key,cart1);
console.log(Demo.get(user1.key));//{ name: 'apple', dec: '用户', key: Symbol(会员名) }
console.log(Demo.get(cart1.key));//{ name: 'apple', dec: '购物车', key: Symbol(商品名)
```

### 遍历属性

symbol类型属性不能直接使用for/in for/of遍历

```js
let cart = {
  name: 'llk',
  [Symbol('类型')]: '小游戏'
}

for (const key in cart) {
  console.log(key);//name
}

for (const value of Object.keys(cart)) {
  console.log(value);//name
}
```



如果需要遍历symbol类型的属性，可以使用 `Object.getOwnPropertySymbols` 获取所有`Symbol`属性

```js
let cart = {
  name: 'llk',
  [Symbol('类型')]: '小游戏'
}

for (const key of Object.getOwnPropertySymbols(cart)) {
  console.log(key);//Symbol(类型)
}
```



也可以使用 `Reflect.ownKeys(obj)` 获取所有属性包括`Symbol`

```js
let cart = {
  name: 'llk',
  [Symbol('类型')]: '小游戏'
}

for (const key of Reflect.ownKeys(cart)) {
  console.log(key);
  //name
  //Symbol(类型)
}
```



同时也可以用symbol来隐藏对象属性（对象属性保护）

```js
let llk = Symbol('一个symbol');
class Demo {
  constructor(name){
    this.name = name;
    this[llk] = 'llk'
    this[Symbol.for('唯一')] = '唯一' 
    //使用Symbol.for()时可以直接用来引用，因为Symbol.for()描述内容相同也只有一个
  }
  getNewName(){
    return `${this[llk]} ${this[Symbol.for('唯一')]} ${this.name}` //llk 唯一 游戏连连看
  }
}

let yxllk = new Demo('游戏连连看')
console.log(yxllk.getNewName());
for (const key in yxllk) {
  console.log(key);//name （遍历不到symbol属性）
}
```
