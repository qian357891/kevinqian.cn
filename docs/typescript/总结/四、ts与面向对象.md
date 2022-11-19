> 这是一篇系列文章，文章内容为本人学习TS时记录的笔记和实际应用中的总结提炼而得。如果有错误的地方，大家可以在评论区中提出，我会以最快的时间进行更正。
>
> 如果对这个系列的其他文章感兴趣，可以在我的专栏中的“TS入门小记”中找到其他文章



### 什么是面向对象

面向对象（OOP）是一种编程范式，是写代码的一种”方式“或者说是”思想“。

#### 对象

对象是一种包含数据（属性），和行为（方法）的单元。

我们可以将不同的物体抽象为不同的对象来帮助我们编写程序。



#### 面向对象与函数式编程

面向对象编程和函数式编程是两种截然不同的编程思想。我们不能说面向对象优于函数式编程，但是面向对象能够让团队进行更好的合作。



### 类与对象

#### 创建一个类

首先，面向对象编程是围绕对象的，现在我们要创建一个对象，我们先尝试创建一个类。

类（class）是对象（object）的工厂，我们可以通过class来创建有同一属性和方法的对象。

在声明类中我们规定：

- 使用class关键字声明一个类
- 类名命名方式为大驼峰命名法
- 声明属性名和类型
- 在构造函数中初始化属性。

```ts
class Account {
  //注意，class的名称命名方式为大驼峰命名法
  id: number; //我们需要先声明class的属性和类型
  name: string;
  balance: number;
  constructor(id: number, name: string, balance: number) {
    //我们需要对属性进行初始化（通常情况下我们使用构造函数来传入值）
    this.id = id;
    this.name = name;
    this.balance = balance;
  }
  // 存款
  deposit(amount: number): void {
    if (amount <= 0) throw new Error("Invalid amount");
    this.balance += amount;
  }
}
```

其中需要注意的是，我们不能给构造函数的返回值设置类型，因为它始终返回类的实例（对象）`constructor Person(name: string, age: number): Person`



让我们来看看ts编译后生成的js文件

```js
"use strict";
class Account {
    constructor(id, name, balance) {
        this.id = id;
        this.name = name;
        this.balance = balance;
    }
    deposit(amount) {
        if (amount <= 0)
            throw new Error("Invalid amount");
        this.balance += amount;
    }
}
```

我们可以看到，在js中并没有对属性的类型注释，它们只存在于ts。



#### 使用类创建一个对象

我们使用new关键字来创建一个对象

```ts
let account = new Account(1, "kevin", 100);//属性会传入构造函数，构造函数会返回一个实例对象
account.deposit(100);//调用存款方法
console.log(account.balance);//200
```

我们来打印一下这个对象：

```ts
console.log(account); //Account { id: 1, name: 'kevin', balance: 200 }
```

对于对象，我们想像之前缩小类型范围一样使用`typeof`关键字

```ts
// if (typeof account === '...'){}//对对象使用typeof永远会返回object
console.log(typeof account);//object
```

所以我们需要使用`instanceof`运算符

```ts
console.log(account instanceof Account); //true
```



### readonly只读属性

我们可能希望有些属性是不会被改变的，比如我们的id：

```ts
account.id = 1;
```

我们可以在类中使用`readonly`关键字

```ts
class Account {
  readonly id: number;
  name: string;
  balance: number;
  constructor(id: number, name: string, balance: number) {
    this.id = id;
    this.name = name;
    this.balance = balance;
  }
//...
}

let account = new Account(1, "kevin", 100);
account.id = 1;//报错：无法分配到 "id" ，因为它是只读属性。ts(2540)
```



#### 可选属性

在Account类中，我们希望添加一个nickname属性。但并不是所有账户有nickname这个属性。

如果我们不做处理，而这个账户又没有nickname属性，怎么办呢？我们可以让这个属性成为一个可选属性。

只需要在冒号前添加`？`

` nickname?: string;`

```ts
class Account {
  readonly id: number;
  name: string;
  balance: number;
  nickname?: string;//可选属性
  constructor(id: number, name: string, balance: number) {
    this.id = id;
    this.name = name;
    this.balance = balance;
  }
  // ...
}
```



### 修饰词

ts中类有三个修饰符：`public` `private` `protected`（这个修饰符我们放在后面讲）

#### public

在默认情况下，声明的属性和方法都是公共的，所以我们不需要再去声明它。public的属性能被实例对象调用。



#### private

在上面的例子中，我们能够在外部改变account对象的balance。这肯定是不行的，我们希望改变balance只会通过方法，而不是直接修改属性。

我们使用private修饰词，让其属性和方法只能在该类中使用：

```ts
class Account {
  readonly id: number;
  name: string;
  private balance: number;//报错：声明了但没有使用。是因为从变量中“读取”的唯一东西是本身。如果从其他内容中读取，则将其视为已使用。（先不管）
  nickname?: string;
  constructor(id: number, name: string, balance: number) {
    this.id = id;
    this.name = name;
    this.balance = balance;
  }
  // 存款
  deposit(amount: number): void {
    if (amount <= 0) throw new Error("Invalid amount");
    this.balance += amount;
  }
}

let account = new Account(1, "kevin", 100);
//console.log(account.balance);//报错：属性“balance”为私有属性，只能在类“Account”中访问。ts(2341)
```

对于private修饰符，我们并不是要用它来修饰像密码等这样的敏感数据，**而是要使用这个修饰符写出更加健壮的代码**

对于private修饰的属性，我们通常在属性名前添加下划线`_`

```ts
private _balance: number;
```



对于private修饰的属性，我们无法在外部访问它。你也许会想到声明一个返回这个属性的方法。但是我们有更好的方法，那就是`getter`访问器。

我们会在下面讲到，不过我们现在先尝试使用private修饰方法。

```ts
private calculateTax() {}
```

当你使用实例对象的代码补全时，你会发现并没有私有属性和方法的代码。这也是一个好处。





### 参数属性

通常情况下我们会觉得下面的代码太冗长了

```ts
class Account {
  readonly id: number;
  name: string;
  private balance: number;//报错：声明了但没有使用。是因为从变量中“读取”的唯一东西是本身。如果从其他内容中读取，则将其视为已使用。（先不管）
  nickname?: string;
  constructor(id: number, name: string, balance: number) {
    this.id = id;
    this.name = name;
    this.balance = balance;
  }
  // 存款
  deposit(amount: number): void {
    if (amount <= 0) throw new Error("Invalid amount");
    this.balance += amount;
  }
}
```

我们可以使用**参数属性**来减少代码量：

```ts
class Account {
  nickname?: string;
  constructor(
    public readonly id: number,
    public name: string,
    private _balance: number//报错：声明了但没有使用。是因为从变量中“读取”的唯一东西是本身。如果从其他内容中读取，则将其视为已使用。（先不管）
  ) {}
  // 存款
  deposit(amount: number): void {
    if (amount <= 0) throw new Error("Invalid amount");
    this._balance += amount;
  }
}
```

你可以将修饰参数的关键字写入构造函数中，注意如果属性是默认的public需要写上public。

这时，我们就不需要在类中声明属性，也不需要在构造函数中设置默认值，构造函数会将传入参数设为属性的默认值。



关于上面那个`+=`报错，起初我还以为是ts有bug，然后还去github给ts提了个issue。结果过了半个多小时就得到了回复：**从变量中“读取”的唯一东西是本身。如果从其他内容中读取，则将其视为已使用。**

![image-20221108220241402](https://qiankun825.oss-cn-hangzhou.aliyuncs.com/img/image-20221108220241402.png)

![image-20221108220331849](https://qiankun825.oss-cn-hangzhou.aliyuncs.com/img/image-20221108220331849.png)

附上链接：[+= doesn't count a private member as being used · Issue #51371 · microsoft/TypeScript (github.com)](https://github.com/microsoft/TypeScript/issues/51371)



### getter和setter

#### getter访问器

在前面，我们讲到还有更简单和规范的方法来取到私有属性。那就是getter（访问器）

使用get关键字声明一个方法`balance`，返回值为`_balance`。值得注意的是，虽然这里看上去是一个方法，但我们调用时就像是在调用一个属性。

并且我们可以发现`private _balance: number`没有报错了（因为之前声明了私有属性没有使用）。而public声明的在类中没有调用也不报错是因为公有属性，实例可以调用。而私有属性不行。

```ts
class Account {
  nickname?: string;
  constructor(
    public readonly id: number,
    public name: string,
    private _balance: number
  ) {}
  get balance(): number {
    return this._balance;
  }
  // 存款
  deposit(amount: number): void {
    if (amount <= 0) throw new Error("Invalid amount");
    this._balance += amount;
  }
}

let account = new Account(1, "kevin", 100);
console.log(account.balance); //100
```



#### setter修改器

我们使用set关键字声明一个带有参数的函数，这样可以对属性进行修改

```ts
class Account {
  nickname?: string;
  constructor(
    public readonly id: number,
    public name: string,
    private _balance: number
  ) {}
  get balance(): number {
    return this._balance;
  }
  set balance(value: number) {
    if (value < 0) throw new Error("Invalid value");
    this._balance = value;
  }
  // 存款
  deposit(amount: number): void {
    if (amount <= 0) throw new Error("Invalid amount");
    this._balance += amount;
  }
}

let account = new Account(1, "kevin", 100);
account.balance = 888;
console.log(account.balance);//888
```

当然，在这里的代码中我们不需要setter修改器，因为我们使用private的目的就是不想直接改变balance的值。

我们这里只需要把这里看做一个setter的例子就好了。



### 索引签名

在js中，我们可以创建一个空对象，并且给空对象的属性赋值来给对象添加属性，而在ts中这是不行的。因为ts对对象的类型非常严格。

```js
let person = {};
person.name = "";//ts中会报错：类型“{}”上不存在属性“name”。ts(2339)
```



但有些情况，我们也需要动态的向对象添加属性，这就是我们使用**索引签名**的地方

假设有一场演唱会，对象的键值对为座位号和观众名字。我们不可能在类中写出所有人的座位号和名字。有可能这场演唱会有成千上万个观众。

但是我们前面讲了，在ts中我们不能直接向对象添加属性。所以我们需要用到**索引签名**。

```ts
class SeatAssignment {
  [seatNumber: string]: string;
}

let seats = new SeatAssignment();
seats.A1 = "kevin";
console.log(seats); //SeatAssignment { A1: 'kevin' }
seats["A1"] = "qian";
seats.B1 = "kun";
console.log(seats); //SeatAssignment { A1: 'qian', B1: 'kun' }
```

我们使用中括号`[]`将键名括起来，这表明这个键是一个动态的。并且给键声明类型，然后给值声明类型。这就是索引签名。

在接下来，我们就可以像在js中那样使用对象了。



### 静态成员

假设我们有一个全球共享数据的应用，比如uber。

我们记录已经上车的顾客的数量：

```ts
class Rides {
  activeRides: number = 0;
  start() {
    this.activeRides++;
  }
  stop() {
    this.activeRides--;
  }
}

let ride1 = new Rides();
ride1.start();

let ride2 = new Rides();
ride2.start();
console.log(ride1.activeRides, ride2.activeRides); //1 1
```

我们可以看到，我们输出的值为1，1。这是因为每次创建一个实例都会分配一个新的内存空间。所以在两个对象中使用方法时，他们使用的都是自己的属性。

但这不是我们想要的，我们希望他们的某些属性是使用的同一个，比如`activeRides`，因为我们这是一个全球共享数据的应用。



这就是我们使用静态成员的地方。

我们使用`static`来修饰静态成员，这时候成员只能被类调用，而不是实例对象。

```ts
class Rides {
  static activeRides: number = 0;
  start() {
    Rides.activeRides++;
  }
  stop() {
    Rides.activeRides--;
  }
}

let ride1 = new Rides();
ride1.start();

let ride2 = new Rides();
ride2.start();
console.log(Rides.activeRides); //2
```

值得注意的是，我们在`start`方法和`stop`方法中将`this`改变为了`Rides`，这是因为this指向的是当前对象。而静态成员只能在类中调用。



但是现在，我们发现，我们依然可以在外部直接修改activeRides，这是我们不愿意看到的。所以我们像之前那样使用getter和private

```ts
class Rides {
  private static _activeRides: number = 0;
  static get activeRides(): number {
    return Rides._activeRides;
  }

  start() {
    Rides._activeRides++;
  }
  stop() {
    Rides._activeRides--;
  }
}

// Rides.activeRides = 10; //报错：无法分配到 "activeRides" ，因为它是只读属性。ts(2540)

let ride1 = new Rides();
ride1.start();

let ride2 = new Rides();
ride2.start();
console.log(Rides.activeRides); //2
```



### 继承

#### 继承的实现

比如我们有两个类`Student`和`Teacher`，这两个类中有许多共性。我们不需要在两个类中写相同的代码，我们应该提高代码的复用性。所以我们新建了一个名叫`Person`的类，在里面编写两个类共有的属性和方法。比如`name`,`age`等等。然后再通过继承`extend`来拿到Person声明的属性。

在这种情况，我们称Person为父类，基类，或者超类。Student，Teacher为子类，派生类。

举个例子：

```ts
class Person {
  constructor(public firstName: string, public lastName: string) {}
  get fullName(): string {
    return this.firstName + " " + this.lastName;
  }
  walk(): void {
    console.log(this.fullName + "is walking");
  }
}

class Student extends Person {
  constructor(public studentId: number, firstName: string, lastName: string) {
    super(firstName, lastName);
  }
  takeTest(): void {
    console.log(this.fullName + "is talking a test");
  }
}

let student1 = new Student(1, "Kevin", "Qian");
student1.walk(); //Kevin Qianis walking
student1.takeTest(); //Kevin Qianis talking a test

```

**值得注意的是，当我们继承了类，如果要使用构造函数，就需要使用super()来调用父类的构造函数。并且通过子类的构造函数传入super。**

之前我们说过：当我们使用访问修饰符时，比如public，private，我们实际上是创建一个参数属性。所以ts会创建一个属性并初始化它。所以在Student类中，我们不需要在firstName和lastName中使用public修饰符，因为我们已经在Person中声明并初始化，而且继承了它。



现在我们在同一个文件声明了两个类，而关于最佳实践，我们应该实现每个类都有单独的一个文件。我们会在模块化中讲到。



#### 方法覆盖/重写方法

假如我们声明一个Teacher类，继承Person类。但是我们希望调用fullName时在前面加上professor，这时就需要用到方法重写。

```ts
class Person {
  constructor(public firstName: string, public lastName: string) {}
  get fullName(): string {
    return this.firstName + " " + this.lastName;
  }
  walk(): void {
    console.log(this.fullName + "is walking");
  }
}

class Student extends Person {
  constructor(public studentId: number, firstName: string, lastName: string) {
    super(firstName, lastName);
  }
  takeTest(): void {
    console.log(this.fullName + "is talking a test");
  }
}

class Teacher extends Person {
  override get fullName(): string {
    return "Professor " + super.fullName;
  }
}
let teacher = new Teacher("Dam", "Sim");
console.log(teacher.fullName); //Professor Dam Sim
```

我们在类中重新声明同名方法，在这个类中使用的方法就是我们新写的方法。**值得注意的是：我们应该使用`override`关键字来告诉ts编译器我们正在重写方法。以及super指向的是父类，我们可以使用super来简化代码。**

你可能会发现我们不使用override时也不会报错，**但作为最佳实践，我们应该在tsconfig.json中打开`"noImplicitOverride": true, `选项。**这时，当我们重写方法时，必须使用override（重写修饰符）来声明。



### 多态性

面向对象的非常核心的一点就是多态性。这代表一个对象可以有多种形态。

举个例子：

```ts
class Person {
  constructor(public firstName: string, public lastName: string) {}
  get fullName(): string {
    return this.firstName + " " + this.lastName;
  }
  walk(): void {
    console.log(this.fullName + "is walking");
  }
}

class Student extends Person {
  constructor(public studentId: number, firstName: string, lastName: string) {
    super(firstName, lastName);
  }
  takeTest(): void {
    console.log(this.fullName + "is talking a test");
  }
}

class Teacher extends Person {
  override get fullName(): string {
    return "Professor " + super.fullName;
  }
}

printNames([new Student(1, "kevin", "qian"), new Teacher("Mosh", "Hamedani")]);
//kevin qian
//Professor Mosh Hamedani

function printNames(people: Person[]) {
  for (let person of people) {//let person: Person
    console.log(person.fullName);
  }
}
```



我们声明了一个函数，传入类型为Person的对象组成的数组。

我们看到，每个迭代的对象的类型都为Person，但是我们可以向函数中传入Student和Teacher的实例对象。

这就是类的多态性，这是一个非常强大的功能，因为如果我们再次声明一个继承Person的类，我们可以在不改写函数的情况下传入这个类的实例对象。



现在我们新声明一个继承Person的类，并且改写fullName方法：

```ts
class Person {
  constructor(public firstName: string, public lastName: string) {}
  get fullName(): string {
    return this.firstName + " " + this.lastName;
  }
  walk(): void {
    console.log(this.fullName + "is walking");
  }
}

class Student extends Person {
  constructor(public studentId: number, firstName: string, lastName: string) {
    super(firstName, lastName);
  }
  takeTest(): void {
    console.log(this.fullName + "is talking a test");
  }
}

class Teacher extends Person {
  override get fullName(): string {
    return "Professor " + super.fullName;
  }
}

class Principal extends Person {
  override get fullName(): string {
    return "Principal " + super.fullName;
  }
}

printNames([
  new Student(1, "kevin", "qian"),
  new Teacher("Mosh", "Hamedani"),
  new Principal("sim", "red"),
]);
// kevin qian
// Professor Mosh Hamedani
// Principal sim red

function printNames(people: Person[]) {
  for (let person of people) {
    //let person: Person
    console.log(person.fullName);
  }
}
```



我们可以发现，我们在没有改变之前代码的情况下增强了我们的程序。所以我们实现新的功能时，只需要编写新的代码。

这也为我们引入了**开闭原则**

开放封闭原则（OCP，Open Closed Principle）是所有面向对象原则的核心。软件设计本身所追求的目标就是封装变化、降低耦合，而开放封闭原则正是对这一目标的最直接体现。其他的设计原则，很多时候是为实现这一目标服务的.

一个软件实体, 如类, 模块, 函数等应该对扩展开放, 对修改封闭。



实际上多态性就是对开闭原则的一个遵守，我们不可能100%的遵守开闭原则，而且这样的代价也可能是昂贵的。不过在在这里我们应该知道：多态性能够引导我们遵守这个原则。

在之前我们说到重写方法时要用到override关键字。这也是对多态行为的一种遵守。



### private和protected

我们知道，private修饰符修饰的属性和方法只允许我们在该类中使用。

而protected允许我们在继承的类中使用。但我们应该尽可能不使用protected（除非你知道你在干什么），因为这会在程序中创造耦合。



### 抽象类

假设我们要写一个程序对各种形状的物体进行渲染，比如圆形，三角形。在进行上面的学习后，我们可能会这样写：

```ts
class Shape {
  constructor(public color: string) {}
  render() {}
}

class Circle extends Shape {
  constructor(public radius: number, color: string) {
    super(color);
  }

  override render(): void {
    console.log("Rendering a circle");
  }
}

let shape = new Shape("red");
shape.render();
```

我们将Shape类作为Circle类的父类，但我们发现Shape类可以生成实例对象，这是不符合逻辑的，因为我们没有办法渲染一个”形状“。

所以，我们在这里需要用到抽象类`abstract`：

```ts
abstract class Shape {
  constructor(public color: string) {}
  abstract render(): void;
}

class Circle extends Shape {
  constructor(public radius: number, color: string) {
    super(color);
  }

  override render(): void {
    console.log("Rendering a circle");
  }
}
```

我们在`clsss`关键字前使用`abstract`关键字来声明一个抽象类。抽象方法也要用`abstract`声明（并不是说抽象类只能用抽象方法。），并且抽象方法不能具有实现。所以我们要把`{}`去掉。另外，我们还应该声明其返回值类型为void，如果不声明它会具有隐式的any类型。但抽象方法的返回值类型永远为void。此外，需要记住的是：抽象方法只能在抽象类中存在。



### 接口

假如我们要编写一个日历，我们知道有谷歌日历，outlook日历等等。根据上面我们学的，我们可能会使用抽象类来进行编写：

```ts
abstract class Calendar {
  constructor(public name: string) {}

  abstract addEvent(): void;
  abstract removeEvent(): void;
}
```

我们编译后查看js文件：

```js
"use strict";
class Calendar {
    constructor(name) {
        this.name = name;
    }
}
//# sourceMappingURL=demo.js.map
```

我们可以看到，这就是一个普通的类，因为js中没抽象类的概念。



另外，在这里我们可以使用接口来实现：

可能有些人使用`I`开头来命名接口，但我们更多的会直接使用名称。

```ts
interface Calendar {
  name: string;
  addEvent(): void;
  removeEvent(): void;
}
```

我们发现接口的代码更简洁。

编译后：

```js
"use strict";
//# sourceMappingURL=demo.js.map
```

我们发现并没有生成接口代码，因为在js中没有接口的概念，这只会在ts编译器中进行类型检查。

那我们应该使用抽象类还是接口呢？

这取决于是否提供了任何逻辑和供子类实现的方法。如果没有就使用接口。因为我们的代码会更简洁，不管是在ts中还是js中。相反的，如果我们有实现逻辑的方法或者供子类实现的方法，我们就不能使用接口了，因为接口不能有方法实现。我们只能声明方法，指定方法的签名。



我们也可以使用`extends`继承接口：

```ts
interface Calendar {
  name: string;
  addEvent(): void;
  removeEvent(): void;
}

interface CloudCalendar extends Calendar {
  sync(): void;
}
```

在类中，我们应该这样使用：

```ts
interface Calendar {
  name: string;
  addEvent(): void;
  removeEvent(): void;
}

interface CloudCalendar extends Calendar {
  sync(): void;
}

class GoogleCalendar implements CloudCalendar {
  constructor(public name: string) {}
  sync(): void {}
  addEvent(): void {}
  removeEvent(): void {}
}
```

我们在通过`implements`使用接口后，应该还在class中同样声明属性和方法。