### 1、注册驱动

这样会注册两次驱动，new Driver()中Driver类的静态代码块也会注册驱动：

```java
DriverManager.registerDriver(new Driver());
```

如果直接使用new Driver()，相当于代码写死了，不够灵活。new Driver()用的是`com.mysql.cj.jdbc.Driver`类，如果换成oracle就要重写，我们可以使用反射，传入类名，然后将类名写入配置文件。到时候修改配置文件中的内容就行了。

```java
Class.forName("com.mysql.cj.jdbc.Driver");
```

这里也会触发类加载，触发静态代码块的调用。



### 2、获取数据库连接

`getconnection`方法是个重载方法

一个参数：

- url：`jdbc:mysql//localhost:3306/guigudb?user=root&password=root`
- - 其中，如果是本机地址（localhost，127.0.0.1）可省略且端口号为3306可省略
  - `jdbc:mysql///guigudb`
  - 在数据库后跟：`?key=value&key=value`



两个参数：

- url
- properties info ，类似Map
- - key user：账号信息
  - key password：密码信息

```java
Properties info = new Properties();
info.put("user","root");
info.put("password","root");
DriverManager.getConnection("jdbc:mysql///guigudb",info);
```



三个参数：

- url
- user
- password



### 3、创建发送sql语句的statement对象

```java
Statement statement = connection.createStatement();
```



### 4、发送sql语句

```java
String sql2 = "SELECT * FROM `user` WHERE username = "+account+" AND `password` = "+pass+";";
```



### 5、查询结果解析

**executeUpdate参数为非DQL（查询）的sql，返回int**

- 情况1：DML返回影响的行数，如删除了三条数据，return 3
- 情况2：非DML，return 0



**如果sql语句是DQL（查询），使用execteQuery解析**

返回：resultSet 结果封装对象

resultSet对象有“行和列”，内部包含一个游标，指定当前数据。默认游标指定的是第一行数据之前。

我们可以调用next方法向后移动一个游标，如果有很多行数据，可以使用while(next){获取每一行的数据}

`resultSet.getString(第几列的数据)`或者`resultSet.getString(列名)`

```java
ResultSet resultSet = statement.executeQuery(sql1);
while (resultSet.next()){
    int id = resultSet.getInt(1);
    String username = resultSet.getString("username");
    String password = resultSet.getString(3);
    System.out.println("id为："+id+"，用户名为："+username+"，密码为："+password);
}
```

如果只有一行：

```java
//...
String sql2 = "SELECT * FROM `user` WHERE username = '"+account+"' AND `password` = '"+pass+"';";

ResultSet resultSet = statement.executeQuery(sql2);

if (resultSet.next()){
    System.out.println("登录成功");
} else {
    System.out.println("登录失败");
}
```



### 6.关闭资源

```java
resultSet.close();
statement.close();
connection.close();
```



### statement的缺陷

- SQL语句需要字符串拼接比较麻烦

- 只能拼接字符串类型，其他的数据库类型无法处理

- **可能发生注入攻击**

- - ```mysql
    请输入用户名：
    demodmeodmeodmeo
    请输入用户密码：
    ' or '1' = '1
    登录成功
    ```

  - **因为动态值充当了SQL语句结构，影响了原有的查询结果**



### 基于preparedStatement方式优化

preparedStatement可以解决上述案例的**注入攻击**和**SQL语句拼接问题**

- 1、编写SQL语句结果，不包含动态值部分的语句。动态值部分使用站位符`?`替代，注意：`?`只能替代动态值，不能是表名这些。
- 2、创建preparedStatement，并且传入动态值
- 3、动态值 占位符 赋值 `?` 单独赋值即可
- 4、发送SQL语句即可，并获取返回结果

```java
package org.example.api.preparedStatement;

import com.mysql.cj.jdbc.Driver;

import java.sql.*;
import java.util.Scanner;

public class PSUserLogin {
    public static void main(String[] args) throws ClassNotFoundException, SQLException {
//        1.收集用户信息
        Scanner scanner = new Scanner(System.in);
        System.out.println("请输入用户名：");
        String account = scanner.nextLine();
        System.out.println("请输入用户密码：");
        String pass = scanner.nextLine();
//        2.注册驱动
        Class.forName("com.mysql.cj.jdbc.Driver");
//        3.获取连接
        Connection connection = DriverManager.getConnection("jdbc:mysql:///jdbc_demo", "root", "root");
//        4.创建preparedStatement，并设置sql语句结果
        String sql = "SELECT * FROM `user` WHERE username = ? AND `password` = ?;";
        PreparedStatement preparedStatement = connection.prepareStatement(sql);
//        5.单独占位符进行赋值
        preparedStatement.setObject(1,account);
        preparedStatement.setObject(2,pass);
//        6.发送sql语句，并获取返回结果
        ResultSet resultSet = preparedStatement.executeQuery();
//        7.结果解析
        if (resultSet.next()){
            System.out.println("登录成功");
        }else{
            System.out.println("登录失败");
        }
//        8.关闭资源
        resultSet.close();
        preparedStatement.close();
        connection.close();
    }
}
```



![image-20230227143941570](https://qiankun825.oss-cn-hangzhou.aliyuncs.com/img/image-20230227143941570.png)



### preparedStatement对象实现CRUD

#### 插入

```java
@Test
    public void testInsert() throws ClassNotFoundException, SQLException {
        /*
        * 插入用户名为：二狗子
        * 密码为：ergouzi123
        * nickname为：狗狗狗
        * */

//        1.注册驱动
        Class.forName("com.mysql.cj.jdbc.Driver");
//        2.连接数据库
        Connection connection = DriverManager.getConnection("jdbc:mysql:///jdbc_demo?user=root&password=root");
//        3.编写sql语句，用？对动态值进行替代
        String sql = "INSERT INTO user(username,password,nickname) values(?,?,?)";
//        4.创建preparedStatement对象，传入sql语句
        PreparedStatement preparedStatement = connection.prepareStatement(sql);
//        5.占位符赋值
        preparedStatement.setObject(1,"二狗子");
        preparedStatement.setObject(2,"ergouzi123");
        preparedStatement.setObject(3,"狗狗狗");
//        6.发送sql语句
        int rows = preparedStatement.executeUpdate();
//        7.输出结果
        if (rows>0){
            System.out.println("数据插入成功");
        }else {
            System.out.println("数据插入失败");
        }
//        8.关闭资源
        preparedStatement.close();
        connection.close();

    }
```



#### 修改

```java
    @Test
    public void testUpdate() throws ClassNotFoundException, SQLException {
        /*
        * 修改id为3的用户，
        * 将其密码改为jjj
        * 将nickname修改为kevin
        * */
//        1.注册驱动
        Class.forName("com.mysql.cj.jdbc.Driver");
//        2.连接数据库
        Connection connection = DriverManager.getConnection("jdbc:mysql:///jdbc_demo", "root", "root");
//        3.声明sql语句
        String sql = "UPDATE user SET password = ?,nickname = ? WHERE id = ?";
//        4.声明preparedStatement对象
        PreparedStatement preparedStatement = connection.prepareStatement(sql);
//        5.给占位符赋值
        preparedStatement.setObject(1,"jjj");
        preparedStatement.setObject(2,"kevin");
        preparedStatement.setObject(3,3);
//        6.发送sql语句
        int rows = preparedStatement.executeUpdate();
//        7.输出结果
        if (rows>0){
            System.out.println("修改成功");
        } else {
            System.out.println("修改失败");
        }
//        8.关闭资源
        preparedStatement.close();
        connection.close();
    }
```



#### 删除

```java
    @Test
    public void testDelete() throws ClassNotFoundException, SQLException {
        /*
        * 删除id为2的数据
        * */
//        1.注册jdbc驱动
        Class.forName("com.mysql.cj.jdbc.Driver");
//        2.连接数据库
        Connection connection = DriverManager.getConnection("jdbc:mysql:///jdbc_demo", "root", "root");
//        3.编写sql语句
        String sql = "DELETE FROM user WHERE id = ?";
//        4.声明preparedStatement对象
        PreparedStatement preparedStatement = connection.prepareStatement(sql);
//        5.给占位符赋值
        preparedStatement.setObject(1,2);
//        6.发送sql语句
        int rows = preparedStatement.executeUpdate();
//        7.输出结果
        if (rows>0){
            System.out.println("删除成功");
        }else {
            System.out.println("删除失败");
        }
//        8.关闭资源
        preparedStatement.close();
        connection.close();
    }
```



#### 查询

```java
    @Test
    public void testSelect() throws ClassNotFoundException, SQLException {
//        1.注册jdbc驱动
        Class.forName("com.mysql.cj.jdbc.Driver");
//        2.连接数据库
        Connection connection = DriverManager.getConnection("jdbc:mysql:///jdbc_demo", "root", "root");
//        3.编写sql语句
        String sql = "select id,username,password,nickname from user";
//        4.声明preparedStatement对象
        PreparedStatement preparedStatement = connection.prepareStatement(sql);
//        5.给占位符赋值（省略）
//        6.发送sql语句
        preparedStatement.executeQuery();
//        7.输出结果
        List<Map> list = new ArrayList<>();
        ResultSet resultSet = preparedStatement.getResultSet();
        while (resultSet.next()){
            HashMap hashMap = new HashMap();
            hashMap.put("id",resultSet.getInt("id"));
            hashMap.put("username",resultSet.getString("username"));
            hashMap.put("password",resultSet.getString("password"));
            hashMap.put("nickname",resultSet.getString("nickname"));

            list.add(hashMap);
        }
        System.out.println("list = " + list);
//        8.关闭资源
        resultSet.close();
        preparedStatement.close();
        connection.close();
    }
```



上面的将数据存入map可以这样写：

```java
    @Test
    public void testSelect() throws ClassNotFoundException, SQLException {
//        1.注册jdbc驱动
        Class.forName("com.mysql.cj.jdbc.Driver");
//        2.连接数据库
        Connection connection = DriverManager.getConnection("jdbc:mysql:///jdbc_demo", "root", "root");
//        3.编写sql语句
        String sql = "select id,username,password,nickname from user";
//        4.声明preparedStatement对象
        PreparedStatement preparedStatement = connection.prepareStatement(sql);
//        5.给占位符赋值（省略）
//        6.发送sql语句
        preparedStatement.executeQuery();
//        7.输出结果
        List<Map> list = new ArrayList<>();
        ResultSet resultSet = preparedStatement.getResultSet();

        // 数据的列数
        ResultSetMetaData metaData = resultSet.getMetaData();
        int columnCount = metaData.getColumnCount();

        while (resultSet.next()){
            HashMap hashMap = new HashMap();
            // 向map循环存入一行的每列数据
            for (int i = 1; i < columnCount; i++) {
                String columnName = metaData.getColumnLabel(i);
                Object value = resultSet.getObject(i);

                hashMap.put(columnName,value);
            }

            list.add(hashMap);
        }
        System.out.println("list = " + list);
//        8.关闭资源
        resultSet.close();
        preparedStatement.close();
        connection.close();
    }
```

为什么用`getColumnLabel`而不是`getColumnName`，因为`getColumnLabel`可以获取列的别名，而`getColumnName`只能获取列名。
