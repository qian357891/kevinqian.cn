---
authors: kevinqian
date: 2023-01-12
tags: [Java,后端]
---



# Java异常



### 语法错误，Error和Exception

#### 语法错误

```java
// 语法错误
String s = "123";
// Integer i = (Integer) s;// 语法错误
Integer i = Integer.parseInt(s);//应该使用Integer的静态方法进行类型转换
```



#### 错误Error

```java
test();// 递归没有跳出逻辑 java.lang.StackOverflowError 栈溢出

public static void test() {
    test();
}
```

程序执行时的一个错误场景，在Java中，提供一种特殊类：Error，来描述这种场景。

一旦发生会程序会自动停止，无法恢复。应该尽量避免。



#### 异常Exception

异常（相对于正常逻辑），在java中使用Exception来表示异常

```java
User user = null;
System.out.println(user.toString());// 空指针异常 java.lang.NullPointerException
```

异常分为两种：

- 可通过代码来恢复正常逻辑执行的异常，称之为运行时异常：RuntimeException
- 不可通过代码来恢复正常逻辑执行的异常，称之为编译器异常（在编译时进行提醒）：Exception



对于编译器异常，并不是会真正的抛出异常，而是在编译时进行提醒。比如：程序连接服务器，但是服务器没开，这时候编译器会提醒你，针对这种情况，必须启动服务器。否则就会发生错误。

对于异常，会根据异常的范围确定一个从属关系。在Java中，这种从属关系表现为继承类，范围越小，异常的处理信息越详细，这种异常被称为子类异常。范围越大，越粗略，被称为父类异常。

其中，它的最大范围的类是Exception类。

```java
public class RuntimeException extends Exception{...}
```



### try/catch捕获异常

假如我们有下面一段代码：

```java
int i = 10;
int j = 0;
System.out.println(i / j);// Exception in thread "main" java.lang.ArithmeticException: / by zero
```

在上面这段代码中，程序会因为一个异常而中断运行，而这个异常产生的原因是：除法运算的的被除数为零。这样的代码十分脆弱。



为了提升代码的健壮性，Java为我们提供了`try/catch`来捕获异常并在出现该异常时来通过指定的代码来解决异常，从而使程序不会中断

```java
int i = 10;
int j = 0;
try {
    System.out.println(i / j);
} catch (ArithmeticException e) {
    System.out.println("发生异常的原因是：" + e.getCause());//发生异常的原因是：null 返回null因为：原因不存在或未知
    System.out.println("异常信息为：" + e.getMessage());//异常信息为：/ by zero
    j = 10;
} finally {
    System.out.println("最终执行的代码");
}
System.out.println(i / j);//1
```

我们对可能产生异常的部分进行了处理，所以说，程序就不会中断了。



对于`try/catch`的语法：

```java
try {
	// 可能发生异常的代码
    // 如果出现异常，那么JVM会将异常进行封装，形成一个具体的异常类，然后将这个异常抛出
} catch (异常类的实例对象) {
	// 捕获异常后，异常的解决方案
} catch(通常情况下异常捕获的顺序为范围从小到大){
    //...
}finally {
    System.out.println("最终执行的代码");
}
```

通常情况下异常捕获的顺序为范围从小到大，在捕获到异常后就不会捕获其他异常。在执行完catch中的语句后会执行finally中的语句。finally不是必须的。



所有的异常都可以被抛出，因为Exception继承了Throwable。

```java
public class Exception extends Throwable{...}
```



### 常见异常

RuntimeException可以不使用`try/catch`，但是对于异常我们应该**提前发现，提前解决**。

举个例子：

```java
int i = 10;
int j = 0;
if (j != 0) {
    System.out.println(i / j);
}

TheUser user = null;
if (user != null) {
    System.out.println(user.toString());
}
```



#### 空指针异常和算术异常

上面两个异常都继承自RuntimeException

```java
public class NullPointerException extends RuntimeException{...}
public class ArithmeticException extends RuntimeException{...}
```



上面的例子中，我们没有写`try/catch`，看上去我们的代码简洁了。但是，在逻辑上我们不应该判断`j`是否为0来执行语句，因为本来被除数就不应该为零。我们也不应该通过对象是否为空（null）来判断是否执行语句。

我们应该**提前发现提前解决**：

```java
TheUser user = null;
try {
    System.out.println(user.toString());

} catch (NullPointerException e) {
    user = new TheUser();
} finally {
    System.out.println(user.toString());//chapter06.TheUser@4eec7777
}
```



但如果我们在TheUser中声明静态属性，并且初始化值。这时候将user指向null是可以取到name的值的。因为name是静态方法，与实例对象无关。

```java
public class JavaException_03 {
    public static void main(String[] args) {
        TheUser user = null;
        try {
            System.out.println(user.name);

        } catch (NullPointerException e) {
            System.out.println("对象为空的时候需要分析数据为空的原因");
        }
        // kevin
    }
}

class TheUser {
    public static String name = "kevin";
}
```

当调用了一个为空（null）对象的**成员属性和方法**时会发生异常，但是静态的属性和方法不受影响，因为静态属性方法与实例对象无关。



#### 索引越界

当下标大于等于数组长度时会出现索引越界

```java
int[] ints = {1, 2, 3};
System.out.println(ints[3]);//Index 3 out of bounds for length 3
```

数组的异常类是`ArrayIndexOutOfBoundsException`

```java
public class ArrayIndexOutOfBoundsException extends IndexOutOfBoundsException{...}
```



```java
String strings = "abc";
System.out.println(strings.charAt(3));
```

字符串的异常类是`StringIndexOutOfBoundsException`

```java
public class StringIndexOutOfBoundsException extends IndexOutOfBoundsException{...}
```



但是注意`substring`方法的参数最大值是字符串长度而不是下标。

```java
String strings = "abc";
System.out.println(strings.substring(3));
System.out.println(strings.substring(4));// begin 4, end 3, length 3
```



#### 格式化异常和类型转换错误

```java
String s = "a123";
int i = Integer.parseInt(s);// java.lang.NumberFormatException: For input string: "a123"
```

我们知道RuntimeException可以使用代码来恢复，我们可以使用正则表达式来对字符串进行处理：

```java
String s = "a123b456";
String regex = "[^0-9]";
s = s.replaceAll(regex, "").trim();
int i = Integer.parseInt(s);
System.out.println(i);// 123456
```



当两个无关的类进行转换的时候会报：`ClassCastException`

```java
public class JavaException_05 {
    public static void main(String[] args) {
        Object obj = new Obj();
        TheObj theObj = (TheObj) obj;// java.lang.ClassCastException
    }
}

class Obj {}
class TheObj {}
```

我们可以这样解决：

```java
Object obj = new Obj();
if (obj instanceof TheObj) {
    TheObj theObj = (TheObj) obj;// java.lang.ClassCastException
}
```



### 异常转换

```java
public class JavaException_06 {
    public static void main(String[] args) {
        Util.test(10, 0);// java.lang.ArithmeticException: / by zero
    }
}

class Util {
    public static void test(int i, int j) {
        System.out.println(i / j);
    }
}
```

如果方法中可能出现问题，我们应该提前声明，告诉其他人，我的方法可能会出现异常

```java
public static void test(int i, int j) throws ArithmeticException {
    System.out.println(i / j);
}
```

也可以在调用方法的地方进行抛出异常。

```java
public static void main(String[] args) throws Exception {
    Util.test(10, 0);// java.lang.ArithmeticException: / by zero
}
```

但是像上面的写法不抛出异常也不会报错，因为我们当前的异常是RuntimeException（运行时异常），编译器不会提示。

但是我们希望调用方法时能够手动抛出异常，这时我们不能抛出RuntimeException了。

如果程序中需要手动抛出异常对象，需要使用`throw`关键字，然后new出异常对象。（注意new出的对象类型与抛出的要一致）

```java
public class JavaException_06 {
    public static void main(String[] args) throws Exception {
        Util.test(10, 0);// java.lang.Exception
    }
}

class Util {
    public static void test(int i, int j) throws Exception {
        try {
            System.out.println(i / j);
        } catch (ArithmeticException e) {
            throw new Exception();
        }
    }
}
```

而这时候我们抛出的异常也不是ArithmeticException，而是手动抛出的Exception。



### 自定义异常

我们之前使用的都是java预先定义好的异常，有时候并不能准确描述出我们异常的场景，比如我们业务中的场景。

如果要准确描述，需要我们自己定义异常，来描述这个场景：

```java
package chapter06;

public class JavaException_07 {
    public static void main(String[] args) {
        try {
            login("kevin", "kevin666");
        } catch (AccountException e) {
            System.out.println("账户错误");
        } catch (PasswordException e) {
            System.out.println("密码异常");
        } catch (LoginException e) {
            System.out.println("其他登录异常");
        }
        // 账户错误
    }

    public static void login(String account, String password) {
        if (!"admin".equals(account)) {
            throw new AccountException("账户不正确");
        }
        if (!"admin".equals(password)) {
            throw new PasswordException("密码不正确");
        }
        System.out.println("登录成功");
    }
}

class AccountException extends LoginException {
    AccountException(String message) {
        super(message);
    }
}

class PasswordException extends LoginException {
    PasswordException(String message) {
        super(message);
    }
}


class LoginException extends RuntimeException {
    LoginException(String message) {
        super(message);
    }
}
```



如果我们继承Exception而不是RuntimeException，我们需要在抛出异常的方法签名出也抛出异常，如果有多种可能，使用逗号`,`隔开：

```java
package chapter06;

public class JavaException_07 {
    public static void main(String[] args) {
//...
   }

  public static void login(String account, String password) throws AccountException, PasswordException {
        if (!"admin".equals(account)) {
            throw new AccountException("账户不正确");
        }
        if (!"admin".equals(password)) {
            throw new PasswordException("密码不正确");
        }
        System.out.println("登录成功");
}

class AccountException extends LoginException {
//...
}

class PasswordException extends LoginException {
//...
}
 
class LoginException extends Exception {
//...
}
```

也可以直接抛出`LoginException`
