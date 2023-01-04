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

这里使用String类进行字符串的创建是因为如果直接声明字符串会因为**String缓冲池（字符串常量值）**而指向同一个字符串（这时候使用`==`会为true）。



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

上面两个字符串变量指向同一个字符串（字符串常量池）



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



#### 截断

使用`substring`方法可以对字符串进行截断，返回值为一个字符串。参数为索引（左闭，右开）。单个参数为从这个位置截到最后一个字符。

```java
String s = "Hello World";
System.out.println(s.substring(0,3));//Hel
System.out.println(s.substring(0,"Hello".length()));//Hello
System.out.println(s.substring(6,s.length()));//World
System.out.println(s.substring(6));//World
```



使用`split`方法进行对字符串的分割，参数为一个字符串（可以为正则表达式）。返回值为一个字符串数组：

```java
String s = "Hello World";
String[] ss = s.split(" ");
System.out.println(ss.length);//2
for (String s1 : ss) {
System.out.println(s1);
}
//Hello
//World
```



使用`trim`方法来去除字符串开头和结尾的空格：

```java
String s = "Hello World";
String s1 = "    Hello world    ";
System.out.println(s.trim());//Hello World
System.out.println("!"+s1.trim()+"!");//!Hello world!
```



#### 替换

使用`replace`方法来对字符串的某段字符串进行替换，参数为（被替换的字符串，替换后的字符串）。如果有多个相同的`oldString`，则会全部替换。

```java
String s = "Hello World";
System.out.println(s.replace("World","Java"));//Hello Java
String s1 = "Hello World World";
System.out.println(s1.replace("World","Java"));//Hello Java Java
```

对于想把不同的字符串都替换为同一个字符串，我们可以使用`replaceAll`方法，它第一个参数接受传入正则表达式：

```java
String s = "Hello World Kevin";
System.out.println(s.replaceAll("World|Kevin", "Java"));//Hello Java Java
```



#### 大小写转换

我们可以使用`toLowerCase`和`toUpperCase`来使一个字符串中的字母进行全部的大小写转换：

```java
String s = "Hello World Kevin";
System.out.println(s.toLowerCase());//hello world kevin
System.out.println(s.toUpperCase());//HELLO WORLD KEVIN
```

我们也可以结合字符串的截断来对某个字符进行大小写的转换：

```java
String s = "kevin";
String first = s.substring(0,1);
String after = s.substring(1);
String newS = first.toUpperCase() + after;
System.out.println(newS);//Kevin
```



#### 查询

使用`toCharArray()`方法可通过字符串返回一个字符数组，也可以使用`getBytes()`方法来返回一个字节数组。

```java
String s = "kevin Qian";
char[] cs = s.toCharArray();
System.out.println(Arrays.toString(cs));//[k, e, v, i, n,  , Q, i, a, n]
byte[] bs = s.getBytes();
System.out.println(Arrays.toString(bs));//[107, 101, 118, 105, 110, 32, 81, 105, 97, 110]
```



`charAt`方法可通过下标查找字符的值

```java
String s = "kevin Qian";
System.out.println(s.charAt(2));//v
```

`indexOf`方法用于查找第一次出现传入字符串的第一个字符的索引，`lastIndexOf`为最后一次出现传入字符串的第一个字符的索引。

```java
String s = "kevin Qian Qian";
System.out.println(s.indexOf("Qian"));//6
System.out.println(s.lastIndexOf("Qian"));//11
```



`contains`方法用于查询字符串中是否有这个字符串，`startsWith`用于查找是否以该字符串开头，`endsWith`用于查找是否以该字符串结尾。

```java
String s = "kevin Qian";
System.out.println(s.contains("kevin"));//true
System.out.println(s.startsWith("kevin"));//true
System.out.println(s.endsWith("Qian"));//true
System.out.println(s.startsWith("demo"));//false
System.out.println(s.endsWith("Kun"));//false
```



`isEmpty`查询字符串是否为空字符串

```java
String s = "kevin Qian Qian";
String s1 = "";
System.out.println(s.isEmpty());//false
System.out.println(s1.isEmpty());//true
```



#### StringBuilder

假如我们现在对一个字符串进行大量的拼接

```java
String s = "";
for (int i = 0; i < 100; i++) {
    s = s+i;
}
System.out.println(s);//01234...
```

我们知道，字符串拼接会创建新的字符串，大量使用`+`进行字符串的拼接会频繁创建字符串对象，效率非常低。

如果我们使用new，效率更低，而之前的contact也是使用的new来创建字符串。



这时候，我们可以使用`StringBuilder`类来操作字符串：

```java
StringBuilder s = new StringBuilder();
for (int i = 0; i < 100; i++) {
    s.append(i);
}
System.out.println(s);//01234...
```

我们先创建一个StringBuilder对象，并且使用`append`方法将其末尾进行字符串的拼接。

这时候拼接字符串效率就比较高了，因为在底层`StringBuilder`是通过数组来进行拼接的。



另外，StringBuilder还提供了其他好用的操作字符串的方法：

```java
StringBuilder s = new StringBuilder("abc");
System.out.println(s.length());//3 长度
System.out.println(s.reverse());//cba  反转
System.out.println(s.insert(1, "替换"));//c替换ba  替换
```



### 封装类

Java中有基本类型和引用类型，引用类型都继承自Object类。基本类型没有属性和对象，所以用起来功能相对于引用类型较少，在于其它对象一起使用的时候不太方便，比如int不能直接转成字符串。

所以为了优化对基本类型的处理，Java提供了八个特殊的类与八个基本类型一一对应：

```java
Byte b = null;
Short st = null;
Integer integer = null;
Long l = null;
Float f = null;
Double d = null;
Character character = null;
Boolean boo = null;
```



现在，我们以Integer来举例：

我们可以使用new来创建一个Integer对象，但是不推荐，这种写法已经被弃用了。

```java
int i = 10;
Integer integer = new Integer(i);//'Integer(int)' 已被弃用并被标记为移除 
```



我们可以使用`Integer.valueOf(i)`来创建Integer对象，这种操作叫装箱

```java
int i = 10;
Integer integer = Integer.valueOf(i);
```



由于这种操作非常多，所以Java给我们简化了一些操作，我们可以直接声明一个值来创建一个Integer对象：

```java
int i = 10;
//自动装箱
Integer integer = i;
```

这样的操作叫**自动装箱**。



我们可以使用`intValue()`方法来将其转换为一个基本数据类型，这样的操作叫拆箱

```java
int i = 10;
Integer integer = i;
int i1 = integer.intValue();
```

同样的，Java也给我们提供了**自动拆箱**：

```java
int i = 10;
Integer integer = i;
int i1 = integer;
```



### 日期类

对于时间，System提供了`currentTimeMillis()`方法来取时间，这个时间返回的是时间戳（1970-1-1到现在的毫秒数）

```java
System.out.println(System.currentTimeMillis());//1672828528675
```

这样看时间很不方便，所以Java提供了Data类，我们这里说的是`java.util.Date`，而不是`java.sql.Date`（这个类用于数据库中的日期类型数据）。

```java
Date date = new Date();
System.out.println(date);//Wed Jan 04 18:40:18 HKT 2023
```

这里返回的是当前时间，但是我们看到格式非常不好看，我们想转换为我们常用的格式。



我们需要使用`SimpleDateFormat`对象来将其进行格式化：

```java
Date date = new Date();
System.out.println(date);//Wed Jan 04 18:48:20 HKT 2023
SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
String dateFormatString = dateFormat.format(date);
System.out.println(dateFormatString);//2023-01-04 18:48:20.534
```

其中`SimpleDateFormat`构建实例对象时传入的是一个字符串，这个字符串就是我们的格式。

其中：

- y（Y）：yyyy：年
- m（M）：MM：月，mm：分钟
- d（D）：dd：一个月中的日期，DD：一年中的日期
- h（H）：hh：12进制，HH：24进制
- s（S）：ss：秒，SSS：毫秒



上面是通过字符串规范来得到格式化的时间，我们也能通过格式化的时间来得到Data类型的时间：

```java
Date date = new Date();
SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

String dataString = "2022-10-01";
Date parseDate = dateFormat.parse(dataString);
System.out.println(parseDate);//Sat Oct 01 00:00:00 HKT 2022
```



我们也可以使用指定的时间戳来修改时间，以及通过Date对象获取时间戳：

```java
Date date = new Date();
date.setTime(System.currentTimeMillis());
date.getTime();
```



可以使用Data类的before方法来比较该时间是否在传入Date类的对象前面，使用after方法比较该时间是否在传入Date类的对象后。

```java
Date date = new Date();
SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

String dataString = "2022-10-01";
Date parseDate = dateFormat.parse(dataString);
System.out.println(parseDate.before(date));//true        
System.out.println(parseDate.after(date));//false
```



当我们想使用Date类的对象来取得年月日时，发现被画了横线。并且告诉我们已经被弃用了：

![image-20230104192012892](https://qiankun825.oss-cn-hangzhou.aliyuncs.com/img/image-20230104192012892.png)

这是因为这些方法已经可以使用另外一个类来方便获取了，这个类就是日历类。



### 日历类

Java为我们提供了日历类Calendar，这个类是一个抽象类，不能使用new来构建实例对象。

但我们可以使用它的`getInstance()`方法来构建对象

```java
new Calendar();//'Calendar' 为 abstract；无法实例化
Calendar instance = Calendar.getInstance();
```



我们可以通过Calendar类型对象的get方法来取得年月日：

```java
Calendar instance = Calendar.getInstance();
System.out.println(instance.get(Calendar.YEAR));//2023
System.out.println(instance.get(Calendar.MONTH));//0 （月份从0开始）
System.out.println(instance.get(Calendar.DATE));//4
```



也可以传入Data来设置时间，也可以使用add来添加日期的时间：

```java
Calendar instance = Calendar.getInstance();
instance.setTime(new Date());

instance.add(Calendar.YEAR,1);
instance.add(Calendar.MONTH,2);

System.out.println(instance.get(Calendar.YEAR));//2024
System.out.println(instance.get(Calendar.MONTH));//2
```



Java中Calendar.DAY_OF_WEEK其实表示：一周中的第几天，所以他会受到**第一天是星期几**的影响。

打印日历：





### 工具类

封装一个String工具类：

- 判断字符串为空（null，""，"     "）
- 随机生成字符串
- 转换字符串编码
- 格式化时间或者通过规则得到Date时间

```java
package util_class;

import java.io.UnsupportedEncodingException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Random;
import java.util.UUID;

public class demo_util_14 {
    public static void main(String[] args) throws ParseException {
        System.out.println(StringUtils.isNotEmpty(null));//false
        System.out.println(StringUtils.isNotEmpty(""));//false
        System.out.println(StringUtils.isNotEmpty("     "));//false
        System.out.println(StringUtils.isNotEmpty("kevin"));//true

        System.out.println(StringUtils.RandomString());//859255b7-18bd-4524-85cc-1790c261ae73
        System.out.println(StringUtils.RandomString("kevinqian", 5));//vqini

        System.out.println(StringUtils.formatDate(new Date(), "yyyy-MM-dd"));//2023-01-04
        System.out.println(StringUtils.praseDate("2022-10-1", "YYYY-MM-dd"));//Sun Dec 26 00:00:00 HKT 2021
    }
}

class StringUtils {
    //判断字符串是否为非空（空字符串取反）
    public static boolean isEmpty(String str) {
        //这里我们认为：null 空字符串 只有空格 为所谓的字符串为空。
        if (str == null || str.trim().equals("")) {
            return true;
        }
        return false;
    }

    public static boolean isNotEmpty(String str) {
        return !isEmpty(str);
    }

    //生成随机字符串
    public static String RandomString() {
        return UUID.randomUUID().toString();//直接生成UUID
    }

    //    在某个字符串中随机取出字符进行拼接（传入字符串和生成随机字符串的长度）
    public static String RandomString(String str, int len) {
        if (len < 1) {
            return "";
        }
        char[] chars = str.toCharArray();
        StringBuilder stringBuilder = new StringBuilder();
        for (int i = 0; i < len; i++) {
            Random random = new Random();
            int j = random.nextInt(chars.length);//[0,chars.length)的随机整数
            char c = chars[j];
            stringBuilder.append(c);
        }
        return stringBuilder.toString();
    }


    //转换字符串：IOS8859-1 => str => UTF-8
    public static String transform(String sourse, String encodeFrom, String encodeTo) throws UnsupportedEncodingException {
        byte[] bytes = sourse.getBytes(encodeFrom);
        return new String(bytes, encodeTo);
    }

    //格式化时间或者通过规则得到Date时间
    public static Date praseDate(String dateString, String format) throws ParseException {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat(format);
        return simpleDateFormat.parse(dateString);
    }

    public static String formatDate(Date date, String format) {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat(format);
        return simpleDateFormat.format(date);
    }
}
```



### 比较

只要值相等，基本类型不会比较类型

```java
int i = 10;
double d = 10.0;
System.out.println(i == d);//true
```

对于equals，很多类对其重写了，比如我们常用的String。



我们在声明自定义类的时候，要比较两个对象的值，比如传入参数是否相同。可以重写equals：

```java
public class demo_15 {
    public static void main(String[] args) {
        TheUser theUser = new TheUser();
        TheUser theUser1 = new TheUser();
        System.out.println(theUser1.equals(theUser));//true
    }
}

class TheUser {
    @Override
    public boolean equals(Object obj) {
        return true;
    }
}
```





而对于封装类，我们使用`==`等号时需要注意：

```java
Integer integer = 100;
Integer integer1 = 100;
System.out.println(integer1 == integer);//true
Integer integer2 = 130;
System.out.println(integer1 == integer2);//false
```



这是因为封装类Integer对`-128~127`的整数做了缓存，所以在这个范围类的同值Integer指向的是同一个对象

```java
Integer integer = 127;
Integer integer1 = 127;
System.out.println(integer1 == integer);//true
Integer integer2 = 128;
Integer integer3 = 128;
System.out.println(integer3 == integer2);//false
Integer integer4 = -128;
Integer integer5 = -128;
System.out.println(integer4 == integer5);//true
Integer integer6 = -129;
Integer integer7 = -129;
System.out.println(integer6 == integer7);//false
```

建议引用类型都用equals比较