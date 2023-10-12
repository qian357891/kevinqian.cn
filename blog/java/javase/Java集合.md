---
date: 2023-01-10
category:
  - 后端
tag:
  - Java
archive: true
---



# Java集合

### 集合的概念

在java中，集合是一个名词而不是动词，集合是一种存储数据的容器。

如果只是为了容纳数据，可以使用数组。为什么有数组了还需要集合来存储数据呢？

- 数组使用时要确定元素个数，当使用场景中的元素个数不确定时，使用数组不太方便。

集合指的是一系列框架，在java.util中。包含了集合一系列的接口和类。

对不确定个数的有关系的数据进行相同的逻辑处理时，我们使用集合来操作更好。



根据数据的不同，java中的集合分为两种类型：

- 单一数据体系：Collection接口定义了相关规范
- 成对出现的数据体系：所谓的成对，是值一对数据相关联，可根据第一个数据关联到第二个数据。也称之为键值对数据`("kevin",20)->(key,value)`。比如Map接口就定义了这种规则。



### 常用接口和类

Collection接口：

常用的子接口

- List：按照插入顺序保存数据，数据可以重复。
- - 主要的具体实现类为：ArrayList，LinkedList
- Set：集，无序保存。数据不能重复。
- - 主要的具体实现类为：HashSet
- Queue：队列
- - 主要的具体实现类为：ArrayBlockingQueue

Map接口：

- 主要的具体实现类为：HashMap，HashTable



## List

### ArrayList

List：表示列表，清单。在清单中我们是先取出先插入的，所以list也是按照插入顺序读取，第一个插入，读取时也是第一个。并且它可以存储重复的数据。

Array：表示数组，序列。

在ArrayList这个集合类的内部就是使用数组来存储数据的。



ArrayList对象的创建：

```java
ArrayList arrayList = new ArrayList();
```

其中，有三种方式创建一个ArrayList：

- 不传参数，直接new。底层会创建一个空数组
- 传一个int类型的参数，用于设定底层数组的长度
- 传一个Collection集合类型的对象，用于将其他集合放置在当前集合中

我们来打印这个ArrayList对象：

```java
ArrayList arrayList = new ArrayList();
System.out.println(arrayList);// []
```

返回的集合对象中的数据（当前为空）



### 集合对象的基本操作

#### 增加数据

我们使用add方法向集合添加数据：

```java
ArrayList arrayList = new ArrayList();
arrayList.add("kevin");
arrayList.add("qina");
arrayList.add("kun");
System.out.println(arrayList);// [kevin, qina, kun]
```

对于一个没有传参new出的对象，它底层的数组长度会被自动设置为10。

那如果我们的数据超出了底层的数组长度会怎样呢？

为了方便，我们就声明一个底层数组长度为3的集合：

```java
ArrayList arrayList = new ArrayList(3);
arrayList.add("kevin");
arrayList.add("qina");
arrayList.add("kun");
arrayList.add("yes");
System.out.println(arrayList);// [kevin, qina, kun, yes]
```

我们看到，依然会进行添加数据。并且也没有报错，那这是为什么呢？

原来，在底层，遇到元素个数超出数组长度时。会创建一个更大的数组，并且将索引的内存空间指向原来的对象，然后再进行添加。这个操作叫**扩容**。而原来的数组就不会被使用了。

![image-20230109205656166](https://qiankun825.oss-cn-hangzhou.aliyuncs.com/img/image-20230109205656166.png)





#### 获取数据

使用get方法获取数据，传入参数为索引。使用`size()`方法来获取集合的元素个数

```java
ArrayList arrayList = new ArrayList(3);
arrayList.add("kevin");
arrayList.add("qian");
arrayList.add("kun");
arrayList.add("yes");

System.out.println(arrayList.size());// 4
System.out.println(arrayList.get(1));// qian
```



使用for循环来遍历集合：

```java
for (int i = 0; i < arrayList.size(); i++) {
    System.out.println(arrayList.get(i));
}
```

如果不关心数据的位置，我们可以使用forin来遍历（按顺序遍历）：

- for（类型 循环对象：集合）{}

```java
for (Object o : arrayList) {
    System.out.println(o);
}
```



#### 修改数据

使用`set()`方法修改数据，传入两个参数：

- 第一个参数：下标（索引）
- 第二个参数：修改的值

方法会返回结果，返回值为更新前的值：

```java
ArrayList arrayList = new ArrayList(3);
arrayList.add("kevin");
arrayList.add("qian");
arrayList.add("kun");
arrayList.add("yes");

Object chage = arrayList.set(3, "no");
arrayList.set(0, 3.0);
System.out.println(chage);// yes
System.out.println(arrayList);// [3.0, qian, kun, no]
```



#### 删除数据

使用`remove()`方法可以删除集合的数据，传入参数为数据的位置（索引）：

方法会返回结果，返回值为要删除的值

```java
ArrayList arrayList = new ArrayList(3);
arrayList.add("kevin");
arrayList.add("qian");
arrayList.add("kun");
arrayList.add("yes");

Object o = arrayList.remove(1);
System.out.println(o);//qian
System.out.println(arrayList.size());// 3
System.out.println(arrayList);// [kevin, kun, yes]
```



### ArrayList常用方法

当`add()`传入两个参数时，可以用于向集合指定位置插入数据：

- 第一个参数：索引
- 第二个参数：添加的数据

```java
ArrayList arrayList = new ArrayList();
arrayList.add("kevin");
arrayList.add("qian");

arrayList.add(0, "demo");
System.out.println(arrayList);// [demo, kevin, qian]
```

当插入数据时，之前该位置的数据会与后面的数据一起向后移。



使用`clear()`方法来清空集合中的数据：

```java
ArrayList arrayList = new ArrayList();
arrayList.add("kevin");
arrayList.add("qian");

System.out.println(arrayList.size());// 2
arrayList.clear();
System.out.println(arrayList);// []
System.out.println(arrayList.size());// 0
```



使用`removeAll()`来删除集合中的指定数据（如果移除了返回true，反之为false）：

参数类型是一个集合，可以使用`Collections.singleton()`来转为一个集合。

使用`addAll()`方法可以将一个集合的所有数据添加到该集合中（同样可以传两个参数）。

```java
ArrayList arrayList = new ArrayList();
arrayList.add("kevin");
arrayList.add("qian");
arrayList.add("qian");
arrayList.add("qian");

ArrayList list2 = new ArrayList();
list2.add("ok");
list2.add("nice");

arrayList.addAll(list2);

arrayList.removeAll(Collections.singleton("qian"));
System.out.println(arrayList);//[kevin, ok, nice]

boolean b = arrayList.removeAll(list2);
boolean b1 = arrayList.removeAll(Collections.singleton("lll"));
System.out.println(b);//true
System.out.println(b1);//false
System.out.println(arrayList);//[kevin]
```



使用`isEmpty()`方法来判断集合是否为空：

```java
ArrayList arrayList = new ArrayList();
arrayList.add("kevin");
arrayList.add("qian");
arrayList.add("qian");
arrayList.add("qian");

ArrayList list2 = new ArrayList();
System.out.println(arrayList.isEmpty());// false
System.out.println(list2.isEmpty());// true
```



使用`contains()`方法来判断集合中是否有这个数据：

```java
ArrayList arrayList = new ArrayList();
arrayList.add("kevin");
arrayList.add("qian");
arrayList.add("qian");
arrayList.add("qian");

System.out.println(arrayList.contains("kevin"));// true
System.out.println(arrayList.contains("kun"));// false
```



使用`indexOf()`方法和`lastIndexOf()`找到第一次出现和最后一次出现该数据的位置

```java
ArrayList arrayList = new ArrayList();
arrayList.add("kevin");
arrayList.add("qian");
arrayList.add("qian");
arrayList.add("qian");

System.out.println(arrayList.indexOf("qian"));// 1
System.out.println(arrayList.lastIndexOf("qian"));// 3
```



集合转数组：

```java
ArrayList arrayList = new ArrayList();
arrayList.add("kevin");
arrayList.add("qian");
arrayList.add("qian");
arrayList.add("qian");

Object[] objects = arrayList.toArray();
System.out.println(objects[1]);//qian
```

复制一份集合：

```java
ArrayList arrayList = new ArrayList();
arrayList.add("kevin");
arrayList.add("qian");
arrayList.add("qian");
arrayList.add("qian");

Object clone = arrayList.clone();
System.out.println(clone);// [kevin, qian, qian, qian]
```



### LinkedList

LinkedList是一种链表结构

```java
LinkedList list = new LinkedList();
list.addFirst("kevin");
System.out.println(list.getFirst());// kevin
System.out.println(list.getLast());// kevin
System.out.println(list);// [kevin]
```

取第一个数据和最后一个：

```java
LinkedList list = new LinkedList();
list.addFirst("kevin");
list.addFirst("qian");

System.out.println(list.getFirst());// qian
System.out.println(list.getLast());// kevin
System.out.println(list);// [qian, kevin]
```

添加数据（add默认添加到最后，两个参数为插入该索引位置）：

```java
LinkedList list = new LinkedList();
list.addFirst("kevin");
list.addFirst("qian");
list.add(1, "kun");

System.out.println(list);// [qian, kun, kevin]
```

`get`方法取数据

```java
LinkedList list = new LinkedList();
list.addFirst("kevin");
list.addFirst("qian");
list.add(1, "kun");

System.out.println(list.get(1));// kun
```

使用for循环遍历

```java
LinkedList list = new LinkedList();
list.addFirst("kevin");
list.addFirst("qian");
list.add(1, "kun");

for (int i = 0; i < list.size(); i++) {
    System.out.println(list.get(i));
}
// qian
// kun
// kevin
```

使用forin遍历：

```java
for (Object o : list) {
    System.out.println(o);
}
```

`set`方法修改数据

```java
LinkedList list = new LinkedList();
list.addFirst("kevin");
list.addFirst("qian");
list.add(1, "kun");

list.set(0, "kkkevin");
System.out.println(list.getFirst());// kkkevin
```

`remove`方法移除集合中的传入第一个数据：

```java
LinkedList list = new LinkedList();
list.addFirst("kevin");
list.addFirst("qian");
list.add(1, "kun");
list.addLast("kevin");

list.remove("kevin");
System.out.println(list);// [qian, kun, kevin]
```



### LinkedList常用方法

除了上面的一些方法外，它还有一些api我们经常使用：

`push()`方法用于向开头添加数据，类似addFirst。

```java
LinkedList list = new LinkedList();

list.push("kevin");
list.push("qian");
list.push("kun");
list.add("yt");

System.out.println(list);//[kun, qian, kevin, yt]
```

`element()`方法用于取第一个数据，类似getFirst。

```java
System.out.println(list.element());//kun
```

pop用于弹出数据，弹出第一个数据，返回值也是弹出的数据。

```java
LinkedList list = new LinkedList();

list.push("kevin");
list.push("qian");
list.push("kun");
list.add("yt");

System.out.println(list);//[kun, qian, kevin, yt]

System.out.println(list.pop());// kun
System.out.println(list);// [qian, kevin, yt]
```



### 泛型

由于多态性，集合在默认情况下下使用的时候非常不方便，因为数据的默认类型都是Object：

```java
ArrayList list = new ArrayList();
list.add(new Person());
list.add(new Person());
Object o = list.get(1);
o.personName();// 无法解析 'Object' 中的方法 'personName'
```

Person类：

```java
class Person {
    public void personName() {
        System.out.println("person...");
    }
}
```

如果要使用，就必须使用强制类型转换。非常不方便，而且可能出现类型转换错误的异常。

```java
Person o = (Person) list.get(1);
o.personName();// person...
```



这时候我们可以使用泛型，我们传入的数据都是同一个类型：

```java
ArrayList<Person> list = new ArrayList();
list.add(new Person());
Person person = list.get(0);
person.personName();// person...
```



**类型存在多态的使用，而泛型是没有多态的。**

```java
public class JavaCollection_05 {
    public static void main(String[] args) {
        Contains<User5> contains = new Contains();
        test(contains);// 需要的类型:Contains<Object> 提供的类型:Contains<User5>
    }

    public static void test(Contains<Object> contains) {
        System.out.println(contains);
    }
}

class Contains<C> {
    public C data;
}

class User5 {
}
```



### 比较器

集合提供了sort方法来进行排序，传入的是一个**实现了比较器接口的类的实例对象**：

```java
import java.util.ArrayList;
import java.util.Comparator;

public class JavaCollection_06 {
    public static void main(String[] args) {
        ArrayList list = new ArrayList();
        list.add(2);
        list.add(1);
        list.add(3);
        list.add(0);

        list.sort(new NumberComparator());
        System.out.println(list);// [0, 1, 2, 3]
    }
}

class NumberComparator implements Comparator<Integer> {
    @Override
    public int compare(Integer o1, Integer o2) {
        return o1 - o2;// 升序
    }
}
```

其中，compare方法中：

- 参数1>参数2，**返回值为正数，表示升序**
- 参数1<参数，**返回值为负，表示降序**
- 参数1==参数2，返回值为0。

官方解释：compare方法比较其两个顺序参数。返回负整数、零或正整数，因为第一个参数小于、等于或大于第二个参数。



### ArrayList与LinkedList比较

添加第一条数据，LinkedList更快

![image-20230110191430567](https://qiankun825.oss-cn-hangzhou.aliyuncs.com/img/image-20230110191430567.png)

添加后面的数据，ArrayList更快

但是，当ArrayList需要扩容时，LinkedList更快。

而插入数据，LinkedList更快。

![image-20230110193639330](https://qiankun825.oss-cn-hangzhou.aliyuncs.com/img/image-20230110193639330.png)

由于LinkedList没有索引的概念（在LinkedList中叫顺序），在LinkedList中使用索引实际上还是在按着顺序找。所以使用索引查找时，ArrayList更快。

如果不使用索引查找，两个集合的查找没有本质区别。



## Set

存储的数据是不重复的，无序的。

### HashSet

为什么是无序的呢？这是因为HashSet中运用了Hash算法来计算插入Set中的数据的位置（幂等性算法）。

![image-20230110194730066](https://qiankun825.oss-cn-hangzhou.aliyuncs.com/img/image-20230110194730066.png)

为什么是不重复的呢？因为Hash算法是幂等性算法，也就是说同一个值经过Hash算法计算出的位置是一定的。而存储相同数据相当于会进行覆盖，这样是没有意义的。所以HashSet也不会这样做，不会进行任何处理。我们可以插入相同的数据，但是存储的数据不会有重复的。



#### 添加数据

```java
HashSet set = new HashSet();
set.add("kevin");
set.add("kevin");
set.add("qian");
set.add("kun");
set.add("yt");

System.out.println(set);//[qian, kevin, kun, yt]
```



#### 修改数据

由于Hash算法的存在，无法确定修改后的数据经过Hash算法得出的位置与原位置一致，所以也无法修改数据。只能删除了数据后再进行添加。



#### 删除数据

```java
HashSet set = new HashSet();
set.add("kevin");
set.add("qian");
set.add("kun");

set.remove("kun");
System.out.println(set);// [qian, kevin]
```



#### 查询数据

只能使用for循环查询数据

```java
HashSet set = new HashSet();
set.add("kevin");
set.add("qian");
set.add("kun");

for (Object o : set) {
    System.out.println(o);
}
// qian
// kevin
// kun
```



#### 其他常用方法

Set的其他方法与List的差不多：

```java
HashSet set = new HashSet();

ArrayList list = new ArrayList();
list.add("kevin");
list.add("kevin");
list.add("qian");

set.addAll(list);

Object[] objects = set.toArray();
Object clone = set.clone();
// set.clear();

System.out.println(set);// [qian, kevin]
System.out.println(set.size());// 2
System.out.println(set.isEmpty());// false
```



#### HashSet重复数据

对于new一个对象，它们的地址肯定是不同的，所以HashSet认为这是两个不同的数据

```java
HashSet<Student> set = new HashSet();
set.add(new Student(1001, "kevin"));
set.add(new Student(1001, "kevin"));
set.add(new Student(1002, "qian"));

for (Student student : set) {
    System.out.println("id：" + student.id + "，name：" + student.name);
}
// id：1002，name：qian
// id：1001，name：kevin
// id：1001，name：kevin
```

在进行hash运算时，就是通过hashcode的值来进行运算的。

那么有没有可能不同的hashcode被hash运算计算为同一个位置呢？这是可能的，新的值会像链表结构一样被放在已经在当前位置的数据的后面

![image-20230110234629951](https://qiankun825.oss-cn-hangzhou.aliyuncs.com/img/image-20230110234629951.png)

所以说HashSet的底层数据结构为数组+链表



如果我们想让传入的引用类型数据的构造时传入的参数一致，就认为是同一数据，我们需要重写hashCode和equals

```java
public class JavaCollection_08 {
    public static void main(String[] args) {
        HashSet<Student> set = new HashSet();
        set.add(new Student(1001, "kevin"));
        set.add(new Student(1001, "kevin"));
        set.add(new Student(1002, "qian"));

        for (Student student : set) {
            System.out.println("id：" + student.id + "，name：" + student.name);
        }
        // id：1001，name：kevin
        // id：1002，name：qian
    }
}

class Student {
    public int id;
    public String name;

    Student(int id, String name) {
        this.id = id;
        this.name = name;
    }

    @Override
    public int hashCode() {
        return this.id;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj instanceof Student) {
            Student theStudent = (Student) obj;
            if (theStudent.id == this.id || theStudent.name.equals(this.name)) {
                return true;
            }
        }
        return false;
    }
}
```



## Queue

### ArrayBlockingQueue

Array+blocking（阻塞）+Queue

```java
ArrayBlockingQueue queue = new ArrayBlockingQueue(3);
queue.add("kevin");
queue.add("qian");
queue.add("kun");

System.out.println(queue);// [kevin, qian, kun]
```

ArrayBlockingQueue有个数限制。

```java
ArrayBlockingQueue queue = new ArrayBlockingQueue(3);
queue.add("kevin");
queue.add("qian");
queue.add("kun");
queue.add("yes");// 报错：Queue full

System.out.println(queue);// [kevin, qian, kun]
```

如何表现出Blocking？使用put添加数据

```java
ArrayBlockingQueue queue = new ArrayBlockingQueue(3);
queue.put("kevin");
System.out.println("第一个");// 第一个
queue.put("qian");
System.out.println("第二个");// 第二个
queue.put("kun");
System.out.println("第三个");// 第三个
queue.put("yes");// 由于blocking，不继续执行后面的代码。整个程序不会结束，会一直blocking
System.out.println("第四个");

System.out.println(queue);
```

我们可以使用offer存值，它会返回一个布尔值。成功为true，失败为false

```java
ArrayBlockingQueue queue = new ArrayBlockingQueue(3);
System.out.println(queue.offer("kevin"));// true
System.out.println(queue.offer("qian"));// true
System.out.println(queue.offer("kun"));// true
System.out.println(queue.offer("yt"));// false

System.out.println(queue);// [kevin, qian, kun]
```

可以使用poll方法取出来值，返回值为取出的值。

```java
ArrayBlockingQueue queue = new ArrayBlockingQueue(3);
queue.offer("kevin");
queue.offer("qian");
queue.offer("kun");
queue.offer("yt");

System.out.println(queue.poll());// kevin
System.out.println(queue.poll());// qian
System.out.println(queue.poll());// kun
System.out.println(queue.poll());// null

System.out.println(queue);// []
```

也可以使用take取值，当取完set中的值后再取值也会blocking：

```java
ArrayBlockingQueue queue = new ArrayBlockingQueue(3);
queue.offer("kevin");
queue.offer("qian");
queue.offer("kun");
queue.offer("yt");

System.out.println(queue.take());// kevin
System.out.println(queue.take());// qian
System.out.println(queue.take());// kun
System.out.println(queue.take());// 会blocking，后面的代码不会执行，并且程序不会退出。

System.out.println(queue);
```



## Map

键值对集合

### HashMap

类似HashSet，但是有覆盖的概念。根据key定位，value不同会进行覆盖。

![image-20230111214113798](https://qiankun825.oss-cn-hangzhou.aliyuncs.com/img/image-20230111214113798.png)

当key不同，但通过hash算法得到了同一个位置时。会通过链表结构存储，并且是单向链表。如果单向链表中数据存储的很多。查询起来效率很低，所以jdk中提供了一种特殊的结构——红黑二叉树。



#### 添加数据/修改数据

覆盖数据时，返回值为原数据。如果无原数据返回为空（null）

```java
HashMap map = new HashMap();
map.put("kevin", 1);
map.put("qian", 2);
System.out.println(map.put("kun", 3));// null
System.out.println(map.put("kevin", 4));// 1
System.out.println(map);// {qian=2, kevin=4, kun=3}
```



也可以使用`putIfAbsent`进行添加数据，如果有数据就不做处理，并返回那个数据的value

```java
HashMap map = new HashMap();
map.putIfAbsent("kevin", 1);
System.out.println(map.putIfAbsent("qian", 2));// null
System.out.println(map.putIfAbsent("kevin", 4));// 1
System.out.println(map);// {qian=2, kevin=1}
```



而修改数据可以使用`replace`方法，返回原数据的value

```java
HashMap map = new HashMap();
map.putIfAbsent("kevin", 1);
System.out.println(map.replace("kevin", 3));// 1
System.out.println(map.replace("yt", 3));// null
System.out.println(map);// {kevin=3}
```



#### 查询数据

返回值为value

```java
HashMap map = new HashMap();
map.put("kevin", 1);
map.put("qian", 2);
map.put("kun", 3);
map.put("kevin", 4);

System.out.println(map.get("kevin"));// 4
```



#### 删除数据

```java
HashMap map = new HashMap();
map.put("kevin", 1);
map.put("qian", 2);
map.put("kun", 3);
map.put("kevin", 4);

System.out.println(map.remove("kevin"));// 4
System.out.println(map);// {qian=2, kun=3}
```



当传两个值时是value为传入值时才删除，这时候返回值为是否删除（或者是否有这个数据）：

```java
HashMap map = new HashMap();
map.put("kevin", 1);
map.put("qian", 2);
map.put("kun", 3);
map.put("kevin", 4);

System.out.println(map.remove("kevin", 1));// false
System.out.println(map.remove("kevin", 4));// true
System.out.println(map);// {qian=2, kun=3}
```





#### 其它常用方法

将key取为一个set，并进行遍历来取key

```java
HashMap map = new HashMap();
map.put("kevin", "1");
map.put("qian", "2");
map.put("kun", "3");

Set set = map.keySet();
for (Object o : set) {
    System.out.println(o);
}
// qian
// kevin
// kun
```

将value取为一个集合，并遍历来取value

```java
HashMap map = new HashMap();
map.put("kevin", "1");
map.put("qian", "2");
map.put("kun", "3");

Collection values = map.values();
for (Object value : values) {
    System.out.println(value);
}
// 2
// 1
// 3
```

查询是否有key或者value：

```java
HashMap map = new HashMap();
map.put("kevin", "1");
map.put("qian", "2");
map.put("kun", "3");

System.out.println(map.containsKey("kevin"));// true
System.out.println(map.containsKey("kkk"));// false
System.out.println(map.containsValue("2"));// true
System.out.println(map.containsValue("5"));// false
```

使用entrySet将其转换为Set，并且使用for遍历，entry还有getKey方法和getValue方法来取key和value。

```java
HashMap<String, String> map = new HashMap();
map.put("kevin", "1");
map.put("qian", "2");
map.put("kun", "3");

Set<Map.Entry<String, String>> entries = map.entrySet();
for (Map.Entry<String, String> entry : entries) {
    System.out.print(entry + "   ");
    System.out.println(entry.getKey() + "," + entry.getValue());
}
// qian=2   qian,2
// kevin=1   kevin,1
// kun=3   kun,3
```



### Hashtable

Hashtable与HashMap区别：

- 1、实现方式不同（继承的父类不同）

- - Hashtable继承的Dictionary类
  - HashMap继承的AbstractMap类
- 2、底层结构的默认容量不同：HashMap默认为16，Hashtable默认为11
- 3、HashMap的K和V都可以为null，而Hashtable的K和V不能为null
- 4、HashMap的数据定位采用的Hash算法，而Hashtable采用的hashcode
- 5、HashMap的性能高，Hashtable的性能低。在多线程的并发操作下HashMap会出问题，而Hashtable不会出问题。

```java
HashMap map = new HashMap();
map.put(null, null);
System.out.println(map);//{null=null}

Hashtable hashtable = new Hashtable();
hashtable.put(null, null);// NullPointerException 空指针异常
```



## 迭代器

在使用for循环来删除map中的数据，并且使用set遍历的key来取value。

```java
HashMap<String, Integer> map = new HashMap<>();
map.put("a", 1);
map.put("b", 2);
map.put("c", 3);

Set<String> keys = map.keySet();
for (String key : keys) {
    if ("b".equals(key)) {
        map.remove(key);
    }
    System.out.println(map.get(key));
}
// 1
// null
// ConcurrentModificationException
```

但是，map中删除了，set并不能同步，set中还存有三个key的**位置**。所以会继续进行遍历，而遍历到最后一个数据时，由于删除了前面的数据。**导致现在set中只有两个数据，而没有第三个数据**，所以会出现错误。那有什么办法能够使其同步呢？



我们可以使用**迭代器**来进行操作：

```java
HashMap<String, Integer> map = new HashMap<>();
map.put("a", 1);
map.put("b", 2);
map.put("c", 3);

Set<String> keys = map.keySet();

Iterator<String> iterator = keys.iterator();
// hashNext用于判断是否存在下一条数据
while (iterator.hasNext()) {
    // 获取下一条数据
    String key = iterator.next();
    if ("b".equals(key)) {
        iterator.remove();// 只能对当前数据删除
    }
    System.out.println(map.get(key));
}
// 1
// null
// 3
```



## 集合中的工具类

### Arrays工具类

数组转为字符串：

```java
int[] ints = {1, 2, 3};
System.out.println(ints);// [I@776ec8df
System.out.println(Arrays.toString(ints));// [1, 2, 3]
```

在声明List时初始化List：

```java
List<Integer> integers = Arrays.asList(1, 2, 3, 4, 5);
System.out.println(integers);// [1, 2, 3, 4, 5]
```

排序，默认为升序：

```java
int[] ints = {2, 1, 4, 3, 0};
Arrays.sort(ints);
System.out.println(Arrays.toString(ints));// [0, 1, 2, 3, 4]
```

二分查找法（查找排序后的数组）：

```java
int[] ints = {2, 1, 4, 3, 0};
Arrays.sort(ints);
System.out.println(Arrays.toString(ints));// [0, 1, 2, 3, 4]
System.out.println(Arrays.binarySearch(ints, 4));// 4
```



数组的比较，顺序和数值都相同，也可以比较某一段数据，参数为：数组1，第一个索引（包含），第二个索引（不包含），数组2，第一个索引（包含），第二个索引（不包含）

```java
int[] ints = {1, 2, 3, 4, 5};
int[] ints1 = {1, 2, 3, 4, 5};
int[] ints2 = {0, 2, 6, 4, 5};
int[] ints3 = {0, 2, 6, 4, 5, 7, 8};

System.out.println(Arrays.equals(ints, ints1));// true
System.out.println(Arrays.equals(ints, ints2));// false

System.out.println(Arrays.equals(ints2, 0, 5, ints3, 0, 5));// true
```



## 集合中的常见异常

### ArrayList

IndexOutOfBoundsException，虽然容量为10。但是它的索引范围为：0——数据长度-1

```java
ArrayList list = new ArrayList(10);
list.add("kevin");
list.add("qian");

System.out.println(list.get(2));// IndexOutOfBoundsException： Index 2 out of bounds for length 2
```

### LinkedList

NoSuchElementException，不存在数据。

```java
LinkedList list = new LinkedList();
System.out.println(list.getFirst());// NoSuchElementException
```

### HashMap

HashMap一旦在**遍历时**进行数据的**增加和修改**，就会发生异常：

[比如这个之前的例子](#迭代器)

```java
HashMap map = new HashMap();
map.put("a", 1);
map.put("b", 2);
map.put("c", 3);

for (Object o : map.keySet()) {
    if ("b".equals(o)) {
        map.put("d", 4);
    }
}
// ConcurrentModificationException
```

所以这里尽量使用**[迭代器](#迭代器)**来进行操作。
