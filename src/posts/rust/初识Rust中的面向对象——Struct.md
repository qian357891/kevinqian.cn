---
date: 2022-12-4
category:
  - 后端
tag:
  - Rust
archive: true
---



> Rust是一门支持多范式的编程语言，在Rust中，我们可以通过Struct很好的进行面向对象编程。本篇文章将介绍Rust的Struct。

# 初识Rust中的面向对象——Struct

什么是Struct？这是Rust面向对象的解决方案。

struct——结构体，通常有以下用途：

- 自定义的数据类型。
- 为相关联的值命名，打包=>有意义的组合。

## 1.定义并实例化Struct

### 定义struct

- 使用`struct`关键字，并且为整个struct命名
- 在花括号内，为所有**字段（Field）**定义名称和类型

例如：

```rust
struct User {
    username: String,
    email: String,
    sign_in_count: u64,
    active: bool,
}
```

每个`key:value`以`,`隔开，最后一项也要加`,`



### 实例化struct

想要使用struct，需要创建struct的实例：

- 为每个字段指定具体值
- 无需按声明的顺序进行指定

例子：

```rust
struct User {
    username: String,
    email: String,
    sign_in_count: u64,
    active: bool,
}

fn main() {
    let user1 = User {
        email: String::from("kevinqian@qian.com"),
        username: String::from("KevinQian"),
        active: true,
        sign_in_count: 886,
    };
}
```



### 取得struct的某个值

使用点标记法`.`：

如果要改变struct的某个值，需要在实例化时使用mut关键字

```rust
struct User {
    username: String,
    email: String,
    sign_in_count: u64,
    active: bool,
}

fn main() {
    let mut user1 = User {
        email: String::from("kevinqian@qian.com"),
        username: String::from("KevinQian"),
        active: true,
        sign_in_count: 886,
    };
    user1.email = String::from("888@qq.com");
    println!("{}", user1.active); //true
}
```

**注意：一旦struct的实例是可变的，那么实例中所有的字段都是可变的。**



### struct作为函数的返回值

```rust
fn build_user(email: String, username: String) -> User {
    User {
        username: username,
        email: email,
        sign_in_count: 1,
        active: true,
    }
}
```



### 字段初始化简写

**与js的解构语法相似，当字段名与字段值对应变量名相同时，就可以使用字段初始化简写的方式：**

```rust
fn build_user(email: String, username: String) -> User {
    User {
        username,
        email,
        sign_in_count: 1,
        active: true,
    }
}
```



### struct更新语法

当你想基于某个struct实例来创建一个新实例时（某些值与原值相同），可以使用struct更新语法：

如果我们不使用这个语法，我们写出来的代码是这样的：

```rust
let user2 = User {
    email: String::from("kevinqian@qian.com"),
    username: String::from("KevinQian"),
    active: user1.active,
    sign_in_count: user1.sign_in_count,
};
```

**类似于js中的剩余操作符，在Rust中我们可以使用struct的更新语法来进行简写：**

```rsut
let user2 = User {
    email: String::from("kevinqian@qian.com"),
    username: String::from("KevinQian"),
    ..user1//注意不需要逗号,
};
```



### Tuple struct

可定义类似tuple的struct，叫做tuple struct

- Tuple struct整体有个名，但里面的元素没有名
- 适用：想给整个tuple起名，并让它不同于其它tuple，而且又不需要给每个元素起名

定义tuple struct：使用struct关键字，后边是名字，以及里面元素的类型

例子：

```rust
struct Color(i32, i32, i32);
struct Point(i32, i32, i32);
let black = Color(0, 0, 0);
let origin = Point(0, 0, 0);
println!("{},{},{}", black.0, black.1, black.2); //0,0,0
```

注意：black和origin是不同的类型，即使它们的值相同。因为它们是不同tuple struct的实例。



### Unit-Like Struct（没有任何字段）

可以定义没有任何字段的struct，叫做Unit-Like Struct（因为与（），单元类型类型）

适用于需要在某个类型上实现某个trait（接口），但是在里面又没有想要存储的数据



### Struct数据的所有权

```rust
struct User {
    username: String,
    email: String,
    sign_in_count: u64,
    active: bool,
}
```

上面的字段使用了String而不是&str：

- 该Struct实例拥有其所有的数据
- 只要struct实例是有效的，那么里面的字段数据也是有效的

struct里也可以存放引用，但这需要使用生命周期

- 生命周期保证只要struct实例是有效的，那么里面的引用也是有效的。

- 如果struct里面存储引用，而不使用生命周期，就会报错：

```rsut
struct User {
  username: &String, //missing lifetime specifier
  email: &String,
  sign_in_count: u64,
  active: bool,
}
```

  

## Struct例子

计算长方形面积

如果我们直接使用函数：

```rust
fn main() {
    let w = 30;
    let l = 50;

    println!("{}", area(w, l)); //1500
}

fn area(width: u32, length: u32) -> u32 {
    width * length
}
```



我们使用元组作为函数参数：

```rust
fn main() {
    let rect = (30, 50);

    println!("{}", area(rect)); //1500
}

fn area(dim: (u32, u32)) -> u32 {
    dim.0 * dim.1
}
```

这样看来我们将长和宽放在一起了，但代码的可读性更差了，我们分不清楚哪个是长哪个是宽



我们可以使用struct来写这段代码：

```rust
struct Rectangle {
    width: u32,
    length: u32,
}

fn main() {
    let rect = Rectangle {
        width: 30,
        length: 50,
    };

    println!("{}", area(&rect)); //1500
}

fn area(rect: &Rectangle) -> u32 {
    rect.width * rect.length
}
```



在上面的例子中，我们的函数中使用的&Rectangle，借用了Rectangle的一个实例rect。所以在我们传入了rect后依然可以使用rect：

```rust
println!("{}", rect); //`Rectangle` doesn't implement `std::fmt::Display`
```

我们在12行后输入了以下代码，但是报错了：`Rectangle` doesn't implement `std::fmt::Display`

这是因为我们使用`prinln!()`这个宏，通过`{}`来进行打印的时候，默认使用的是`std::fmt::Display`这个trait（接口）



我们按照编译器的提示：use `{:?}` (or `{:#?}` for pretty-print) instead

```rust
println!("{:?}", rect); //`Rectangle` doesn't implement `Debug`
```

编译器提示：note: add `#[derive(Debug)]` to `Rectangle` or manually `impl Debug for Rectangle`

我们将这段加入我们`struct`的上面，执行成功：

```rust
#[derive(Debug)]
struct Rectangle {
    width: u32,
    length: u32,
}
//...
println!("{:?}", rect);//Rectangle { width: 30, length: 50 }
```

rust编译器提供了打印调试信息的功能（debug），但我们需要在struct进行手动打开。就是在struct上加入`#[derive(Debug)]`

但是这样打印出的数据太紧凑了，我们可以在`:`和`？`之间加入`#`：

```rust
#[derive(Debug)]
struct Rectangle {
    width: u32,
    length: u32,
}
//...
println!("{:#?}", rect);
// Rectangle {
//     width: 30,
//     length: 50,
// }
```



实际上，Rust提供了很多trait让我们可以进行derive（派生），这可以对我们自定义的类型添加许多功能。

上面的`#[derive(Debug)]`就让我们的struct使用了`std::fmt::Debug`方法。



### struct的方法

方法与函数类似：fn关键字、名称、参数、返回值

方法与函数的不同之处：

- 方法是在struct（或enum、trait对象）的上下文中的定义
- 第一个参数是self，表示方法被调用的struct实例



#### 定义方法

在impl块中定义方法

方法的第一个参数可以是&self，也可以获得其所有权或可变借用。和其他参数一样。

```rust
#[derive(Debug)]
struct Rectangle {
    width: u32,
    length: u32,
}

impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.length
    }
}

fn main() {
    let rect = Rectangle {
        width: 30,
        length: 50,
    };

    println!("{}", rect.area()); //1500
    println!("{:#?}", rect);
    // Rectangle {
    //     width: 30,
    //     length: 50,
    // }
}
```

通过impl块，我们可以获取更好的代码组织。



#### 方法调用的运算符

Rust会自动引用或者解引用

- 在调用方法时就会发生这种行为

在调用方法时，Rust根据情况自动添加&、&mut或者*（解引用），以便object可以匹配方法的签名。

下面两行代码效果相同：

```rust
p1.distance(&p2);//distance(&self,&p)
(&p1).distance(&p2);
```



#### 方法参数

```rust
#[derive(Debug)]
struct Rectangle {
    width: u32,
    length: u32,
}

impl Rectangle {
    fn can_hold(&self, other: &Rectangle) -> bool {
        self.width > other.width && self.length > other.length
    }
}

fn main() {
    let rect1 = Rectangle {
        length: 30,
        width: 50,
    };
    let rect2 = Rectangle {
        length: 10,
        width: 40,
    };
    let rect3 = Rectangle {
        length: 35,
        width: 55,
    };

    println!("{}", rect1.can_hold(&rect2)); //true
    println!("{}", rect1.can_hold(&rect3)); //false
}
```



#### 关联函数

可以在impl块里定义不把self作为第一个参数的函数，它们叫关联函数（不是方法）。关联函数可以理解为静态方法（比如js中，静态方法只能用类调用）。

- 例如：`String::from()`

关联函数通常用于构造器：

```rust
#[derive(Debug)]
struct Rectangle {
    width: u32,
    length: u32,
}

impl Rectangle {
//...
    fn square(size: u32) -> Rectangle {
        Rectangle {
            width: size,
            length: size,
        }
    }
}

fn main() {
    let s = Rectangle::square(20);
}

```



调用的时候使用`::`符号而不是`.`

`::`既可以用于关联函数，还可以运用于模块创建的命名空间



#### 多个impl块

每个struct允许拥有多个impl块：

```rust
struct Rectangle {
    width: u32,
    length: u32,
}

impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.length
    }

    fn can_hold(&self, other: &Rectangle) -> bool {
        self.width > other.width && self.length > other.length
    }
}

impl Rectangle {
    fn square(size: u32) -> Rectangle {
        Rectangle {
            width: size,
            length: size,
        }
    }
}
```

我们可以像上面这样写，但是在这个例子中我们这样做没啥必要。