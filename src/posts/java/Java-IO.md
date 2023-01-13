---
date: 2023-01-12
category:
  - 后端
tag:
  - Java
archive: true
---



# Java-IO

IO：I，Input（in）。O，Output（out）。Stream，流转。

## 数据流处理

数据流：**数据+流（转）+处理**

图解数据流：

![image-20230112184059488](https://qiankun825.oss-cn-hangzhou.aliyuncs.com/img/image-20230112184059488.png)



关于Stream：

![image-20230112184147790](https://qiankun825.oss-cn-hangzhou.aliyuncs.com/img/image-20230112184147790.png)



在IO中，IN和OUT是有阀门的，打开时才进行传输：

![image-20230112184256528](https://qiankun825.oss-cn-hangzhou.aliyuncs.com/img/image-20230112184256528.png)



## 文件流

![image-20230112220958009](https://qiankun825.oss-cn-hangzhou.aliyuncs.com/img/image-20230112220958009.png)

```java
File file = new File("D:\\Do_it\\java\\new\\demo1\\data\\test.txt");
System.out.println(file);// D:\Do_it\java\new\demo1\data\test.txt
```

判断是否为文件，注意这里是File对象是关联的**文件或者文件夹**

```java
File file = new File("D:\\Do_it\\java\\new\\demo1\\data\\test.txt");
File file1 = new File("D:\\Do_it\\java\\new\\demo1\\data");

System.out.println(file.isFile());// true
System.out.println(file1.isFile());// false
```

判断是否为文件夹

```java
File file = new File("D:\\Do_it\\java\\new\\demo1\\data\\test.txt");
File file1 = new File("D:\\Do_it\\java\\new\\demo1\\data");

System.out.println(file.isDirectory());// false
System.out.println(file1.isDirectory());// true
```

判断File对象是否存在关联（是否有这个路径）

```java
File file = new File("D:\\Do_it\\java\\new\\demo1\\data\\test.txt");
File file1 = new File("D:\\Do_it\\java\\new\\demo1\\node");

System.out.println(file.exists());// true
System.out.println(file1.exists());// false
```



文件流的常用方法：

```java
import java.io.File;
import java.io.IOException;

public class Demo_01 {
    public static void main(String[] args) throws IOException {
        File file = new File("D:\\Do_it\\java\\new\\demo1\\data\\test.txt");

        getFileAbout(file);
//        文件对象存在关联
//        文件名为：test.txt
//        文件绝对路径为：D:\Do_it\java\new\demo1\data\test.txt
//        文件长度为：5
//        文件最后修改时间为：1673529597503
    }

    public static void getFileAbout(File file, String... fileOrDir) throws IOException {
        if (file.exists()) {
            System.out.println("文件对象存在关联");
            if (file.isFile()) {
                System.out.println("文件名为：" + file.getName());
                System.out.println("文件绝对路径为：" + file.getAbsolutePath());
                System.out.println("文件长度为：" + file.length());
                System.out.println("文件最后修改时间为：" + file.lastModified());
                return;
            }
            if (file.isDirectory()) {
                System.out.println("文件夹名为：" + file.getName());
                System.out.println("文件夹绝对路径为：" + file.getAbsolutePath());
                System.out.println("文件夹最后修改时间为：" + file.lastModified());

                String[] list = file.list();
                System.out.println("文件夹下目录为：" + list);
                for (String s : list) {
                    System.out.println(s);
                }
                return;
            }
        }

        System.out.println("文件/文件夹路径不存在，开始创建");
        file.mkdirs();// 创建文件夹
        file.createNewFile();// 创建文件
    }
}
```



复制文件：

```java
import java.io.*;

public class Demo_02 {
    public static void main(String[] args) {
        // TODO 原文件
        File srcFile = new File("D:\\Do_it\\java\\new\\demo1\\data\\test.txt");
        // TODO 复制的文件（自动创建）
        File destFile = new File("D:\\Do_it\\java\\new\\demo1\\data\\test.txt.copy");

        // TODO 文件输入流（管道对象）
        FileInputStream in = null;
        // TODO 文件输出流（管道对象）
        FileOutputStream out = null;

        try {
            in = new FileInputStream(srcFile);
            out = new FileOutputStream(destFile);
            
            int data;
            // TODO 打卡阀门，流转数据（输入）。（打开一次关闭一次，所以用循环。当没有数据后读取-1）
            while ((data = in.read()) != -1) {
                // TODO 打卡阀门，流转数据（输出）
                out.write(data);
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        } finally {
            if (in != null) {
                try {
                    in.close();
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            }
            if (out != null) {
                try {
                    out.close();
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            }
        }
    }
}
```



## 缓冲流

建立一个缓冲区，使其输入输出的阀门都只开一次。

![image-20230112225352373](https://qiankun825.oss-cn-hangzhou.aliyuncs.com/img/image-20230112225352373.png)

读取的时候读取缓冲区的数据，写的时候也是。

```java
import java.io.*;

public class Demo_03 {
    public static void main(String[] args) {
        // TODO 原文件
        File srcFile = new File("D:\\Do_it\\java\\new\\demo1\\data\\test.txt");
        // TODO 复制的文件（自动创建）
        File destFile = new File("D:\\Do_it\\java\\new\\demo1\\data\\test.txt.copy");

        // TODO 文件输入流（管道对象）
        FileInputStream in = null;
        // TODO 文件输出流（管道对象）
        FileOutputStream out = null;

        // TODO 缓冲输入流（管道对象）
        BufferedInputStream bufferIn = null;
        // TODO 缓冲输出流（管道对象）
        BufferedOutputStream bufferOut = null;
        // TODO 缓冲区
        byte[] cache = new byte[1024];


        try {
            in = new FileInputStream(srcFile);
            out = new FileOutputStream(destFile);

            bufferIn = new BufferedInputStream(in);
            bufferOut = new BufferedOutputStream(out);

            int data;
            // TODO 打卡阀门，流转数据（输入）。（打开一次关闭一次，所以用循环。当没有数据后读取-1）
            while ((data = bufferIn.read(cache)) != -1) {
                // TODO 打卡阀门，流转数据（输出）
                bufferOut.write(cache, 0, data);
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        } finally {
            if (bufferIn != null) {
                try {
                    bufferIn.close();
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            }
            if (bufferOut != null) {
                try {
                    bufferOut.close();
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            }
        }
    }
}
```



## 字符流

之前都是流转字节（byte），非常不方便。我们将流转的数据转为字符：

字符流中，一行一行的进行流转。

```java
import java.io.*;

public class Demo_04 {
    public static void main(String[] args) {
        // TODO 原文件
        File srcFile = new File("D:\\Do_it\\java\\new\\demo1\\data\\test.txt");
        // TODO 复制的文件（自动创建）
        File destFile = new File("D:\\Do_it\\java\\new\\demo1\\data\\test.txt.copy");

        // TODO 文件输入流（管道对象）
        FileInputStream in = null;
        // TODO 文件输出流（管道对象）
        FileOutputStream out = null;

        // TODO 字符输入流（管道对象）
        BufferedReader reader = null;
        // TODO 字符输出流（管道对象）
        PrintWriter writer = null;

        try {
            reader = new BufferedReader(new FileReader(srcFile));
            writer = new PrintWriter(destFile);

            String line = null;

            // TODO 打卡阀门，流转数据（输入）。（打开一次关闭一次，所以用循环。当没有字符串返回null）
            while ((line = reader.readLine()) != null) {
                // TODO 打卡阀门，流转数据（输出）
                writer.println(line);
                System.out.println(line);
            }
            // hello
            // nice demo!
            writer.flush();

        } catch (IOException e) {
            throw new RuntimeException(e);
        } finally {
            if (reader != null) {
                try {
                    reader.close();
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            }
            if (writer != null) {
                writer.close();
            }
        }
    }
}
```



## 序列化与反序列化

我们之前将字符串进行流转，那么对象是否也可以呢？我们如何将程序中的对象写入文件呢？

![image-20230112233234676](https://qiankun825.oss-cn-hangzhou.aliyuncs.com/img/image-20230112233234676.png)![image-20230112233324210](https://qiankun825.oss-cn-hangzhou.aliyuncs.com/img/image-20230112233324210.png)

在java中，我们将对象变成字节写入文件，这个过程叫**序列化**过程。而将文件中的数据读成对象叫**反序列化**。



### 序列化

**需要对象的类实现`Serializable`接口（可序列化的）**

```java
package chapter08;

import java.io.*;

public class Demo_05 {
    public static void main(String[] args) {
        // TODO 数据文件对象
        File dateFile = new File("D:\\Do_it\\java\\new\\demo1\\data\\obj.dat");

        // TODO 对象输出流（管道对象）
        ObjectOutputStream objectOutput = null;
        FileOutputStream out = null;


        try {
            out = new FileOutputStream(dateFile);
            objectOutput = new ObjectOutputStream(out);
            User user = new User();
            
            objectOutput.writeObject(user);

            objectOutput.flush();
        } catch (IOException e) {
            throw new RuntimeException(e);
        } finally {
            if (objectOutput != null) {
                try {
                    objectOutput.close();
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            }
        }
    }
}

class User implements Serializable {
}
```

这时候已经将对象写入了文件。

### 反序列化

```java
import java.io.*;

public class Demo_05 {
    public static void main(String[] args) {
        // TODO 数据文件对象
        File dateFile = new File("D:\\Do_it\\java\\new\\demo1\\data\\obj.dat");

        // TODO 对象输出流（管道对象）
        ObjectInputStream objectIn = null;
        FileInputStream in = null;


        try {
            in = new FileInputStream(dateFile);
            objectIn = new ObjectInputStream(in);
            Object o = objectIn.readObject();
            System.out.println(o);// chapter08.User@1cf4f579
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}

class User implements Serializable {
}
```



## 常见异常

在使用FileInputStream创建文件输入对象时，可能会出现FileNotFoundException，文件未找到的异常。

```java
FileInputStream input = new FileInputStream("xxx");// 异常: java.io.FileNotFoundException
```

所以我们通常采用这样的套路：

```java
FileInputStream input = null;
try {
    input = new FileInputStream("xxx");
} catch (FileNotFoundException e) {
    throw new RuntimeException(e);
} finally {
    try {
        if (input != null) {
            input.close();
        }
    } catch (IOException e) {
        throw new RuntimeException(e);
    }
}
```

其中，我们将input对象初始化为null，并且在try/catch语句中尝试使用`new FileInputStream`来时对象指向它的实例。

然后再进行对`FileNotFoundException`异常的捕捉。

由于流对象会占资源，所以我们最后要将这个管道进行关闭。而这里也需要对`IOException`异常进行捕捉。



对于ObjectInputStream类可能出现`ClassNotFoundException`，这是因为程序不知道该段程序中是否有这个对象的类，如果没有则会抛出异常。

```java
ObjectInputStream objectInput = null;
try {
    objectInput.readObject();
} catch (IOException e) {
    throw new RuntimeException(e);
} catch (ClassNotFoundException e) {
    throw new RuntimeException(e);
}
```



对于ObjectOutputStream类可能会出现`NotSerializableException`异常，这是因为我们在序列化时应该允许序列化，如果不允许则会抛出异常。**（需要对象的类实现`Serializable`接口）**

详细代码见：[序列化](#序列化)

