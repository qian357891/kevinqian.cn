### Promise



catch是捕获异常，如果一个promise返回的是一个`new Error`，则数据为一个Error对象，而不是异常。



不要理解为promise是微任务，也不要理解为then方法是微任务，**then()方法的回调函数才是微任务**，而then方法是同步代码。

async函数返回一个promise，并且是立即完成（**在执行完该函数的情况下**）。

- 在没有报错的情况下，返回状态fulfilled的promise，数据为return的值，没有显式返回的话，值为undefined
- 有报错则返回状态为rejected的promise



await关键字必须在async声明的函数中执行，因为await fn()后面的代码会被封装成一个回调函数放到微队列中，是一个异步任务，所以执行它的那个函数也得是一个异步的函数。



await在执行完后面跟的函数后，会将同一代码块中的代码用then进行包装。也就是说后面的代码放到微队列中等待运行。



如果出现“自己等自己”的情况，await后面的代码不执行。如下例代码：

```js
const a = new Promise(async()=>{
    console.log(1)
    await a
    console.log(2)
})

// 只输出1
```



如果出现then方法传的值不是一个函数，那么相当于传的null