### Object类

所有类都继承自Object类（来自于java.lang包）。

下面是两个类，Object对于Student来说是超类

```java
class Person{}
class Student extends Person{}
```



#### 对象与内存地址

我们来打印一个实例对象

```java
Student student = new Student();
System.out.println(student);//util_class.Student@3b07d329
```

输出的结果是一段字符串，其中：

- `util_class.Student`为包名+实例对象的类名
- `@3b07d329`表示它的内存地址，@符号表示at，后跟一段16进制的数值。



#### tostring

我们尝试使用toString来将对象转换成字符串

```java
Student student = new Student();
String s = student.toString();
System.out.println(s);//util_class.Student@3b07d329
```

可以看到，值依然是对象的内存地址



我们可以重写这个方法：

```java
public class demo_1 {
    public static void main(String[] args) {
        Student student = new Student();
        String s = student.toString();
        System.out.println(s);//Student[null]
    }
}
class Person{}
class Student extends Person{
    String name;
    @Override
    public String toString() {
        return "Student["+name+"]";
    }
}
```



#### equals

我们来比较两个对象是否相等：

```java
public class demo_1 {
    public static void main(String[] args) {
        Student student1 = new Student();
        Student student2 = new Student();
        System.out.println(student1==student2);//false
    }
}
class Person{}
class Student extends Person{}
```

对象使用`==`进行比较时，比较的是内存地址，也就是说是不是同一个对象。

在Object类中还有一个equals方法，默认也是用来比较内存地址：

```java
Student student1 = new Student();
Student student2 = new Student();
System.out.println(student1.equals(student2));//false
```



当然，我们可以对equals方法进行重写：

```java
public class demo_1 {
    public static void main(String[] args) {
        Student student1 = new Student();
        Student student2 = new Student();
        System.out.println(student1.equals(student2));//true
    }
}
class Person{}
class Student extends Person{
    @Override
    public boolean equals(Object obj) {
        return true;
    }
}
```

很多类都对equals方法进行了重写，比如String类使用equals方法就是比较的它们的值。

```java
String s1 = new String("sss");
String s2 = new String("sss");
System.out.println(s1==s2);//false
System.out.println(s1.equals(s2));//true
```

这里使用String类进行字符串的创建是因为如果直接声明字符串会因为**String缓冲池**而指向同一个字符串（这时候使用`==`会为true）。



#### hashcode

我们可以使用hashcode方法来取对象的内存地址的hash值

```java
Student student = new Student();
System.out.println(student);//util_class.Student@3b07d329
System.out.println(student.hashCode());//990368553
```

但是我们发现hashcode的返回值与内存地址的值不一样，这是因为内存地址后面跟的数值是16进制，而hashcode返回值为10进制。



#### getClass

我们可以对实例对象使用`getClass`来得到对象的类的一些信息：

```java
public class demo_1 {
    public static void main(String[] args) {
        Student student = new Student();
        Class<?> aClass = student.getClass();
        System.out.println(aClass.getSimpleName());//Student
        System.out.println(aClass.getPackageName());//util_class
    }
}
class Person{}
class Student extends Person{}
```

在上面的例子中使用了`getSimpleName()`取到类名，`getPackageName()`取到包名。



### 数组

java中使用`类型[] 数组名 = new 类型[数组长度]`来声明数组（注意是数组长度而不是最后一个元素的下标），如：

```java
String[] s = new String[5];//5
System.out.println(s.length);
for (int i = 0; i < s.length; i++) {
    System.out.println(s[i]);//输出5个null
}
```

在上面的例子中，我们发现数组声明后会赋初始值，比如引用类型就是null

```java
public class demo_2 {
    public static void main(String[] args) {
        User[] users = new User[5];
        for (int i = 0; i < users.length; i++) {
            System.out.println(users[i]);//输出5个null
        }
    }
}
class User{}
```

基本数据类型的数组元素默认值为该类型的默认值。int数组初始值为0，double为0.0等等。

```java
int[] ints = new int[5];
for (int i = 0; i < ints.length; i++) {
    System.out.println(ints[i]);//输出5个0
}
```



可以使用for循环赋值：

```java
public class demo_2 {
    public static void main(String[] args) {
        User[] users = new User[5];
        for (int i = 0; i < users.length; i++) {
            users[i] = new User();
            users[i].test();//输出5次：不同的User类的实例对象
        }
    }
}
class User{
    void test(){
        System.out.println("不同的User类的实例对象");
    }
}
```



元素并不是直接存取在数组中，数组只是元素的一个容器，存储的是一个个对象。

![image-20230103182839271](https://qiankun825.oss-cn-hangzhou.aliyuncs.com/img/image-20230103182839271.png)



数组还可以在声明时直接赋值，在Java中使用的是`{}`符号：

```java
String[] ss= {"yes","nice","oo"};
```





#### 二维数组

Java中的二维数组并没有行和列的概念，只是数组中存的是一个数组。所以不需要数组的元素个数相等。

![image-20230103183208657](https://qiankun825.oss-cn-hangzhou.aliyuncs.com/img/image-20230103183208657.png)



```java
String[][] ss = {{"yes","nice","oo"},{"come","demo"},{"kkk"}};
```

以此类推还有三维四维数组等等。



虽然Java的二维数组没有行和列的概念，但是我们可以让其看起来像一个真正的二维数组：

```java
String[][] ss= new String[3][4];//只是看起来像一个三行四列的数组
```

在赋值的时候需要先确定“行”，然后确定“列”。不能直接将某列直接全部赋值为一个值。

```java
//ss[][2] = "kkk";//报错
ss[1][2] = "kkk";
```



因为二维数组有两层，我们也应该用两层循环来赋值和取值：

```java
String[][] ss= new String[3][4];
ss[1][2] = "kkk";
for (int i = 0; i < ss.length; i++) {
    for (int j = 0; j < 4; j++) {
        System.out.print(ss[i][j]+"   ");
    }
    System.out.println();
}
//        null   null   null   null
//        null   null   kkk   null
//        null   null   null   null
```



二维数组实现金字塔：

```java
public class demo_4 {
    public static void main(String[] args) {
        /*
             *    1   中心：0 1 2 (row-1)
            ***   3   两侧：(row-1)-i  (row-1)+i
           *****  5
        */
        int row = 9;
        int col = row*2-1;
        String[][] tower = new String[row][col];
        for (int i = 0; i < row; i++) {
            for (int j = 0; j < col; j++) {
                if (j >= row-1-i && j<= row-1+i){
                    tower[i][j] = "*";
                }else {
                    tower[i][j] = "-";
                }
                System.out.print(tower[i][j]);
            }
            System.out.println();
        }
    }
//            --------*--------
//            -------***-------
//            ------*****------
//            -----*******-----
//            ----*********----
//            ---***********---
//            --*************--
//            -***************-
//            *****************
}
```



#### 冒泡排序

```java
public class demo_5 {
    public static void main(String[] args) {
        int[] numbers = {2,3,1,5,4};
        for (int i = 0; i < numbers.length-1; i++) {
            for (int j = 0; j < numbers.length-1-i; j++) {
                int before = numbers[j];
                int after = numbers[j+1];
                if (before>after){
                    numbers[j] = after;
                    numbers[j+1] = before;
                }
            }
        }
        for (int number : numbers) {//for in
            System.out.print(number+" ");
        }
//        1 2 3 4 5
    }
}
```



#### 选择排序

在使用冒泡排序时，我们发现数组元素会频繁的交换值。我们可以使用选择排序，让每轮循环只进行一次交换。我们找到每轮循环的最大值，并将其与每轮循环的最后一个元素交换，并以此缩小范围：

```java
public class demo_5 {
    public static void main(String[] args) {
        int[] nums = {2,3,1,5,4};

        for (int i = 0; i < nums.length; i++) {
            int maxIndex = 0;
            for (int j = 1; j < nums.length-i; j++) {
                if (nums[j] > nums[maxIndex]){
                    maxIndex = j;
                }
            }

            int max = nums[maxIndex];
            int end = nums[nums.length-1-i];//下标为4 3 2 1 依次缩小

            nums[nums.length-1-i] = max;
            nums[maxIndex] = end;
        }

        for (int num : nums) {
            System.out.print(num+" ");
        }
//        1 2 3 4 5 
    }
}
```



#### 二分查找法

查找一个有序数组中的元素的位置。比如我们要查找从1到10的数组中的8在哪里，我们可以从数组末尾开始查找，那当数组元素个数为100时呢？

这个时候我们就可以使用二分查找法。比如我们要查找某个数，可以将这个数与数组中间的那个数进行比较。如果小于，则在左边找，如果大于就在右边找。然后循环进行这个操作，直到找到这个数。

```java
public class demo_6 {
    public static void main(String[] args) {
        int serchNum = 89;
        int[] nums = new int[100];
        for (int i = 0; i < nums.length; i++) {
            nums[i]=i+1;
        }

        int start = 0;
        int end = nums.length -1;
        int mid = 0;
        while (start<=end){
            mid = (start+end)/2;
            if (serchNum>nums[mid]){
                start = mid + 1;
            } else if (serchNum<nums[mid]) {
                end = mid - 1;
            } else {
                break;
            }
        }

        System.out.println("查找的数的下标为"+mid);//查找的数的下标为88
    }
}
```



### 字符串

#### 直接声明和new

字符串由`java.lang`包中的String类提供。

可以直接`String s = "ss";`声明字符串，也可以使用new方法：`String s = new String("ss");`

不过这两个是有区别的，直接声明字符串，当字符串的值相同时指向的是同一个字符串（**String缓冲池**）。

```java
String s1 = "ss";
String s2 = "ss";
String s3 = new String("ss");
String s4 = new String("ss");
System.out.println(s1==s2);//true
System.out.println(s3==s4);//false
```



字符串由一个个字符组成，字符由字节byte组成。比如英文字母一个字母占1字节，但中文占3字节。

我们使用字符数组和字节数组来创建字符串。

```java
char[] cs = {'i','中','国'};
String s = new String(cs);
System.out.println(s);//i中国

byte[] bs = {-28,-72,-83,-27,-101,-67};
String s1 = new String(bs);
System.out.println(s1);//中国
```



转义字符`\`

```java
System.out.println("\"");//"
System.out.println("\'");//'
System.out.println("a\nb");//a换行b
System.out.println("c\td");//c	d
System.out.println("\\");//\
```



#### 拼接

常规情况下可使用`+`拼接字符串：

```java
String s1 = "aa"+"bb";
String s2 = "aabb";
System.out.println(s1==s2);//true
System.out.println(s1.hashCode());//2986080
System.out.println(s2.hashCode());//2986080
```

上面两个字符串变量指向同一个字符串



当字符串遇到数值类型会将数值转为字符串并且进行拼接。

另外运算符从左到右运行，所以s3先对前面的`1+2`进行运算，所以s3的值为`3aabb12`

```java
String s1 = "aabb"+1+2;
String s2 = 1+"aabb"+1+2;
String s3 = 1+2+"aabb"+1+2;
System.out.println(s1);//aabb12
System.out.println(s2);//1aabb12
System.out.println(s3);//3aabb12
```



我们也可以使用`concat`对字符串进行拼接：

```java
String s1 = "aabb";
System.out.println(s1.concat("dd"));//aabbdd
```



#### 字符串的比较

在String中重写了equals方法，用于比较字符串值是否相等，我们也可以使用`equalsIgnoreCase`方法来忽略大小写进行比较。

```java
String s = "sss";
String s1 = "SsS";
System.out.println(s.equals(s1));//false
System.out.println(s.equalsIgnoreCase(s1));//true
```



我们可以使用`compareTo`方法比较字符串的大小（比较字节），正数大，负数小，0为相等。

```java
String s = "a";
String s1 = "A";
byte b = (byte)'a';
byte b1 = (byte)'A';
System.out.println(s.compareTo(s1));//32
System.out.println("a:"+b+"，b:"+b1);//a:97，b:65
```

我们可以看到，返回值为字节数值相减。



我们也可以使用`compareToIgnoreCase`方法来忽略大小写对字符串进行大小的比较

```java
String s = "a";
String s1 = "A";
System.out.println(s.compareToIgnoreCase(s1));//0
```