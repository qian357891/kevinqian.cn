## this

调用函数时 `this` 会隐式传递给函数指函数调用时的关联对象，也称之为函数的上下文。

全局环境下`this`就是 window 对象的引用

```html
<body>
  <script>
    console.log(this===window);//true
  </script>
</body>
```

使用严格模式时在全局函数内`this`为`undefined`

```html
<body>
  <script>
    var hd = '人人做后盾';
    let get = function(){
      "use strict"
      return this.hd;
    }
    console.log(get());//严格模式将产生错误 Cannot read property 'name' of undefined
  </script>
</body>
```



### 函数中的this

在对象中的方法（对象中声明的函数称为方法），要读取对象中的其他属性的时候可以用this来引用对象，来代替使用对象名。

当然 `func: function(){}`也可以简写为`func(){}`

```js
let obj = {
  click: 199,
  func: function(){
    return this.click;
  }
}
console.log(obj.func());//119
```



而在对象方法的普通函数中，使用this，这时的对象的引用不是他的上层方法的对象，而是全局对象window

```html
<body>
  <script>
    let obj = {
      click: 199,
      func: function(){
        function send(){
          return this;
        }
        return send();
      }
    }
    console.log(obj.func());//window
  </script>
</body>
```

要想改变this的指向，有多种途径。



### 改变this指针

es5的方式（不建议），声明一个变量引用this。

```js
let obj = {
  string: 'str',
  arr: [199,188,177],
  func(){
    let that = this;
    return this.arr.map( function add(item){
      return `${that.string}-${item}`;
    });
  }
}
console.log(obj.func());//[ 'str-199', 'str-188', 'str-177' ]
```



在某些方法中，如map，有第二个参数，可以设置this的值。

```js
let obj = {
  string: 'str',
  arr: [199,188,177],
  func(){
    return this.arr.map( function add(item){
      return `${this.string}-${item}`;
    },this);
  }
}
console.log(obj.func());//[ 'str-199', 'str-188', 'str-177' ]
```



也可以使用箭头函数`=>`

```js
let obj = {
  string: 'str',
  arr: [199,188,177],
  func(){
    return this.arr.map( (item)=>`${this.string}-${item}`);
  }
}
console.log(obj.func());//[ 'str-199', 'str-188', 'str-177' ]
```



### 箭头函数与this

箭头函数没有`this`, 也可以理解为箭头函数中的`this` 会继承定义函数时的上下文，可以理解为和外层函数指向同一个 this。

- 如果想使用函数定义时的上下文中的 this，那就使用箭头函数

下例中的匿名函数的执行环境为全局所以 `this` 指向 `window`。

```js
let obj = {
  click: 199,
  func: function(){
    function send(){
      return this.click;
    }
    return send();
  }
}
console.log(obj.func());//undefined
```

我们可以用箭头函数`=>`，箭头函数会让this指向上一层的对象的引用。

```js
let obj = {
  click: 199,
  func(){
    let send = () => this.click;
    return send();
  }
}
console.log(obj.func());//199
```



事件中使用箭头函数结果不是我们想要的

- 事件函数可理解为对象`onclick`设置值，所以函数声明时`this`为当前对象
- 但使用箭头函数时`this`为声明函数上下文

下面体验使用普通事件函数时`this`指向元素对象

使用普通函数时`this`为当前 DOM 对象

```html
<body>
  <button>周杰伦</button>
  <script>
    let dom = {
      star: 'zjl',
      func: function(){
        const btn = document.querySelector('button');
        btn.addEventListener('click', function(){
          console.log(this);
        })
      }
    }
    dom.func();//<button>周杰伦</button>
  </script>
</body>
```



使用`箭头函数`时，取到的是父级作用域的this。

```html
<body>
  <button>周杰伦</button>
  <script>
    let dom = {
      star: 'zjl',
      func: function(){
        const btn = document.querySelector('button');
        btn.addEventListener('click', ()=>{
          console.log(this);
        })
      }
    }
    dom.func();//{star: 'zjl', func: ƒ}
  </script>
</body>
```



而在有时候，我们既需要取到当前DOM对象又需要取到父级作用域的this，可以这样做。

我们可以使用target属性。

```html
<body>
  <button>周杰伦</button>
  <script>
    let dom = {
      star: 'zjl',
      func: function(){
        const btn = document.querySelector('button');
        btn.addEventListener('click', (event)=>{
          console.log(`${this.star}是${event.target.innerHTML}`);
        })
      }
    }
    dom.func();//zjl是周杰伦
  </script>
</body>
```





## apply/call/bind

改变 this 指针，也可以理解为对象借用方法，就现像生活中向邻居借东西一样的事情。



### 原理分析

构造函数函数可以看做是一个工厂，使用`new`关键字来进行调用。

创建的是一个对象。具体可以看对象章节。

构造函数中的`this`默认是一个空对象，然后构造函数处理后把这个空对象变得有值。

```js
function User(name){
  this.name = name;
}
let user = new User('张三');
console.log(user.name);//张三
```



可以改变构造函数中的空对象，即让构造函数 this 指向到另一个对象。

可以看到call能够改变this的指向。

```js
function User(name){
  this.name = name;
  console.log(this);//{ age: 18, name: '张三' }
}
let student = {age: 18};
User.call(student, '张三');
console.log(student);//{ age: 18, name: '张三' }
```





### apply/call

call 与 apply 用于显示的设置函数的上下文，两个方法作用一样都是将对象绑定到 this，只是在传递参数上有所不同。

- apply 用数组传参
- call 需要分别传参
- 与 bind 不同 call/apply 会立即执行函数



语法使用介绍

- call和apply方法的第一个的参数为要绑定到this的对象。

- call传值的时候**需要传递的参数用逗号隔开**。

- apply传值的时候第二个参数为数组，**需要传递的参数都放在数组里面,并且通过`,`隔开**。

```js
function func(title, time){
  console.log(`${title}-${this.name}-${time}`); 
}
let zs = {
  name: '张三'
};
let ls = {
  name: '李四'
};

func.call(zs, 'zs', '3.1');//zs-张三-3.1
func.apply(ls, ['ls', '3.1']);//ls-李四-3.1
```



在这个例子中，使用了call或者apply来改变alt方法中this的指向。如果不使用这两个方法，那么this指向的将是window。

将event.target（dom对象）作为绑定到this的对象，这样就能让alt()函数的this指向 btn数组中的两个button节点对象。

```html
<body>
  <button>zjl</button>
  <button>ljj</button>
  <script>
    let alt = function(){
      alert(this.innerHTML);
    }
    let btn = document.querySelectorAll('button');
    btn.forEach(item=>{
      item.addEventListener('click',event => {
        alt.call(event.target);
        // alt.apply(event.target); call和apply都可以
      });
    })
  </script>
</body>
```



apply也可以用来找出数组的最大值

```js
let arr = [1,2,3,4,5];
console.log(Math.max(arr));//NaN
console.log(Math.max(...arr));//5
console.log(Math.max.apply(Math,arr));//5
```

其中，`max`不依赖于当前的上下文，所以任何东西都可以代替`Math`。

```js
let arr = [1,2,3,4,5];
console.log(Math.max.apply(null,arr));//5
console.log(Math.max.apply(undefined,arr));//5
console.log(Math.max.apply(123,arr));//5
```



实现构造函数属性继承

```js
function Requre(){
  this.get = function(params={}){
    let option = Object.keys(params)//params是传入的对象，Object.keys方法将返回一个对象键的数组。
    .map(key => `${key}=${params[key]}`)
    .join('&');
    return `获取数据 API:www.bilibili.com/${this.url}?${option}`;
    //这里的this.url，分别指Article的和User的，在其余两个构造函数中利用apply方法，让Requre的this指向了Article和User
  }
}

function Article(){
  this.url = `artile/list`;
  Requre.apply(this);//在这里，Requre的this指向Article
  console.log(this);//Article { url: 'artile/list', get: [Function (anonymous)] }
}

function User(){
  this.url = `user/list`;
  Requre.apply(this);//在这里，Requre的this指向User
  console.log(this);//User { url: 'user/list', get: [Function (anonymous)] }

}

let artile = new Article()
let user = new User()

console.log(artile.get({
  title: 'ts',
  autor: 'xiaoming'
}));//获取数据 API:www.bilibili.com/artile/list?title=ts&autor=xiaoming

console.log(user.get({
  name: 'xiaoming',
  age: 18
}));//获取数据 API:www.bilibili.com/user/list?name=xiaoming&age=18
```



制作显示隐藏面板

```html
<body>
  <dl>
      <dt>1</dt>
      <dd>隐藏1</dd>
      <dt>2</dt>
      <dd hidden="hidden">隐藏2</dd>
  </dl>
  <script>
    function hidden(i){
      let dd = document.querySelectorAll('dd');
      dd.forEach(elem => elem.setAttribute('hidden','hidden'));//全部设置hidden
      dd[i].removeAttribute('hidden');//移除当前索引的hidden
    }
    document.querySelectorAll('dt').forEach( (dt, i) => {
      dt.addEventListener('click',() => hidden.call(null, i))//传入index[0,1]
    });
  </script>
</body>
```



### bind

bind()是将函数绑定到某个对象，比如 a.bind(hd) 可以理解为将 a 函数绑定到 hd 对象上即 hd.a()。

- 与 call/apply 不同 bind 不会立即执行
- bind 是复制函数形为会返回新函数

bind 是复制函数行为，与原函数的引用的内存空间不同。

```js
let func = function(){};
let func1 = func;
console.log(func===func1);//true
console.log(func.bind()===func1);//false
```



bind的两种传参方式

```js
let func = function(a,b){
  console.log(this.click+a+b);
};
let newFunc = func.bind({click: 100});
newFunc(11,12);//123
let newFunc1 = func.bind({click: 200}, 22,33);
newFunc1();//255
```



使用bind进行背景颜色的重复修改，当然，也可以使用箭头函数

```html
<body>
  <script>
    function Color(elem){
      this.elem = elem
      this.color = ['black','yellow','red','green','brown'];
      this.run = function(){
        setInterval(function(){
          let pos = Math.floor(Math.random()*this.color.length);
          this.elem.style.background = this.color[pos];
        }.bind(this),1000)
      };
    }
    let change = new Color(document.body);
    change.run();
  </script>
</body>
```

