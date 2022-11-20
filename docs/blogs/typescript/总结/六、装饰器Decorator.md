### 什么是装饰器

在内部，装饰器只是一个函数。在js执行时，将目标（类，函数，属性等）传入装饰器，并执行。

首先装饰器是js/ts的一个实验属性，我们需要在tsconfig.json中找到`"experimentalDecorators": true,`并打开它。



### 类装饰器

首先装饰器的函数名我们通常情况下使用大驼峰命名法，然后函数的参数类型取决于这个装饰器作用于哪里。比如这是个类装饰器，参数的类型就为`Function`，它是作用于构造函数的。这里的参数也是指的传入的类的构造函数。

在使用类装饰器的时候将其写在类的上面（注意没有括号）

```ts
function Component(constructor: Function): void {
  console.log("Component decorator called");
  constructor.prototype.uniqueId = Date.now();
  constructor.prototype.inserInDOM = () => {
    console.log("Inserting the component in the DOM");
  };
}

@Component
class ProfileComponent {}
//Component decorator called
```



### 装饰器工厂

现在我们想要创建参数化的装饰器

```ts
// 装饰器工厂/Decorator factory
function Component(value: number) {
  return (constructor: Function) => {
    console.log("Component decorator called");
    constructor.prototype.options = value;
    constructor.prototype.uniqueId = Date.now();
    constructor.prototype.inserInDOM = () => {
      console.log("Inserting the component in the DOM");
    };
  };
}

@Component(1) //Component decorator called number 1
class ProfileComponent {}
```

这看起来就像一个工厂，用于创建装饰器。这样的函数叫做装饰器工厂。



我们现在让参数为对象：

```ts
type ComponentOptions = {
  selector: string;
};

// 装饰器工厂/Decorator factory
function Component(options: ComponentOptions) {
  return (constructor: Function) => {
    console.log("Component decorator called");
    constructor.prototype.options = options;
    constructor.prototype.uniqueId = Date.now();
    constructor.prototype.inserInDOM = () => {
      console.log(
        "Inserting the component in the DOM：" +
          constructor.prototype.options.selector
      );
    };
  };
}

@Component({ selector: "#my-profile" })
class ProfileComponent {
  inserInDOM() {}//需要声明
}

let profileComponent = new ProfileComponent();
profileComponent.inserInDOM(); //Inserting the component in the DOM：#my-profile
```



### 使用多个装饰器

我们可以同时使用多个装饰器

```ts
type ComponentOptions = {
  selector: string;
};

// 装饰器工厂/Decorator factory
function Component(options: ComponentOptions) {
  return (constructor: Function) => {
    console.log("Component decorator called");
    constructor.prototype.options = options;
    constructor.prototype.uniqueId = Date.now();
    constructor.prototype.inserInDOM = () => {
      console.log(
        "Inserting the component in the DOM：" +
          constructor.prototype.options.selector
      );
    };
  };
}

function Pipe(constructor: Function) {
  console.log("Pipe decorator called");
  constructor.prototype.pipe = true;
}

@Component({ selector: "#my-profile" })
@Pipe
class ProfileComponent {
  inserInDOM() {}
}
// Pipe decorator called
// Component decorator called
```

**需要注意的是，我们的装饰器是按照相反的顺序应用的。**

这背后的想法来自数学：在数学中如果我们有`f(g(x))`这样的表达式，然后我们会先求得g(x)的值然后把它传给f(x)。



### 方法装饰器

方法装饰器有三个参数：

| 参数   | 说明                                                       |
| ------ | ---------------------------------------------------------- |
| 参数一 | 普通方法是构造函数的原型对象 Prototype，静态方法是构造函数 |
| 参数二 | 方法名称                                                   |
| 参数三 | 属性特征                                                   |



我们这里不会用到target和methodName，但由于我们又在tsconfig.josn中进行了配置，我们可以关闭这个配置，也可以使用带下划线`_`的前缀来忽略这个报错。

```ts
function Log(
  _target: any,
  _methodName: string,
  descriptor: PropertyDescriptor
) {
  const original = descriptor.value as Function;
  descriptor.value = function () {
    console.log("Before");
    original.call(this, "传入数据");
    console.log("After");
  };
}

class Person {
  @Log
  say(message: string) {
    console.log("Person says " + message);
  }
}

let person = new Person();
person.say("dom");
// Before
// Person says 传入数据
// After
```

我们发现target的类型使用的any，虽然我们建议尽量不用any，但也不是完全不用，我们在这里并不知道target的类型。method的类型为string，descriptor属性特征的类型为PropertyDescriptor。

我们在覆盖`descriptor.value`前将原方法保留并在新方法中调用。

我们发现我们在实例对象传的参数会被忽略。因为在我们的新方法中没有参数，而是直接调用的保存好的原函数`original`。



如果我们像不被覆盖，我们可以这样写：

```ts
function Log(
  _target: any,
  _methodName: string,
  descriptor: PropertyDescriptor
) {
  const original = descriptor.value as Function;
  descriptor.value = function (message: string) {
    console.log("Before");
    original.call(this, message);
    console.log("After");
  };
}

class Person {
  @Log
  say(message: string) {
    console.log("Person says " + message);
  }
}

let person = new Person();
person.say("dom");
// Before
// Person says dom
// After
```



为了让这个装饰器能够在多个方法中使用，我们可以这样做：

```ts
function Log(
  _target: any,
  _methodName: string,
  descriptor: PropertyDescriptor
) {
  const original = descriptor.value as Function;
  descriptor.value = function (...args: any) {
    console.log("Before");
    original.call(this, ...args);
    console.log("After");
  };
}
```

**值得注意的是：我们在写新方法时应该用函数表达式声明，而不是箭头函数声明。因为箭头函数没有自己的this，他们的this指向当前实例对象**





### 在访问器中使用装饰器

在getter和setter访问器中我们应该如何使用装饰器呢？

访问器与方法类似，所以我们和使用方法装饰器的时候一样，唯一不同的是，访问器不能使用`descriptor`的`value`属性，在使用get访问器的时候我们要使用`get`属性。而不是`value`

```ts
function Capitalize(
  _target: any,
  _methodName: string,
  descriptor: PropertyDescriptor
) {
  const original = descriptor.get;
  descriptor.get = function () {
    const result = original?.call(this);
    return typeof result === "string" ? result.toUpperCase() : result;
  };
}

class Person {
  constructor(public firstName: string, public lastName: string) {}

  @Capitalize
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}

let person = new Person("Kevin", "Qian");
console.log(person.fullName); //KEVIN QIAN
```



### 属性装饰器

这里我们使用了装饰器工厂

属性装饰器的参数为：

| 参数   | 说明                                                       |
| ------ | ---------------------------------------------------------- |
| 参数一 | 普通方法是构造函数的原型对象 Prototype，静态方法是构造函数 |
| 参数二 | 属性名称                                                   |



```ts
function MinLength(length: number) {
  return (target: any, propertyName: string) => {
    let value: string;// 注意要先声明

    const descriptor: PropertyDescriptor = {
      get() {
        return value;
      },
      set(newValue: string) {
        if (newValue.length < length)
          throw new Error(`${propertyName} should be at least ${length}`);
        value = newValue;
      },
    };

    Object.defineProperty(target, propertyName, descriptor);// 我们通过这个方法来改变我们的原属性。
  };
}

class User {
  @MinLength(4)
  password: string;
  constructor(password: string) {
    this.password = password;
  }
}

let user = new User("5678");
console.log(user.password); //5678

// user.password = "22"; //Error: password should be at least 4

// let errUser = new User("111"); //Error: password should be at least 4
```

我们可以看到，传入构造函数的值如果长度小于4，则会报错。并且在重新赋值属性的时候，装饰器会被重新调用。进行一个验证，当长度小于4的时候报错。



### 参数装饰器

我们并不常使用参数装饰器，但如果你正在设计一个框架供其他人使用，你可能会用到参数装饰器。

我们通常情况将其用于存储这些参数的一些元数据

```ts
type WatchedParameter = {
  methodName: string;
  parameterIndex: number;
};

const watchedParameters: WatchedParameter[] = [];

function Watch(_target: any, methodName: string, parameterIndex: number) {
  watchedParameters.push({
    methodName,
    parameterIndex,
  });
}

class Vehicle {
  move(@Watch _speed: number) {}
}

console.log(watchedParameters); //[ { methodName: 'move', parameterIndex: 0 } ]
```

