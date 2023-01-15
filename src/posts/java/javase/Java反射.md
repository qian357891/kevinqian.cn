# Java反射

## 类对象

java中万物皆对象，类对象就是将java编译后的字节码文件当做对象。

```java
public class Demo_01 {
    public static void main(String[] args) {
        User user = new Chlid();
        user.test1();
        // 多态
//        user.test2();

        // 类对象
        Class<? extends User> aClass = user.getClass();
    }
}

class User {
    public void test1() {
        System.out.println("test1...");
    }
}

class Chlid extends User {
    public void test2() {
        System.out.println("test2...");
    }
}
```



有许多api来得到类对象的一些属性。

```java
package chapter10;

public class Demo_01 {
    public static void main(String[] args) throws NoSuchMethodException {
        User user = new Chlid();

        Class<? extends User> aClass = user.getClass();
        System.out.println(aClass.getName());// chapter10.Chlid

        Class<?> superclass = aClass.getSuperclass();
        System.out.println(superclass.getName());// chapter10.User

        System.out.println(aClass.getMethod("test2"));// public void chapter10.Chlid.test2()
    }
}

class User {
    public void test1() {
        System.out.println("test1...");
    }
}

class Chlid extends User {
    public void test2() {
        System.out.println("test2...");
    }

}
```



## 类加载器

![image-20230114151929326](https://qiankun825.oss-cn-hangzhou.aliyuncs.com/img/image-20230114151929326.png)

加载Java的核心类库 > 平台类库 > 自己的类



## 反射练习

验证登录，不使用new来创建对象来进行操作。使用反射来操作。

```java
package chapter10;

import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

public class Demo_02 {
    public static void main(String[] args) throws NoSuchMethodException, InvocationTargetException, InstantiationException, IllegalAccessException, NoSuchFieldException {
        // 构造方法对象
        Class empClass = Emp.class;
        Constructor declaredConstructor = empClass.getDeclaredConstructor();

        // 构建对象
        Object emp = declaredConstructor.newInstance();

        // 获取对象的属性
        Field account = empClass.getField("account");
        Field password = empClass.getField("password");

        // 给属性赋值
        account.set(emp, "kevin");
        password.set(emp, "qian123");

        // 获取登录方法
        Method login = empClass.getMethod("login");

        // 调用方法
        Object result = login.invoke(emp);
        System.out.println(result);// false
    }
}

class Emp {
    public String account;
    public String password;

    public boolean login() {
        if ("admin".equals(account) && "password".equals(password)) {
            return true;
        }
        return false;
    }
}
```



## 反射常见异常

![image-20230114155957053](https://qiankun825.oss-cn-hangzhou.aliyuncs.com/img/image-20230114155957053.png)
