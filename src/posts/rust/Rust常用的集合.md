# Rust常用的集合

Rust标准库中内置了许多集合，这与temple有区别，集合是被存放在heap堆内存上，并且不需要声明时就指定长度，这也使其更加灵活。

我们常用的集合为：Vector，String，HashMap



## Vector

### 使用Vector存储多个值

Vector类型为`Vec<T>`，其中关于Vector我们需要知道的是：

- 它由标准库提供
- 可以存储多个值
- 只能存储相同类型的数据
- 值在内存中是连续存放的



### 创建Vector

我们可以使用`Vec::new()`来创建一个Vector：

```rust
fn main() {
    let v: Vec<i32> = Vec::new();
}
```

通常我们不需要显示的指明vector的类型，当我们存入一个数据时，编译器会将这个值的类型作为vector的类型。