---
date: 2023-01-01
category:
  - 后端
tag:
  - Java
archive: true
---



# Java面向对象的一些特性

> 之前主要用的JS/TS，而且Rust的面向对象有些特殊。Java与JS/TS相比，在面向对象方面有许多特性。所以用一篇文章记录一下这些特性。

### 类的静态代码块

实例对象可以调用类的静态属性/方法。

Java中可以在类中声明静态代码块，当类加载完成后进行自动调用

```java
public class demo3 {
    public static void main(String[] args) {
        new Demo();
        Demo.fn();
        new Demo();//只执行一次（测试静态代码块...）
    }
}
class Demo {
    static {
        System.out.println("测试静态代码块...");
    }
    static void fn(){
        System.out.println("一个静态方法");
    }
}
```



并且可以声明多个静态代码块：

```java
public class demo3 {
    public static void main(String[] args) {
        new Demo();
        Demo.fn();
        new Demo();
        /*
         测试静态代码块1...
         测试静态代码块2...
         测试静态代码块3...
         一个静态方法
        */
    }
}
class Demo {
    static {
        System.out.println("测试静态代码块1...");
    }
    static {
        System.out.println("测试静态代码块2...");
    }
    static {
        System.out.println("测试静态代码块3...");
    }
    static void fn(){
        System.out.println("一个静态方法");
    }
}

```



### 类的代码块

我们也可以声明代码块来时对象生成时进行自动调用：

```java
public class demo3 {
    public static void main(String[] args) {
        new Demo();
        /*
        测试静态代码块1...
        测试静态代码块2...
        测试静态代码块3...
        1
        2
        3
        */
    }
}
class Demo {
    static {
        System.out.println("测试静态代码块1...");
    }static {
        System.out.println("测试静态代码块2...");
    }static {
        System.out.println("测试静态代码块3...");
    }
    {
        System.out.println("1");
        System.out.println("2");
    }
    {
        System.out.println("3");
    }
}
```



### package与import

一般情况下声明类使用全名（包名+类名）

```java
new java.util.Date();
```

可import导入（package后class前）：

```java
package oop;
import java.util.Date;
//import java.util.*;导入java.util下的所有类

public class OopPackage {
    public static void main(String[] args) {
        new Date();
    }
}
```



`java.lang`下的可省略，java虚拟机会自动添加。如：

```java
String s = "ssss";
java.lang.String s1 = "ssss";
```



如果在使用时用到了不同包中的同名类，还是要加上包名

```java
package oop;

import java.util.*;
import java.sql.Date;

public class OopPackage {
    public static void main(String[] args) {
        java.util.Date d = new java.util.Date();
        java.sql.Date dd = new java.sql.Date(2022,12,31);
    }
}
```



### 实例对象

java中声明构造方法为`方法名(){}`（没有`constructor`关键字）

构造方法中的代码会在new一个实例对象时进行执行，如果类中没有声明构造方法，会自动声明一个空的构造方法。`new Lang()`中的`()`就是在调用构造方法。

```java
public class OopPackage {
    public static void main(String[] args) {
        Lang lang = new Lang();
        /*
        静态代码块
        代码块
        构造方法
        */
    }
}
class Lang{
    Lang(){
        System.out.println("构造方法");
    }
    {
        System.out.println("代码块");
    }
    static {
        System.out.println("静态代码块");
    }
}
```

我们可以看到构造方法在类的代码块后执行（另外，类的代码块在静态代码块后执行）



当父类的构造方法有参数时，子类需要在构造方法中调用`super(参数)`。而父类的构造方法为默认（没声明，JVM自动声明）或者无参，则不需要调用`super()`，JVM会自动调用。

```java
public class OopPackage {
    public static void main(String[] args) {
        Lang lang = new Lang("Chinese");
        System.out.println(lang.name);//Chinese
        CLang clang = new CLang("rust");
        System.out.println(clang.name);//rust
    }
}
class Lang{
    String name;
    Lang(String name){
        this.name = name;
    }
}
class CLang extends Lang{
    CLang(String name){
        super(name);
    }
}
```



在使用`new`关键字时，会先开辟内存空间实例化一个对象，再调用构造方法对属性进行初始化，而调用`super(参数)`则是为了初始化父类属性。

在前面了解到类中的代码块会在构造实例对象时会调用代码块，所以代码块会先执行，然后执行构造方法的代码。

需要注意的是：多次声明实例对象，一个类中的静态代码块只会执行一次。而继承的代码块会执行多次。另外，由于会调用`super()`，也就是父类的构造方法，所以也会调用多次父类中构造方法的代码。

```java
public class OopPackage {
    public static void main(String[] args) {
        Cpp c1 = new Cpp("s");
        Cpp c2 = new Cpp("ss");
        Cpp c3 = new Cpp("sss");
//        Lang static
//        CLang static
//        Cpp static
//        Lang 代码块
//        Lang 构造方法s
//        CLang 代码块
//        CLang 构造方法s
//        Cpp 代码块
//        Cpp 构造方法s
//
//        Lang 代码块
//        Lang 构造方法ss
//        CLang 代码块
//        CLang 构造方法ss
//        Cpp 代码块
//        Cpp 构造方法ss
//
//        Lang 代码块
//        Lang 构造方法sss
//        CLang 代码块
//        CLang 构造方法sss
//        Cpp 代码块
//        Cpp 构造方法sss
    }
}
class Lang{
    String name;
    Lang(String name){
        this.name = name;
        System.out.println("Lang 构造方法"+this.name);
    }
    {
        System.out.println("Lang 代码块");
    }
    static {
        System.out.println("Lang static");
    }
}
class CLang extends Lang{
    CLang(String name){
        super(name);
        System.out.println("CLang 构造方法"+this.name);
    }
    {
        System.out.println("CLang 代码块");
    }
    static {
        System.out.println("CLang static");
    }
}

class Cpp extends CLang{
    Cpp(String name){
        super(name);
        System.out.println("Cpp 构造方法"+this.name+"\n");
    }
    {
        System.out.println("Cpp 代码块");
    }
    static {
        System.out.println("Cpp static");
    }
}
```



### 多态

多态是对对象在不同场景下进行约束，一个对象可以使用的功能取决于它的类型。

```java
public class OopPackage {
    public static void main(String[] args) {
        Lang l1 = new CLang();
//        l1.fn();// 报错
        CLang l2 = new CLang();
        l2.fn();
    }
}
class Lang{
}
class CLang extends Lang{
    void fn(){
        System.out.println("this is fn");
    }
}

class GoLang extends Lang{
    void oop(){
        System.out.println("this is oop");
    }
}
```



### 方法重载

一个类中，同名的方法/属性只能声明一次。同名方法指的是：方法名相同，参数列表相同，与返回值类型无关。

我们可以在一个类中声明方法名相同，但参数列表不同的方法。它们会被认为是不同是方法，这样的操作叫方法重载（注意，参数列表的类型一致，就算形参名不同也被认为是同一个方法：22-24行。需要参数个数、类型、顺序不同）。

```java
public class Oop_14 {
    public static void main(String[] args) {
        User user = new User();
        user.login("kevin","kevin123");
        user.login("WXkevin");
        user.login(1333);
//        用户名密码登录
//        微信登录
//        手机号登录
    }
}
class User{
    void login(String username,String password){
        System.out.println("用户名密码登录");
    }
    void login(int tel){
        System.out.println("手机号登录");
    }
    void login(String wx){
        System.out.println("微信登录");
    }
//    void login(String zfb){
//        System.out.println("支付宝登录");
//    } //被认为与微信登录为同一个方法
}
```



当然，构造方法也能方法重载：

```java
public class Oop_14 {
    public static void main(String[] args) {
        User user = new User("kevin");
        User user1 = new User(1333);
        //    用户名是：kevin
        //    电话号是：1333
    }
}
class User{
    User(String username){
        System.out.println("用户名是："+username);
    }
    User(int tel){
        System.out.println("电话号是："+tel);
    }
}
```



构造方法与默认参数：

```java
public class Oop_15 {
    public static void main(String[] args) {
        Users users = new Users();
        Users users1 = new Users("Deno");
        Users users2 = new Users("Bun",1222);
    }
//    kevin,133
//    Deno,133
//    Bun,1222
}

class Users{
    Users(){
        this("kevin");
    }
    Users(String name){
        this(name,133);
    }
    Users(String name,int tel){
        System.out.println(name+","+tel);
    }
}
```



#### 方法重载与类型转换

我们知道一个java文件就是一个类，我们直接在类文件中重载方法来测试数值类型传参的精度转换：

```java
public class Oop_142 {
    public static void main(String[] args) {
        byte b = 10;
        demo(b);//byte
    }
    static void demo(byte i){
        System.out.println("byte");
    }
    static void demo(short i){
        System.out.println("short");
    }
    static void demo(int i){
        System.out.println("int");
    }
    static void demo(long i){
        System.out.println("long");
    }
    static void demo(char i){
        System.out.println("char");
    }
}
```

删去byte

```java
public class Oop_142 {
    public static void main(String[] args) {
        byte b = 10;
        demo(b);//short
    }
    static void demo(short i){
        System.out.println("short");
    }
    static void demo(int i){
        System.out.println("int");
    }
    static void demo(long i){
        System.out.println("long");
    }
    static void demo(char i){
        System.out.println("char");
    }
}
```

删去short

```java
public class Oop_142 {
    public static void main(String[] args) {
        byte b = 10;
        demo(b);//int
    }
    static void demo(int i){
        System.out.println("int");
    }
    static void demo(long i){
        System.out.println("long");
    }
    static void demo(char i){
        System.out.println("char");
    }
}
```

删去int

```java
public class Oop_142 {
    public static void main(String[] args) {
        byte b = 10;
        demo(b);//long
    }
    static void demo(long i){
        System.out.println("long");
    }
    static void demo(char i){
        System.out.println("char");
    }
}
```

删去long

```java
public class Oop_142 {
    public static void main(String[] args) {
        byte b = 10;
        demo(b);//报错：因为byte不能转为char，char没有负数，而byte有
    }

    static void demo(char i){
        System.out.println("char");
    }
}
```



#### 方法重载与多态

```java
public class Oop_143 {
    public static void main(String[] args) {
        AA bb = new BB();
        test(bb);//aaa
        BB bb1 = new BB();
        test(bb1);//bbb
    }
    static void test(AA a){
        System.out.println("aaa");
    }
    static void test(BB b){
        System.out.println("bbb");
    }
}
class AA{
}
class BB extends AA{
}
```



类似JS的原型链，在传参时，对于对象这种引用类型。如果类型不一致，则会去找它的父类：

```java

public class Oop_143 {
    public static void main(String[] args) {
        BB bb = new BB();
        test(bb);//aaa
    }
    static void test(AA a){
        System.out.println("aaa");
    }
}
class AA{
}
class BB extends AA{
}
```



### 方法重写

子类声明父类的相同方法（返回类型、参数类型、方法名一致）会重写方法。建议写上`@Override`，这个注释会告诉编译器检查这个方法，保证父类要包含一个被该方法重写的方法，否则就会编译出错。这样可以帮助程序员避免一些低级错误。

```java
class Parent{
    void demo(){
        System.out.println("父类方法");
    }
}
class Child extends Parent{
    @Override
    void demo() {
        super.demo();
    }
}
```



我们之前了解到：对象使用什么方法取决于它的类型，我们看看下面这个例子：

```java
public class Oop_15_2 {
    public static void main(String[] args) {
        Ccc ddd = new Ddd();
        System.out.println(ddd.sum());//40
    }
}
class Ccc{
    int i = 10;
    int sum(){
       return i+=10;
    }
}
class Ddd extends Ccc{
    int i = 20;

    @Override
    int sum() {
        return i+=20;
    }
}
```

可以看到，虽然`ddd`的类型是`Ccc`。之前说对象能使用什么方法/属性，取决于类型。但是具体怎么使用，得看具体的对象。比如这个实例对象的类中重写了父类的方法，所以用的的`Ddd`类中的`sum()`方法。



需要注意的是：下面例子`Ccc`类中方法中的`i`是`this.i`，所以在调用时使用的`id `值为10而不是20。

```java
public class Oop_15_2 {
    public static void main(String[] args) {
        Ccc ddd = new Ddd();
        System.out.println(ddd.sum());//20
    }
}
class Ccc{
    int i = 10;
    int sum(){
       return i+=10;
    }
}
class Ddd extends Ccc{
    int i = 20;
}
```



在看一个例子：

```java
public class Oop_15_2 {
    public static void main(String[] args) {
        Ccc ddd = new Ddd();
        System.out.println(ddd.sum());//30
    }
}
class Ccc{
    int i = 10;
    int sum(){
       return getI()+10;
    }
    int getI() {
        return i;
    }
}
class Ddd extends Ccc{
    int i = 20;
    @Override
    int getI() {
        return i;
    }
}
```

在上面这个例子中，sum只存在于父类，而返回值是`getI()+10`。在子类中我们重写了`getI()`，子类中的`getI()`返回值为`i=20`，所以这里`sum()`的返回值为`20+10`



### 递归

求奇数和与阶乘：

```java
package oop;

public class Oop_16 {
    public static void main(String[] args) {
        System.out.println(sum(9));//25
        System.out.println(jiecheng(5));//120
    }
    static int sum(int n){
        n = (n+1)%2==0 ? n: --n;
        return n < 0 ? 0: n+sum(n-2);
    }
    static int jiecheng(int n){
        return n == 1 ? 1 : n * jiecheng(n-1);
    }
}
```



### 访问权限

下面关键字表示的权限由小到大：

1.private：只有该类中可以使用

2.(default)：JVM虚拟机默认添加，包权限（同个package中可以直接使用而不用import）。

3.protected：子类可以使用

4.public：公共的

|           | **同一个类** | **同一个包** | **不同包的子类** | **不同包的非子类** |
| --------- | ------------ | ------------ | ---------------- | ------------------ |
| Private   | √            |              |                  |                    |
| Default   | √            | √            |                  |                    |
| Protected | √            | √            | √                |                    |
| Public    | √            | √            | √                | √                  |



#### private

同类中使用

声明私有属性/方法，只有该类中可以使用：

```java
public class Oop_17 {
    public static void main(String[] args) {
        DemoClass demo = new DemoClass();
        demo.test();//kevin
//        demo.name;//报错，因为name是私有属性
    }
}
class DemoClass{
    private String name = "kevin";
    void test(){
        System.out.println(name);
    }
}
```



#### default

同类，同包中使用

如果没有修饰词声明访问权限，JVM会自动添加default修饰词。这个修饰词表示的访问权限为**包访问权限**，只能在同一个包中访问。在同一个包中可以任意访问。



#### protected

同类，同包，子类中使用

我们先看一个例子：

我们在`java.lang.Object`中找到`clone()`方法，这个方法的访问权限为`protected`，我们声明的类都继承自`Object`类，那我们声明一个类，能否使用`clone()`方法呢？

```java
package oop;

public class Father {
    public static void main(String[] args) {
        Person person = new Person();
//        person.clone();//'clone()' 在 'java.lang.Object' 中具有 protected 访问权限
    }
}
class Person{}
```

我们得到了报错：`clone()` 在 `java.lang.Object`中具有 protected 访问权限

这是因为Father类的父类虽然与Person类的父类都是Object，但它们的super不是指向的同一个。而在这里是由Father去访问clone，但是访问的是person的clone，所以无法访问。



我们可以这样来调用`clone()`方法：

```java
class Person{
    void test() throws Exception{
        clone();
    }
}
```



关于protected的一些结论：

- 同一包内，普通类或子类都可以访问父类的protected方法；
- 不同包内，在子类中创建**子类对象**可以访问父类的protected方法；
- 不同包内，在子类中创建**父类对象**不能访问父类的protected方法；
- 不同包内，在子类中创建另一个子类的对象不能访问公共父类的protected方法；
- 父类protected方法加上static修饰符，子类可以直接访问父类的protected方法。



同一包内，普通类或子类都可以访问父类的protected方法；

```java
package oop;

public class Father {
    protected void test(){
        System.out.println("father protected");
    }
}

class Person1 extends Father {
    void demo(){
        Father father = new Father();
        father.test();
        test();
    }
}
class Person2{
    void demo(){
        Father father = new Father();
        father.test();
    }
}
```



不同包下，在子类中只要是通过**引用父类**（多态），不可以访问其protected方法；

但是通过**引用子类**，可以访问其protected方法；

```java
//包oop
package oop;

public class Father {
    protected void test(){
        System.out.println("father protected");
    }
}



//包oop_1
package oop_1;

import oop.Father;

public class Son extends Father {
    public static void main(String[] args) {
        Father son1 = new Son();
//      son1.test();//'test()' 在 'oop.Father' 中具有 protected 访问权限

        Son son = new Son();
        son.test();//father protected
    }
}
```



父类protected方法加上static修饰符，子类可以直接访问父类的protected方法。

```java
//包oop
package oop;

public class Father {
    static protected void test(){
        System.out.println("father protected");
    }
}

//包oop_1
package oop_1;

import oop.Father;

public class Son extends Father {
    public static void main(String[] args) {
        test();//子类中可以直接访问
    }
}
```

而不同包非子类不能访问：

```java
package oop;

public class Father {
    static protected void test(){
        System.out.println("father protected");
    }
}


package oop_1;

import oop.Father;

public class Son {
    public static void main(String[] args) {
//        Father.test();//'test()' 在 'oop.Father' 中具有 protected 访问权限
    }
}
```







#### public

公共的

public修饰词的访问权限最大，表示随意访问。

下例文件位置与`oop.Oop_16`不在同一个包下

```java
import oop.Oop_16;

public class Main {
    public static void main(String[] args) {
        Oop_16 oop16 = new Oop_16();
    }
}
```



我们在一个Java源文件中可以看到有个公共类，类名与Java文件名一致。在Java文件中只能有一个公共类，并且类名为文件名。

另外，类中有个主函数。它的修饰词为：`public static`。使用`public`是因为该方法由JVM虚拟机调用，而public作为最大的访问权限，可以任意访问。而使用`static`是因为在调用时不需要实例对象，就算能够构建实例对象，JVM也不知道该如何传参。所以主函数`main`方法是由文件类来调用，故使用`static`关键字。

```java
public class Oop_17 {
    public static void main(String[] args) {

    }
}
//public class NNN{}//报错：public class NNN应该在NNN.java中声明
```

同时，一个文件中也可以有多个main方法（在不同类中声明）



### 内部类

外部类：直接在源码中声明的类，如下例的`Oop_18`，`OuterClass`。内部类：在外部类中声明的类，可以多层嵌套内部类。

Java中不允许外部类使用private，protected关键字。内部类作为外部类的一个属性使用，内部类可以使用private，protected关键字。

```java
package oop;

public class Oop_18 {
    public static void main(String[] args) {
        OuterClass outer = new OuterClass();
        OuterClass.InnerClass inner = outer.new InnerClass();
        OuterClass.InnerClass.InInner inInner = inner.new InInner();
    }
}

class OuterClass{
    public class InnerClass{
        protected class InInner{

        }
    }
}
```

因为内部类被当做外部类的属性使用，所以我们使用的时候也应该构建实例对象（不使用static）。

当然，由于内部类被当做属性看待，我们也可以使用static关键字来让外部类直接访问。

```java
package oop;

public class Oop_18 {
    public static void main(String[] args) {
        OuterClass.InnerClass.test();//Inner test
    }
}

class OuterClass{
     static public class InnerClass{
        static void test(){
            System.out.println("Inner test");
        }
    }
}
```



### 单例模式

在不显式声明构造方法时JVM会自动声明一个由`public`修饰的无参构造方法。同时，构造方法也是可以使用`private`，`protected`修饰的。我们有时会使用`private`修饰构造方法，这样做的原因有两个：

- 类的构造过程很复杂
- 为了减少类构造对象时的资源消耗

我们先来尝试写一些代码：

```java
package oop;

public class Oop_19 {
    public static void main(String[] args) {
        User_19 user19 = User_19.getInstance();
    }
}
class User_19{
    private User_19(){}
    static User_19 getInstance(){
        return new User_19();
    }
}
```

然而这样并没有解决减少创建对象时的资源消耗，我们多次调用`User_19.getInstance()`和`new User_19()`的效果是相同的，我们希望不管调用多少次`User_19.getInstance()`都是指向的同一个对象，接下来我们来修改下代码：

```java
package oop;

public class Oop_19 {
    public static void main(String[] args) {
        User_19 user19 = User_19.getInstance();
        User_19 user19_1 = User_19.getInstance();
        User_19 user19_2 = User_19.getInstance();
        System.out.println(user19==user19_2);//true
    }
}
class User_19{
    static User_19 user19 = null;
    private User_19(){}
    static User_19 getInstance(){
        if (user19 == null){
            user19 = new User_19();
        }
        return user19;
    }
}
```

这时候不管声明多少次，都会指向同一个实例对象。这个设计模式叫做单例模式。



### final

#### 修饰变量/属性

Java中使用final来声明常量。

我们可以使用final修饰变量，声明时可以不初始化值。但是无法进行调用：

```java
final String s;
//System.out.println(s);//变量 's' 可能尚未初始化
```

使用final声明的变量无法修改（常量）

我们也可以在类中声明常量属性，但是需要进行初始化：

```java
public class Oop_21 {
    public static void main(String[] args) {
        final String s = "kevin";
//        s = "ss";//无法将值赋给 final 变量 's'
    }
}
class OopFinal{
    final int tel = 1333;
    void change(){
//        this.tel = 1222;//无法将值赋给 final 变量 'tel'
    }
}
```

我们也可以通过构造方法来对常量属性进行初始化，这样会更加灵活：

```java
public class Oop_21 {
    public static void main(String[] args) {
        OopFinal oopFinal = new OopFinal(1349999);
//        oopFinal.tel = 2222;//无法将值赋给 final 变量 'tel'
        System.out.println(oopFinal.tel);//1349999
    }
}
class OopFinal{
    final int tel;
    OopFinal(int tel){
        this.tel = tel;
    }
}
```



#### 修饰方法

我们也可以使用final来声明一个方法，这表示不允许被子类重写：

```java
class OopFinal{
    final void test(){}
}
class OopFinalFn extends OopFinal{
//    void test(){}//'test()' 无法重写 'oop.OopFinal' 中的 'test()'；重写的方法为 final
}
```



#### 修饰类

可以使用final来修饰类，被final修饰的类没有子类：

```java
final class OopFinal{
    final void test(){}
}
//class OopFinalFn extends OopFinal{}//无法从final 'oop.OopFinal' 继承
```



#### 修饰方法参数

final也可以修饰方法的参数，被修饰的参数无法被修改：

```java
class OopFinal{
    void test(final int tel){
//        tel = 123;//无法将值赋给 final 变量 'tel'
    }
}
```



#### 无法修饰构造方法

final无法修饰构造方法，我们使用final修饰方法是为了避免重写。而构造方法不会重名，因为构造方法的方法名与类名一致。

```java
class OopFinal{
//    final OopFinal(){}//此处不允许使用修饰符 'final'
}
```



### 抽象

在不清楚类或者方法的具体实现时，我们可以使用抽象来编写代码（抽象类，抽象方法）。这是因为我们可能会遇到先有一个对象，然后通过这个对象来抽象为一个类。

我们通常在分析问题时，这个过程是具体到抽象（对象=>类）。而编写代码时是抽象到具体（类=>对象）

#### 抽象方法和抽象类

使用`abstract`来修饰方法，表明这是个抽象方法（没有具体实现）。语法为：`abstract 返回类型 方法名(参数);`

而声明了抽象方法，那么也必须要对这个使用`abstract`修饰。语法为`abstract class 类名{}`

```java
abstract class Abstract_21{
    abstract void test(String name);
}
```

我们不能使用`abstract`修饰属性，因为属性不需要抽象，直接不声明就行了

```java
//abstract String s;//此处不允许使用修饰符 'abstract'
```



此外抽象类中并不是全都是抽象方法

```java
abstract class Abstract_21{
    void demo(){}
    abstract void test(String name);
}
```

并且可以不声明抽象方法

```java
abstract class Abstract_21{
    void demo(){}
}
```



另外，抽象类不能被实例化。必须被子类继承并且实现抽象方法：

```java
public class Oop_Abstact_21 {
    public static void main(String[] args) {
//        Abstract_21 abstract21 = new Abstract_21();//'Abstract_21' 为 abstract；无法实例化
    }
}
abstract class Abstract_21{
    abstract void test(int tel);
}
class Abstract_21_ extends Abstract_21{
    @Override
    void test(int tel) {
        System.out.println("电话号码为："+tel);
    }
}
```



虽然抽象类不能被实例化，但是我们可以在子类中使用`super`关键字来调用抽象类的属性和方法：

```java
public class Oop_Abstact_21 {
    public static void main(String[] args) {
        Abstract_21_ abstract_21_ = new Abstract_21_();
        abstract_21_.test(1333);
//        demo
//        kevin
//        电话号码为：1333
    }
}
abstract class Abstract_21{
    String name = "kevin";
    void demo(){
        System.out.println("demo");
    }
    abstract void test(int tel);
}
class Abstract_21_ extends Abstract_21{
    @Override
    void test(int tel) {
        super.demo();
        System.out.println(super.name);
        System.out.println("电话号码为："+tel);
    }
}
```



`final`关键字和`abstract`无法同时使用。对于类，final禁止声明子类，但是抽象类需要子类才能使用。对于方法，final禁止重写，但抽象方法需要在子类中重写。



### 接口

接口也是一种抽象，是对类的一种约束。基本语法：`interface 接口名{约束的属性，约束的行为}`

```java
interface DemoInterface{
    int tel = 1333;
    void test();
}
```



对于接口，我们应该知道：

- 接口的属性必须是固定值，并且不能被修改。而行为默认是抽象的。

- 接口的属性和方法的访问权限都是公共的，并且属性都是静态的，因为它某个对象无关。

- 接口与类是两个层面的，接口是类的约束。但接口可以继承其他接口。

- 类需要遵循接口这个约束，在Java中叫做实现，我们使用`implements`来实现这个接口，并且可以实现多个接口。

```java
public class Oop_Interface_22 {
    public static void main(String[] args) {
        DemoInterface demoInterface = new DDee();
        demoInterface.test();//实现
        DDee ddee = new DDee();
        ddee.test();//实现
    }
}
interface DemoInterface{
    int tel = 1333;
    void test();
}
class DDee implements DemoInterface{
    @Override
    public void test() {
        System.out.println("实现");
    }
}
```

再来看一个例子：

```java
public class Oop_Interface_22 {
    public static void main(String[] args) {
        Power power = new Power();
        Light light1 = new Light();
        Light light2 = new Light();
        power.usb1 = light1;
        power.usb2 = light2;
        power.supply();
//        提供电力
//        小电灯亮了
//        小电灯亮了
    }
}
interface USBInterface{}
interface USBSupply extends USBInterface{
     void supply();
}
interface USBReceive extends USBInterface{
    void receive();
}
class Power implements USBSupply{
    USBReceive usb1;
    USBReceive usb2;
    @Override
    public void supply() {
        System.out.println("提供电力");
        usb1.receive();
        usb2.receive();
    }
}
class Light implements USBReceive{
    @Override
    public void receive() {
        System.out.println("小电灯亮了");
    }
}
```



### 枚举

枚举是一种特殊的类，其中包含了一组特殊的对象，这些对象不能被改变。一般使用全大写的标识符。

枚举使用`enum`关键字声明

```java
package oop;

public class Oop_enum_23 {
    public static void main(String[] args) {
        System.out.println(City.BEIJING);//BEIJING
        System.out.println(City.SHANGHAI);//SHANGHAI
    }
}
enum City{
    BEIJING,SHANGHAI;
}
```



枚举是特殊的类，当然也可以声明构造方法。枚举类会将对象放在最前面，与后面的语法使用分号隔开`;`

因为枚举中的对象是枚举的实例对象，所以需要传参。

```java
package oop;

public class Oop_enum_23 {
    public static void main(String[] args) {
        System.out.println(City.BEIJING.name);//北京
        System.out.println(City.BEIJING.code);//1
        System.out.println(City.SHANGHAI.name);//上海
        System.out.println(City.SHANGHAI.code);//2
    }
}
enum City{
    BEIJING("北京",1),SHANGHAI("上海",2);
    City(final String name,final int code){
        this.name = name;
        this.code = code;
    }
    final String name;
    final int code;
}
```



枚举类不能创建对象，它的对象是在其内部创建的。

枚举类是特殊的类，我们尝试实现一个类似的类：

```java
public class Oop_enum_23 {
    public static void main(String[] args) {
        System.out.println(MyCity.BEIJING.name);//北京
        System.out.println(MyCity.BEIJING.code);//1
        System.out.println(MyCity.SHANGHAI.name);//上海
        System.out.println(MyCity.SHANGHAI.code);//2
    }
}
class MyCity{
    final String name;
    final int code;
    private MyCity(final String name,final int code){
        this.name = name;
        this.code = code;
    }
    public static final MyCity BEIJING = new MyCity("北京",1);
    public static final MyCity SHANGHAI = new MyCity("上海",2);
}
```



### 匿名类

在很多时候，类名是什么并不重要，我们需要的是类中的方法或者功能，这时候我们就可以使用匿名类。

而匿名类就是没有名称的类。

```java
public class Oop_24 {
    public static void main(String[] args) {
        One one = new One();
        one.sayHello(new Student() {
            @Override
            String name() {
                return "kevin";
            }
        });//hello~kevin
        one.sayHello(new Student() {
            @Override
            String name() {
                return "qian";
            }
        });//hello~qian
    }
}
abstract class Student{
    abstract String name();
}
class One{
    void sayHello(Student student){
        System.out.println("hello~"+student.name());
    }
}
```

我们也可以使用接口来约束：

```java
public class Oop_24 {
    public static void main(String[] args) {
        new Fly(){
            @Override
            public void howtoflay() {
                System.out.println("人类坐飞机");
            }
        }.howtoflay();//人类坐飞机
        new Fly(){
            @Override
            public void howtoflay() {
                System.out.println("乌鸦也坐飞机");
            }
        }.howtoflay();//乌鸦也坐飞机
    }
}
interface Fly{
    void howtoflay();
}
```



### Bean规范

通常我们封装类的目的有两个：

- 编写逻辑
- 建立数据模型

而通常建立数据模型，我们会遵循Bean规范。创建的类被称为Bean类。

对于Bean规范：

- 类必须含有无参，公共的构造方法
- 属性必须私有化，然后提供公共的set、get方法（访问器）

下面是实现Bean规范的一个简单例子：

```java
public class Oop_25 {
    public static void main(String[] args) {
        TheUser theUser = new TheUser();
        theUser.setAccount("kevin");
        theUser.setPassword("kevin");
        login(theUser);//登录成功
    }
    static void login(TheUser user){
        if (user.getAccount().equals("kevin")&&user.getPassword().equals("kevin")){
            System.out.println("登录成功");
        }else {
            System.out.println("账号或密码错误，登录失败");
        }
    }
}
class TheUser{
    private String account;
    private String password;

    public String getAccount() {
        return account;
    }

    public void setAccount(String account) {
        this.account = account;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
```

在上面的例子中，我们将login方法放到了公共类中而不是`TheUser`类。这是因为login并不是用户提供，用户只是会使用这个方法。这样的逻辑更加合理。`TheUser`类就是一个Bean类，用于建立数据模型，其中并不会有或者只有很少的逻辑代码。



### 作用域

如果属性和（局部）变量名相同，访问时不加this关键字，那么优先访问变量（这时候JVM不会自动添加this关键字）。

```java
public class Oop_26 {
    public static void main(String[] args) {
        SomeBody someBody = new SomeBody();
        someBody.test();//demo
    }
}
class Person26{
    static String name = "person";
}
class SomeBody extends Person26{
    static String name = "kevin";
    void test(){
        String name = "demo";
        System.out.println(name);
    }
}
```



我们可以使用super来获取父类的静态属性，因为创建实例对象的前提是有这个类。

```java
public class Oop_26 {
    public static void main(String[] args) {
        SomeBody someBody = new SomeBody();
        someBody.test();//person
    }
}
class Person26{
    static String name = "person";
}
class SomeBody extends Person26{
    static String name = "kevin";
    void test(){
        System.out.println(super.name);
    }
}
```



当`SomeBody`中的test方法为静态方法时，不能使用super。因为并不知道它是否有实例化对象。在Java中的继承是对象的继承。在这里只能使用类来调用父类的name：

```java
public class Oop_26 {
    public static void main(String[] args) {
        SomeBody someBody = new SomeBody();
        someBody.test();//person
    }
}
class Person26{
    static String name = "person";
}
class SomeBody extends Person26{
    static String name = "kevin";
    static void test(){
//        System.out.println(super.name);//无法从 static 上下文引用 'oop.SomeBody.super'
        System.out.println(Person26.name);
    }
}
```
