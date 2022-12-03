---
date: 2022-12-3
category:
  - 后端
tag:
  - Rust
archive: true
---

# Rust与所有权

所有权是rust最独特的特性，它让rust无需gc就可以保证内存安全



## 什么是所有权

rust的核心特性就是所有权

所有程序在运行时都必须管理它们使用计算机内存的方式

- 有些语言有gc（垃圾收集机制），在程序运行时，它们会不断寻找不再使用的内存
- 在其他语言中，程序员必须显式分配和释放内存



而Rust采用了第三种方式：

- 内存是通过一个**所有权**系统来管理的，其中包括一组编译器在编译时检查的规则、
- 当程序运行时，所有权特性不会减慢程序的运行速度（因为在编译时就已经处理好了）



## Stack vs Heap（栈内存vs堆内存）

在rust这样的系统级编程语言中，一个值是在stack上还是在heap上对语言的行为和你为什么要做某些决定是有很大影响的。

在代码运行时，stack和heap都是你可用的内存，但它们的结构很不同。



### 存储数据

Stack按值的接收顺序来存储，按相反的顺序移除。后进先出（LIFO）

- 添加数据叫压入栈
- 移除数据叫弹出栈

**所有储存在stack上的数据必须有已知的固定大小**，编译时大小未知的数据或运行时大小可能会发生变化的数据必须存放在heap上。



Heap内存组织性差一些：

- 当你把数据放入heap时，你会请求一定数量的空间。
- 操作系统在heap里找到一块足够大的空间，把它标记为在用，并且返回一个指针，也就是这个空间的地址。
- 这个过程叫做在heap上进行分配，有时仅仅称为“分配”。



而把值压到stack上不叫分配

因为指针是已知固定大小的，可以把指针存放在stack上。但如果想要实际数据，必须使用指针来定位。

可以把这个比作去饭店，一大群人会被领到一张桌子上，而晚到的朋友也可以通过询问桌子的位置找到地方。



并且，把数据压到stack上要比在heap上分配快得多：

- 因为操作系统不需要寻找用来存储新数据的空间，那个位置永远都在stack的顶端。

在heap上分配空间需要做更多的工作：

- 操作系统首先需要找到一个足够大的空间来存放数据，然后要做好记录方便下次分配。



### 访问数据

访问heap中的数据要比访问stack中的数据慢，因为需要通过指针才能找到heap中的数据

- 对于现代的处理器来说，由于缓存的缘故，如果指令在内存中跳转的次数越少，那么速度就越快。

打个比方，如果一桌人点菜，最快的方法是全部点好后再上菜。而不是点一道上一道。



如果数据存放的距离进，处理器处理的速度会快些（stack）。反之则慢（heap）

- 在heap上分配大量的空间也是需要时间的



### 函数调用

当代码调用函数时，值被传入到函数（包括指向heap的指针）。函数本地的变量会被压到stack上，当函数结束后，这些值会从stack上弹出。



### 所有权存在的原因

所有权解决的问题：

- 跟踪代码的哪些部分在使用heap的哪些数据
- 最小化heap上的重复数据
- 清理heap上未使用的数据以避免空间不足

一旦搞明白所有权，就不需要经常去想stack或者heap了。

另外，heap数据是所有权存在的原因。



## 所有权规则

每个值都有一个变量，这个变量是该值的所有者。

每个值同时只能有一个所有者。

当所有者超出作用域（scope）时，该值应该被删除。



### 变量的作用域

scope是程序中一个项目的有效范围

```rust
fn main() {
    // s 不可用
    let s = "hello"; //s 可用
                     //可对s进行相关操作
} //s作用域到此结束，s不可再使用
```



### String类型

String比那些基础标量数据类型更复杂（它们都是储存在stack上，而String存放在heap上）

字符串字面值：程序中手写的那些字符串，它们是不可变的。

Rust还有第二种字符串类型：String

- 在heap上分配，能存储在编译时未知数量的文本



#### 创建String类型的值

可以使用from函数从字符串字面值创建出String类型

```rust
let s = String::from("hello");
```

- `::`表示from是String类型下的函数

这类的字符串是可以修改的：

```rust
fn main() {
    let mut s = String::from("hello");

    s.push_str(",World");
    println!("{}", s); //hello,World
}
```



为什么String类型的值可以修改，而字符串字面值却不能修改？

- 因为它们处理内存的方式不同



#### 内存和分配

字符串字面值，在编译时就知道他的内容了，其文本内容直接被硬编码到最终可执行文件里。

- 速度快，高效，是因为其不可变性。

String类型，为了支持可变性，需要在heap上分配内存来保存编译时未知的文本内容：

- 操作系统必须在运行时来请求内存
- - 这步需要调用`String::from`来实现
- 当用完String后，需要使用某种方式将内存返回给操作系统
- - 这步，在拥有gc的语言中，gc会跟踪并清理不再使用的内存。
  - 没有GC，就需要我们去识别内存何时不再使用，并且调用代码将其返回。
  - - 如果忘了，就会浪费内存。
    - 如果提前做了，变量就会非法。
    - 如果做了两次，也是bug。必须一次分配对应一次释放。



**而Rust采用了不同的方式：对于某个值来说，当拥有它的变量走出作用范围时，内存会立即自动的交还给操作系统。**

**drop函数**：当变量走出作用域的时候，rust会自动调用drop函数，从而实现对内存的清理。



#### 变量和数据交互的方式：移动（Move）

多个变量可以与同一个数据使用一种独特的方式来交互：

```rust
let x = 5;
let y = x;
```

整数是已知且固定大小的简单的值，这两个5被压到了stack中。



#### Move与String

```rust
let s1 = String::from("hello");
let s2 = s1;
```

运行方式与前面的情况不同。

![image-20221203202535527](https://qiankun825.oss-cn-hangzhou.aliyuncs.com/img/image-20221203202535527.png)

![image-20221203202857353](https://qiankun825.oss-cn-hangzhou.aliyuncs.com/img/image-20221203202857353.png)

为了保证内存安全：

- Rust没有尝试复制被分配的内存
- Rust让s1失效。
- - 当s1离开作用域时，Rust不需要释放任何东西。

尝试在s1赋值给s2后调用s1：`value borrowed here after move`

```rsut
2 |     let s1 = String::from("hello");
  |         -- move occurs because `s1` has type `String`, which does not implement the `Copy` trait
3 |     let s2 = s1;
  |              -- value moved here
4 |
5 |     println!("{}", s1);
  |                    ^^ value borrowed here after move
```



- 浅拷贝（shallow copy）

- 深拷贝（deep copy）

你也许将复制指针、长度、容量视为浅拷贝，但由于Rust让s1失效了，**所以我们用一个新的术语：移动（Move）**

隐含的一个设计原则：Rust不会自动创建数据的深拷贝

- 就运行时性能而言，任何自动赋值的操作都是廉价的。

![image-20221203203856430](https://qiankun825.oss-cn-hangzhou.aliyuncs.com/img/image-20221203203856430.png)

s2被移动到s1中，s1失效了。只有s2有效，所以只有s2在离开作用域时会释放内存空间。



#### Clone

如果真想对heap上的String数据进行深度拷贝，而不仅仅是stack上的数据，可以使用clone方法（针对heap上的数据）。

```rust
fn main() {
    let s1 = String::from("hello");
    let s2 = s1.clone();

    println!("{},{}", s1, s2); //hello,hello
}
```

![image-20221203204407441](https://qiankun825.oss-cn-hangzhou.aliyuncs.com/img/image-20221203204407441.png)

#### 复制（针对Stack上的数据）

```rust
fn main() {
    let x = 5;
    let y = x;

    println!("{},{}", x, y); //5 5
}
```

没用clone的原因，x是整数类型，在编译时就确定了大小。对于这种类型数据，深拷贝可浅拷贝都一样，所以不需要考虑。



Rust提供了Copy trait（接口），可以用于像整数这样完全存放在stack上面的类型。

如果一个类型实现了Copy这个trait，那么旧的变量在赋值后仍然可用。

如果一个类型或者该类型的一部分实现了Drop trait，那么Rust不允许让它再去实现Copy trait了。 

![image-20221203205411858](https://qiankun825.oss-cn-hangzhou.aliyuncs.com/img/image-20221203205411858.png)



### 所有权与函数

在语义上，将值传递给函数和把值传递给变量是类似的：

- 将值传递给函数要么将发生**移动**，要么将发生**复制**。

```rust
fn main() {
    let s = String::from("hello");

    take_ownership(s);//s被移动到函数中，后面语句中s就失效了
    // println!("{}", s); //value borrowed here after move

    let x = 5;

    make_copy(x); //5
    println!("x:{}", x); //x:5
}

fn take_ownership(some_string: String) {
    println!("{}", some_string);
}

fn make_copy(some_number: i32) {
    println!("{}", some_number);
}
```



### 返回值与作用域

函数在返回值的过程中同样也会发生所有权的转移

```rust
fn main() {
    let s1 = gives_ownership();

    let s2 = String::from("hello");

    let s3 = take_and_gives_back(s2);
}

fn gives_ownership() -> String {
    let some_string = String::from("hello");
    some_string
}

fn take_and_gives_back(a_string: String) -> String {
    a_string
}
```

上面例子中，第2行s1进入作用域，调用了`gives_ownership`，这个函数在第10行声明了`some_string`，some_string进入函数的作用域，在11行作为返回值移动到main函数中，也就是将some_string移动给s1。

在4行声明了s2，在6行移动到`take_and_gives_back`中，a_string作为返回值又移动给了s3。这个函数就是取得了a_string的所有权并且将其返回，返回值又被移动到s3上面。

在7行`}`结束后，s1，s3销毁，s2因为之前已经**移动**了所以不会有动作。



一个变量的所有权总是遵循同样的模式：

- 把一个值赋给其他变量时就会发生移动
- 当一个包含heap数据的变量离开作用域时，它的值就会被drop函数清理，除非数据的所有权移动到另一个变量上了。



#### 如何让函数使用某个值，但又不获得其所有权？

```rust
fn main() {
    let s1 = String::from("hello");

    let (s2, len) = calculate_length(s1);

    println!("The length of '{}' is {}.", s2, len); //The length of 'hello' is 5.
}

fn calculate_length(s: String) -> (String, usize) {
    let length = s.len();

    (s, length)
}
```

这样非常麻烦，因为我们将s1传进去，然后又将其作为结果返回。然而这又是一个常见的场景。

对此，Rust有一个特性叫“引用（Reference）”。



## 引用和借用

```rust
fn main() {
    let s1 = String::from("hello");

    let len = calculate_length(&s1);

    println!("The length of '{}' is {}.", s1, len); //The length of 'hello' is 5.
}

fn calculate_length(s: &String) -> usize {
    s.len()
}
```

参数类型是`&String`而不是`String`

`&`符号就表示引用：允许你引用某些值而不取得其所有权

![image-20221203225307463](https://qiankun825.oss-cn-hangzhou.aliyuncs.com/img/image-20221203225307463.png)

上图表示s是s1的引用，它指向s1。然后s1也是一个指针，它指向了存在于heap上的数据。



在上面的代码中，我们传入的是s1的引用，它指向s1，但它并不拥有s1。所以s1不会被清理，在函数中，s并不具有所指向字符串的所有权，所以它所指向的那个值不会被清理掉。



是否可以修改借用的值？

- 不行

```rust
s.push_str(",world"); //cannot borrow `s` as mutable, as it is behind a `&` reference
```

和变量一样，引用默认也是不可变的



### 可变引用

```rust
fn main() {
    let mut s1 = String::from("hello");

    let len = calculate_length(&mut s1);

    println!("The length of '{}' is {}.", s1, len); //The length of 'hello,world' is 11.
}

fn calculate_length(s: &mut String) -> usize {
    s.push_str(",world");
    s.len()
}
```



#### 可变引用有一个重要的限制：

在特定的作用域内，对某一块数据，只能有一个可变的引用。

```rust
let mut s = String::from("hello");

let s1 = &mut s;
let s2 = &mut s; //cannot borrow `s` as mutable more than once at a time

println!("The length of '{}' is {}.", s1, s2);
```

- 这样做的好处是可以在编译时防止数据竞争。
- 以下三种行为会发生数据竞争：
- - 两个或多个指针同时访问一个数据
  - 至少一个指针用于写入数据
  - 没有使用任何机制来同步对数据的访问

数据竞争在运行时很难被发现，所以rust做了一个根本的解决——在编译时报错、

我们可以通过创建新的作用域，来允许非同时（不在一个作用域）的创建多个可变引用：

```rust
fn main() {
    let mut s = String::from("hello");
    {
        let s1 = &mut s;
    }
    let s2 = &mut s;
}
```



#### 另一个限制：

不可以同时拥有一个可变引用和一个不可变引用。

多个不可变的引用是可以的

```rust
let mut s = String::from("hello");
let r1 = &s;
let r2 = &s;
let s1 = &mut s; //cannot borrow `s` as mutable because it is also borrowed as immutable

println!("{} {} {}", r1, r2, s1);
```

另外，引用的作用域是“从声明到最后一次使用”。



#### 悬空引用Dangling References

悬空指针（Dangling Pointer）：一个指针引用了内存中的某个地址，而这块内存可能已经释放并分配给其他人使用了。

在Rust中，编译器可保证引用永远不会悬空，如果你引用了某些数据，编译器将保证在引用离开作用域之前数据不会离开作用域

在编译阶段将会报错：

```rust
fn main() {
    let r = dangle();
}

fn dangle() -> &String {//error:missing lifetime specifier
    let s = String::from("hello");
    &s
}
```

上面的例子中，假设能编译通过：在8行s被销毁，s的引用&s却返回了，指向了一个已经被释放的内存，这就叫悬空引用。而rust在编译阶段就进行了报错。



引用规则：

1.在任何给定的时刻，只能满足下列条件之一：

- 一个可变的引用
- 任何数量不可变的引用

2.引用必须一直有效  