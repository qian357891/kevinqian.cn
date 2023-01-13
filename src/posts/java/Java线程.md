---
date: 2023-01-13
category:
  - 后端
tag:
  - Java
archive: true
---



# Java线程

**进程（process）：**正在进行的一个过程或者说一个任务。而负责执行任务则是cpu。

所谓的进程就是运行的程序，而这个程序是否能够运行，是看这个程序是否能抢占到cpu内核的执行权。（类似于抢椅子，这也是为什么我们启动程序时通常会加载一会儿）

- 我们自己写的一个程序就是一个进程。
- 进程的名字就是执行的类的名字。



**线程：**一个进程中可以包含多个线程（至少有一条）。

- Java程序在运行时，默认会产生一个进程。
- 这个进程会有一条主线程。
- 代码都在主线程中执行。

```java
public class chapter09 {
    public static void main(String[] args) {
        System.out.println(Thread.currentThread().getName());// main
    }
}
```



### 创建线程

使用Thread类来创建线程，我们可以自己声明一个类来继承Thread。然后重写run方法，在使用start来启动线程时会调用这个方法。

```java
public class chapter09 {
    public static void main(String[] args) {
        MyThread myThread = new MyThread();
        myThread.start();
        System.out.println(Thread.currentThread().getName());
//        main
//        MyThread：Thread-0
    }
}

class MyThread extends Thread {
    @Override
    public void run() {
        System.out.println("MyThread：" + Thread.currentThread().getName());
    }
}
```

为什么`main`的打印比`MyThread`的打印早？因为main是主线程。另外，新建的线程的打印顺序是不一定的。



### 线程的生命周期

![image-20230113183533033](https://qiankun825.oss-cn-hangzhou.aliyuncs.com/img/image-20230113183533033.png)

**线程对象必须为可运行状态才能运行，其他状态无法运行。**



### 线程执行方式

默认情况下多线程**并发**执行。

并发执行：多个线程是独立的，谁先抢到cpu的执行权，谁先执行。

```java
package chapter09;

public class Demo_02 {
    public static void main(String[] args) {
        MyThread1 myThread1 = new MyThread1();
        MyThread2 myThread2 = new MyThread2();
        myThread1.start();
        myThread2.start();
        System.out.println(Thread.currentThread().getName());
//        main
//        MyThread1：Thread-0 或者 MyThread2：Thread-1
//        MyThread2：Thread-1 或者 MyThread1：Thread-0
    }
}

class MyThread1 extends Thread {
    @Override
    public void run() {
        System.out.println("MyThread1：" + Thread.currentThread().getName());
    }
}

class MyThread2 extends Thread {
    @Override
    public void run() {
        System.out.println("MyThread2：" + Thread.currentThread().getName());
    }
}
```



为了让线程按照我们想要的顺序执行，我们可以使程序**串行**执行。

串行执行：多个线程连成串，按照顺序依次执行。

```java
package chapter09;

public class Demo_02 {
    public static void main(String[] args) throws InterruptedException {
        MyThread1 myThread1 = new MyThread1();
        MyThread2 myThread2 = new MyThread2();

        myThread1.start();
        myThread1.join();

        myThread2.start();
        myThread2.join();
        System.out.println(Thread.currentThread().getName());
//        MyThread1：Thread-0
//        MyThread2：Thread-1
//        main
    }
}

class MyThread1 extends Thread {
    @Override
    public void run() {
        System.out.println("MyThread1：" + Thread.currentThread().getName());
    }
}

class MyThread2 extends Thread {
    @Override
    public void run() {
        System.out.println("MyThread2：" + Thread.currentThread().getName());
    }
}
```



### 线程休眠

可以使用`Treads.sleep()`方法进行休眠，执行时会对调用这个静态方法的线程进行指定时间的休眠

```java
public static void main(String[] args) throws InterruptedException {
    Thread.sleep(3000);
    System.out.println("休眠三秒后得到打印");// 休眠三秒后得到打印
}
```

我们可以使用它来进行间歇性的循环打印：

```java
public static void main(String[] args) throws InterruptedException {
    while (true) {
        Thread.sleep(1000);
        System.out.println("每休眠一秒打印一次");// 每休眠一秒打印一次
    }
}
```



### 构建线程对象

在上面的例子中，我们声明了一个类，但我们不需要创建这个类，我们可以使用**lambda表达式**来传逻辑：

```java
Thread thread1 = new Thread(() -> {
    System.out.println("thread1执行");
});
thread1.start();

Thread thread2 = new Thread(() -> {
    System.out.println("thread2执行");
});
thread2.start();

System.out.println("主线程执行完毕");
```

也可以传递实现了Runnable接口的类的对象，一般使用匿名类

```java
Thread thread1 = new Thread(new Runnable() {
    @Override
    public void run() {
        System.out.println("thread1执行");
    }
});
thread1.start();

Thread thread2 = new Thread(new Runnable() {
    @Override
    public void run() {
        System.out.println("thread2执行");
    }
});
thread2.start();

System.out.println("主线程执行完毕");
```



### 线程池

为了简化线程对象的创建过程，以及合理使用和分配资源，Java提供了一种特殊的处理方式来获取线程对象，这种处理方式叫**线程池**。

![image-20230113215624517](https://qiankun825.oss-cn-hangzhou.aliyuncs.com/img/image-20230113215624517.png)

当一个线程由不可运行状态变为可运行状态，新的submit就提交到这个线程上。



#### 创建固定数的线程数量

创建3个线程，对这3个线程进行反复利用

```java
ExecutorService executorService = Executors.newFixedThreadPool(3);
for (int i = 0; i < 5; i++) {
    executorService.submit(() -> System.out.println(Thread.currentThread().getName()));
}
// pool-1-thread-2
// pool-1-thread-1
// pool-1-thread-3
// pool-1-thread-1
// pool-1-thread-2
```



#### 根据需求自动创建线程

可以根据任务的使用情况重复使用线程，但是发现我们的线程不够，就会创建新的线程

```java
ExecutorService executorService = Executors.newCachedThreadPool();
for (int i = 0; i < 20; i++) {
    executorService.submit(() -> System.out.println(Thread.currentThread().getName()));
}
```



#### 单一线程

都使用同一个线程。当我们想要某些工作按照某个顺序执行时，我们就可以使用单一线程。

```java
ExecutorService executorService = Executors.newSingleThreadExecutor();
for (int i = 0; i < 3; i++) {
    executorService.submit(() -> System.out.println(Thread.currentThread().getName()));
}
// pool-1-thread-1
// pool-1-thread-1
// pool-1-thread-1
```



#### 定时调度线程

与创建固定数的线程数量类似，但是这个方法有定时调度的功能，可以定义某个线程在什么时候执行。

```java
ExecutorService executorService = Executors.newScheduledThreadPool(3);
for (int i = 0; i < 5; i++) {
    executorService.submit(() -> System.out.println(Thread.currentThread().getName()));
}
```



### 同步

在Java中使用`synchronized`关键字来表示这是一个同步方法。这个关键字表示在多线程下调用这个方法，只会在一个线程下进行调用。

![image-20230113225154245](https://qiankun825.oss-cn-hangzhou.aliyuncs.com/img/image-20230113225154245.png)



```java
public class Demo_06 {
    public static void main(String[] args) {
        Num num = new Num(1);
        User user = new User(num);
        user.start();

        Bank bank = new Bank(num);
        bank.start();
        // 我是号码1银行还没开门，我等会儿
        // 开门了，开始叫号
        // 叫到我了！
    }
}

class Num {
    public int number;

    Num(int number) {
        this.number = number;
    }
}

class Bank extends Thread {
    private Num num;

    public Bank(Num num) {
        this.num = num;
    }

    @Override
    public void run() {
        synchronized (num) {
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
            System.out.println("开门了，开始叫号");
            num.notifyAll();
        }
    }
}

class User extends Thread {
    private Num num;

    public User(Num num) {
        this.num = num;
    }

    @Override
    public void run() {
        synchronized (num) {
            System.out.println("我是号码" + num.number + "银行还没开门，我等会儿");
            try {
                num.wait();
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }

            System.out.println("叫到我了！");
        }
    }
}
```



### wait和sleep

虽然wait和sleep都用于阻塞程序，但它们有很多不同：

- 关于名字：wait（等待），sleep（睡眠）
- 从属关系：wait（Object类的成员方法），sleep（Thread类的静态方法）
- 使用方式：wait（只能用于同步代码中），sleep（任何地方）
- 阻塞时间：wait：超时时间，等到一定时间不会再等（会发生错误），sleep：休眠时间（不会发生错误）
- 同步处理：wait：如果使用wait方法，其他线程有机会执行当前的同步操作（等你做完了，就该我了）。sleep：如果使用sleep方法，其他线程没有机会执行当前的同步操作（就像睡着了，不知道外面发生了什么事，醒过来了继续干）。



### 线程的安全问题

所谓的线程安全问题，其实就是多个线程在并发执行时，修改了共享内存中共享对象中的属性，导致的数据冲突问题

![image-20230113230134562](https://qiankun825.oss-cn-hangzhou.aliyuncs.com/img/image-20230113230134562.png)



```java
package chapter09;

public class Demo_07 {
    public static void main(String[] args) {
        User07 user = new User07();

        Thread thread1 = new Thread(() -> {
            user.name = "kevin";
            try {
                Thread.sleep(3000);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
            System.out.println(user.name);
        });
        Thread thread2 = new Thread(() -> {
            user.name = "qian";
            try {
                Thread.sleep(3000);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
            System.out.println(user.name);
        });

        thread1.start();
        thread2.start();

        System.out.println("主线程执行完毕");
        // 主线程执行完毕
        // qian
        // qian
    }
}

class User07 {
    public String name;
}
```

由于thread1中修改user.name后休眠了，然后在thread1醒来前thread2也修改了同一个user对象的name，所以它们打印同一个name