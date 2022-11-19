## Promise

### 状态说明

Promise 包含`pending`、`fulfilled`、`rejected`三种状态

- `pending` 指初始等待状态，初始化 `promise` 时的状态
- `resolve` 指已经解决，将 `promise` 状态设置为`fulfilled`
- `reject` 指拒绝处理，将 `promise` 状态设置为`rejected`
- `promise` 是生产者，通过 `resolve` 与 `reject` 函数告之结果
- `promise` 非常适合需要一定执行时间的异步任务
- 状态一旦改变将不可更改



promise 没有使用 `resolve` 或 `reject` 更改状态时，状态为 `pending`

```js
console.log(
  new Promise((resolve, reject) => {
  });
); //Promise {<pending>}
```

当更改状态后

```js
console.log(
  new Promise((resolve, reject) => {
    resolve("fulfilled");
  })
); //Promise {<resolved>: "fulfilled"}

console.log(
  new Promise((resolve, reject) => {
    reject("rejected");
  })
); //Promise {<rejected>: "rejected"}
```



`promise` 创建时即立即执行即同步任务，`then` 会放在异步微任务中执行，需要等同步任务执行后才执行。

```js
new Promise(reslove=>{
  console.log(123);
  reslove();
}).then(()=>{
  console.log('then');
});
console.log(456);
//执行顺序 123 456 then
```

**`promise` 的 then、catch、finally 的方法都是异步任务**



### 宏任务的提升

```js
setTimeout(()=>{
  console.log('setTimeout');
})
new Promise(reslove=>{
  console.log(123);
  reslove();
}).then(()=>{
  console.log('then');
});
console.log(456);
//执行顺序 123 456  then setTimeout
```



但是，当将reslove()放在setTimeout这种宏方法中时，'setTimeout'会比'then'先执行，因为then需要执行reslove后才能执行，而在执行reslove时，就会执行settTomeout里面的内容。所以会先打印’setTiomout‘

```js
new Promise(reslove=>{
  console.log(123);
  setTimeout(()=>{
    console.log('setTimeout');
    reslove();
  })
}).then(()=>{
  console.log('then');
});
console.log(456);
//执行顺序 123 456 setTimeout then
```



### 异步状态

状态被改变后就不能再修改了，下面先通过`resolve` 改变为成功状态，表示`promise` 状态已经完成，就不能使用 `reject` 更改状态了

```js
new Promise((resolve, reject) => {
  resolve("操作成功");
  reject(new Error("请求失败"));
}).then(
  msg => {
    console.log(msg);
  },
  error => {
    console.log(error);
  }
);
```



## then

一个 promise 需要提供一个 then 方法访问 promise 结果，`then` 用于定义当 `promise` 状态发生改变时的处理，即`promise`处理异步操作，`then` 用于结果。

`promise` 就像 `kfc` 中的厨房，`then` 就是我们用户，如果餐做好了即 `fulfilled` ，做不了拒绝即`rejected` 状态。那么 then 就要对不同状态处理。

- then 方法必须返回 promise，用户返回或系统自动返回
- 第一个函数在`resolved` 状态时执行，即执行`resolve`时执行`then`第一个函数处理成功状态
- 第二个函数在`rejected`状态时执行，即执行`reject` 时执行第二个函数处理失败状态，该函数是可选的
- 两个函数都接收 `promise` 传出的值做为参数
- 也可以使用`catch` 来处理失败的状态
- 如果 `then` 返回 `promise` ，下一个`then` 会在当前`promise` 状态改变后执行

```js
new Promise((reslove, reject)=>{
  // reslove('请求成功');
  reject('请求失败');
}).then().then(null,error=>{
  console.log(`error1 ${error}`);
}).then(value=>{
  console.log(value);
},error => {
  console.log(`error2 ${error}`);
});
//error1 请求失败  undefined
```



### 语法说明

then 的语法如下，onFulfilled 函数处理 `fulfilled` 状态， onRejected 函数处理 `rejected` 状态

- onFulfilled 或 onRejected 不是函数将被忽略
- 两个函数只会被调用一次
- onFulfilled 在 promise 执行成功时调用
- onRejected 在 promise 执行拒绝时调用

```js
promise.then(onFulfilled, onRejected)
```



### 链式调用

原理：每次的 `then` 都是一个全新的 `promise`，默认 then 返回的 promise 状态是 fulfilled





注意：每次的 `then` 都是一个全新的 `promise`，不要认为上一个 promise 状态会影响以后 then 返回的状态



如果`then`返回 `promise` 时，返回的`promise` 后面的`then` 就是处理这个`promise` 的

> 如果不 `return` 情况就不是这样了，即外层的 `then` 的`promise` 和内部的`promise` 是独立的两个 promise

```js
new Promise((resolve, reject) => {
  resolve();
})
.then(v => {
  return new Promise((resolve, reject) => {
    resolve("第二个promise");
  }).then(value => {
    console.log(value);
    return value;
  });
})
.then(value => {
  console.log(value);
});
```

这是对上面代码的优化，把内部的 `then` 提取出来

```js
new Promise((resolve, reject) => {
  resolve();
})
.then(v => {
  return new Promise((resolve, reject) => {
    resolve("第二个promise");
  });
})
.then(value => {
  console.log(value);
  return value;
})
.then(value => {
  console.log(value);
});
```



### catch

catch 用于失败状态的处理函数，等同于 `then(null,reject){}`

- 建议使用 `catch` 处理错误
- 将 `catch` 放在最后面用于统一处理前面发生的错误



### 使用建议

建议将错误要交给`catch`处理而不是在`then`中完成

错误是冒泡的操作的，下面没有任何一个`then` 定义第二个函数，将一直冒泡到 `catch` 处理错误

```js
new Promise((resolve, reject) => {
  reject(new Error("请求失败"));
})
.then(msg => {})
.then(msg => {})
.catch(error => {
  console.log(error);
});
```



### 定制错误

可以根据不同的错误类型进行定制操作，只需要声明一个类来继承`Error`类，然后重写属性。

参数错误与404错误。

```js
class ParamError extends Error {
  constructor(msg) {
    super(msg);
    this.name = "ParamError";
  }
}
class HttpError extends Error {
  constructor(msg) {
    super(msg);
    this.name = "HttpError";
  }
}
```



### Thenables

包含 `then` 方法的对象就是一个 `promise` ，系统将传递 resolvePromise 与 rejectPromise 做为函数参数

下例中使用 `resolve` 或在`then` 方法中返回了具有 `then`方法的对象

- 该对象即为 `promise` 要先执行，并在方法内部更改状态
- 如果不更改状态，后面的 `then` promise 都为等待状态

```js
new Promise((resolve, reject) => {
  resolve({
    then(resolve, reject) {
      resolve("解决状态");
    }
  });
})
.then(v => {
  console.log(`fulfilled: ${v}`);
  return {
    then(resolve, reject) {
      setTimeout(() => {
        reject("失败状态");
      }, 2000);
    }
  };
})
.then(null, error => {
  console.log(`rejected: ${error}`);
});
```

**包含 `then` 方法的对象可以当作 promise 来使用**

**当然也可以是类**

```js
new Promise((resolve, reject) => {
  resolve(
    class {
      static then(resolve, reject) {
        setTimeout(() => {
          resolve("解决状态");
        }, 2000);
      }
    }
  );
}).then(
  v => {
    console.log(`fulfilled: ${v}`);
  },
  v => {
    console.log(`rejected: ${v}`);
  }
);
```





## finally

无论状态是`resolve` 或 `reject` 都会执行此动作，`finally` 与状态无关。

```js
const promise = new Promise((resolve, reject) => {
  reject("hdcms");
})
.then(msg => {
  console.log("resolve");
})
.catch(msg => {
  console.log("reject");
})
.finally(() => {
  console.log("resolve/reject状态都会执行");
});
```



## 使用Promise来封装函数



### 使用Promise封装setTimeout定时器

```js
function tiomOut(delay = 1000){
  return new Promise(resolve=> setTimeout(resolve, delay));
}
tiomOut(2000)
  .then(()=>{
    console.log('成功1');
    return tiomOut(2000);
  })
  .then(vale => console.log('成功2'));
```



### 构建扁平化的setInterval

```js
function timeOut(delay=1000,callback){
  return new Promise(resolve => {
    let id = setInterval(()=>{
      callback(id,resolve);
    },delay)
  })
}
timeOut(100,(id,resolve)=>{
  console.log(id);
  clearInterval(id);
  resolve('成功');
}).then(value=>console.log(value))
```



## 扩展接口

### resolve

使用 `promise.resolve` 方法可以快速的返回一个 promise 对象（状态为fulfilled）

根据值返回 `promise`

```js
Promise.resolve("后盾人").then(value => {
  console.log(value); //后盾人
});
```



如果是 `thenable` 对象，会将对象包装成 promise 处理，这与其他 promise 处理方式一样的

```js
const hd = {
  then(resolve, reject) {
    resolve("后盾人");
  }
};
Promise.resolve(hd).then(value => {
  console.log(value);
});
```



### reject

和 `Promise.resolve` 类似，`reject` 生成一个失败的`promise`

```js
Promise.reject("fail").catch(error => console.log(error));
```



### all

使用`Promise.all` 方法可以同时执行多个并行异步操作，比如页面加载时同进获取课程列表与推荐课程。

- 任何一个 `Promise` 执行失败就会调用 `catch`方法
- 适用于一次发送多个异步操作
- 参数必须是可迭代类型，如 Array/Set
- 成功后返回 `promise` 结果的有序数组

下例中当 `hdcms、houdunren` 两个 Promise 状态都为 `fulfilled` 时，hd 状态才为`fulfilled`。

```js
const hdcms = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("第一个Promise");
  }, 1000);
});
const houdunren = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("第二个异步");
  }, 1000);
});
const hd = Promise.all([hdcms, houdunren])
  .then(results => {
    console.log(results);
  })
  .catch(msg => {
    console.log(msg);
  });
//['第一个Promise', '第二个异步']
```



### allSettled

`allSettled` 用于处理多个`promise` ，只关注执行完成，不关注是否全部执行成功，`allSettled` 状态只会是`fulfilled`。

下面的 p2 返回状态为 `rejected` ，但`promise.allSettled` 不关心，它始终将状态设置为 `fulfilled` 。

```js
const p1 = new Promise((resolve, reject) => {
  resolve("resolved");
});
const p2 = new Promise((resolve, reject) => {
  reject("rejected");
});
Promise.allSettled([p1, p2])
.then(msg => {
  console.log(msg);
})
```



### race

使用`Promise.race()` 处理容错异步，和`race`单词一样哪个 Promise 快用哪个，哪个先返回用哪个。

- 以最快返回的 promise 为准
- 如果最快返加的状态为`rejected` 那整个`promise`为`rejected`执行 cache
- 如果参数不是 promise，内部将自动转为 promise

下面将第一次请求的异步时间调整为两秒，这时第二个先返回就用第二人。

```js
const hdcms = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("第一个Promise");
  }, 2000);
});
const houdunren = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("第二个异步");
  }, 1000);
});
Promise.race([hdcms, houdunren])
.then(results => {
  console.log(results);
})
.catch(msg => {
  console.log(msg);
});
```



## 任务队列

### 实现原理

如果 `then` 返回`promise` 时，后面的`then` 就是对返回的 `promise` 的处理

```js
let promise = Promise.resolve();
let p1 = promise.then(() => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log(`p1`);
      resolve();
    }, 1000);
  });
});
p1.then(() => {
  return new Promise((a, b) => {
    setTimeout(() => {
      console.log(`p2`);
    }, 1000);
  });
});
```



下面使用 `map` 构建的队列，有以下几点需要说明

- `then` 内部返回的 `promise` 更改外部的 `promise` 变量
- 为了让任务继承，执行完任务需要将 `promise` 状态修改为 `fulfilled`

```js
function quee(arr){
  let promise = Promise.resolve();
  arr.map(item=>{
    promise = promise.then(v=>{
      return new Promise(resolve=>{
        setTimeout(()=>{
          console.log(item);
          resolve();
        },1000);
      })
    })
  })
}
quee([1,2,3,4,5]);
//1
//2
//3
//4
//5
```



下面再来通过 `reduce` 来实现队列

```js
function quee(arr){
  arr.reduce((promise,n)=>{
    return promise.then(()=>{
      return new Promise(resolve => {
        setTimeout(()=>{
          console.log(n);
          resolve();
        },1000);
      })
    })
  },Promise.resolve())
}
quee([1,2,3,4,5]);
```



##  async/await

使用 `async/await` 是 promise 的语法糖，可以让编写 promise 更清晰易懂，也是推荐编写 promise 的方式。

- `async/await` 本质还是 promise，只是更简洁的语法糖书写
- `async/await` 使用更清晰的 promise 来替换 promise.then/catch 的方式

**如果没有返回值，async默认返回一个 Promise {<fulfilled>: undefined}**

Promise 的特点——无等待，所以在没有 `await` 的情况下执行 async 函数，它会立即执行，返回一个 Promise 对象，并且，绝不会阻塞后面的语句。

```js
async function func(){
  return 'dd';
}
console.log(func());//Promise {<fulfilled>: 'dd'}
```



### async

下面在 `hd` 函数前加上 async，函数将返回 promise，我们就可以像使用标准 Promise 一样使用了。

```js
async function dd(){
  return 'dd'
}
console.log(dd());//Promise {<fulfilled>: 'dd'}
dd().then(value => {
  console.log(value);//dd
});
```



如果有多个 await 需要排队执行完成，我们可以很方便的处理多个异步队列

```js
async function func(message){
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(message);
    },1000);
  });
}
async function run(){
  let promise1 = await func('第一个');
  console.log(promise1);
  let promise2 = await func('第二个');
  console.log(promise2);
}
run();
//第一个
//第二个
```



### await

使用 `await` 关键词后会等待 promise 完

- `await` 后面一般是 promise，如果不是直接返回
- `await` 必须放在 async 定义的函数中使用
- `await` 用于替代 `then` 使编码更优雅



一般 await 后面是外部其它的 promise 对象

```js
async function hd() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve("fulfilled");
    }, 2000);
  });
}
async function run() {
  let value = await hd();
  console.log("houdunren.com");
  console.log(value);
}
run();
```





下面是使用 async 设置定时器，并间隔时间来输出内容

下面代码在控制台打印内容为 kevin tom 两个字符串都是隔了两秒后输出

```js
async function sleep(delay = 2000){
  return new Promise(resolve=>{
    setTimeout(()=>{
      resolve();
    },delay);
  });
}
async function show(){
  for (const user of ['kevin','tom']) {
    await sleep();
    console.log(user);
  }
}
show();
```



### class与await结合

```js
class User{
  constructor(name){
    this.name = name;
  }
  then(resolve,reject){
    setTimeout(()=>{
      resolve(this.name);
    },1000)
  }
}
async function func(){
  let user = await new User('kevin');
  console.log(user);
}
func();
```



### 错误处理

async 内部发生的错误，会将必变 promise 对象为 rejected 状态，所以可以使用`catch` 来处理

```js
async function func(){
  console.log(a);
}
func().catch(error=>{
  console.log(error);
})
```



多个 await 时当前面的出现失败，后面的将不可以执行

```js
async function hd() {
  await Promise.reject("fail");
  await Promise.resolve("success").then(value => {
    console.log(value);
  });
}
hd();
```

如果对前一个错误进行了处理，后面的 await 可以继续执行

```js
async function hd() {
  await Promise.reject("fail").catch(e => console.log(e));
  await Promise.resolve("success").then(value => {
    console.log(value);
  });
}
hd();
```

也可以使用 `try...catch` 特性忽略不必要的错误

```js
async function hd() {
  try {
    await Promise.reject("fail");
  } catch (error) {}
  await Promise.resolve("success").then(value => {
    console.log(value);
  });
}
hd();
```

也可以将多个 await 放在 try...catch 中统一处理错误



### 并发执行

有时需要多个 await 同时执行，有以下几种方法处理，下面多个 await 将产生等待

```js
async function p1() {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log("houdunren");
      resolve();
    }, 2000);
  });
}
async function p2() {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log("hdcms");
      resolve();
    }, 2000);
  });
}
async function hd() {
  await p1();
  await p2();
}
hd();
```



使用 `Promise.all()` 处理多个 promise 并行执行

```js
async function hd() {
  await Promise.all([p1(), p2()]);
}
hd();
```

让 promise 先执行后再使用 await 处理结果

```js
async function hd() {
  let h1 = p1();
  let h2 = p2();
  await h1;
  await h2;
}
hd();
```
