---
authors: kevinqian
date: 2023-02-01
tags: [MySQL,后端]
---

# DML之增删改

### 增加数据

插入数据使用`INSERT INTO`和`VALUES`关键字，有两种方式插入数据：

- 方式1：按照表的属性顺序插入
- 方式2：自定义顺序（推荐），如果没有传入，默认为NULL

```mysql
INSERT INTO emp1
VALUES(1,'kevin',20,'2002-01-01',8000);

INSERT INTO emp1(`name`,age,salary,id,bith)
VALUES ('qian',20,30000,2,'2002-01-01');

INSERT INTO emp1(`name`,age,salary,id)
VALUES ('kun',20,30000,3);
```

添加多条数据：

```mysql
INSERT INTO emp1(`name`,age,salary,id)
VALUES
('tt',21,3000,4),
('yn',22,30800,5);
```



将查询的结果插入到表中：

```mysql
INSERT INTO emp1(`name`,bith,salary,id)
SELECT first_name,hire_date,salary,employee_id
FROM employees
WHERE department_id IN (70,80);
```

注意：SELECT语句中的数据顺序要与插入的顺序一致。

说明：empl表中要添加数据的字段长度不能低于employees表中查询的字段的长度。

如果empl表中要添加数据的字段的长度低于employee表中查询的字段的长度的话，就有添加不成功的风险。



### 修改数据

```mysql
UPDATE emp1
SET bith = CURRENT_DATE()
WHERE id = 5;
```

修改多列数据：

```mysql
UPDATE emp1
SET bith = CURRENT_DATE(),
salary = 10000
WHERE id = 5;
```

修改多条记录：

```mysql
UPDATE emp1
SET bith = CURRENT_DATE(),
salary = 60000
WHERE id IN (1,2,3,4);
```

修改记录是有可能不成功的（有可能是由于约束的影响造成的）

```mysql
UPDATE emp1
SET department_id = 1234 #没有这个department_id
WHERE department_id = 50;
```



### 删除数据

```mysql
DELETE FROM emp1
WHERE id = 1;
```

在删除数据时，也有可能因为约束的影响，导致删除失败。



### 小结

DML操作默认情况下，执行完后都会自动提交数据。

如果希望执行完以后不自动提交数据，则需要使用`SET autocommit = FALSE`



### MySQL8新特性：计算列

```mysql
CREATE TABLE count_cloumn(
	a INT,
	b INT,
	c INT GENERATED ALWAYS AS (a+b) VIRTUAL
);

INSERT INTO count_cloumn(a,b)
VALUES (10,20);
#插入a为10，b为20，c为30（自动计算）
```

当更新数据a和b时，c也会跟着更新：

```mysql
UPDATE count_cloumn
SET a = 100;
#c自动更新为120
```



### DDL与DML综合案例

```mysql
# 1、创建数据库test01_library
CREATE DATABASE test01_library;
USE test01_library;

# 2、创建表 books，表结构如下：
CREATE TABLE books(
	id INT,
	`name` VARCHAR(50),
	`authors` VARCHAR(100),
	price FLOAT,
	pubdate YEAR,
	note VARCHAR(100),
	num INT
);

# 3、向books表中插入记录
# 1）不指定字段名称，插入第一条记录
INSERT INTO books
VALUES(1,'Tal of AAA','Dickes',23,1995,'novel',11);
# 2）指定所有字段名称，插入第二记录
INSERT INTO books(id,`name`,`authors`,price,pubdate,note,num)
VALUES(2,'EmmaT','Jane lura',35,1993,'joke',22);
# 3）同时插入多条记录（剩下的所有记录）
INSERT INTO books(id,`name`,`authors`,price,pubdate,note,num) VALUES
(3,'Story of Jane','Jane Tim',40,2001,'novel',0),
(4,'Lovey Day George','Byron',20,2005,'novel',30),
(5,'Old land Honore','Blade',30,2010,'law',0),
(6,'The Battle Upton','Sara',30,1999,'medicine',40),
(7,'Rose Hood Richard','haggard',28,2008,'cartoon',28);

# 4、将小说类型(novel)的书的价格都增加5。
UPDATE books
SET price = price + 5
WHERE note = 'novel';

# 5、将名称为EmmaT的书的价格改为40，并将说明改为drama。
UPDATE books
SET price = 40,note = 'drama'
WHERE `name` = 'EmmaT';

# 6、删除库存为0的记录。
DELETE FROM books
WHERE num = 0;


# 7、统计书名中包含a字母的书
SELECT * FROM books
WHERE `name` REGEXP '[a]';

# 8、统计书名中包含a字母的书的数量和库存总量
SELECT COUNT(*),SUM(num) FROM books
WHERE `name` REGEXP '[a]';

# 9、找出“novel”类型的书，按照价格降序排列
SELECT * FROM books
WHERE note = 'novel'
ORDER BY price DESC;

# 10、查询图书信息，按照库存量降序排列，如果库存量相同的按照note升序排列
SELECT * FROM books
ORDER BY num DESC,note ASC;

# 11、按照note分类统计书的数量
SELECT note,COUNT(*) FROM books
GROUP BY note;

# 12、按照note分类统计书的库存量，显示库存量超过30本的
SELECT note,SUM(num) FROM books
GROUP BY note
HAVING SUM(num)>30;

# 13、查询所有图书，每页显示5本，显示第二页
SELECT * FROM books
LIMIT 5 OFFSET 5;

# 14、按照note分类统计书的库存量，显示库存量最多的
SELECT note,SUM(num) FROM books
GROUP BY note 
ORDER BY SUM(num) DESC
LIMIT 1 OFFSET 0;

# 15、查询书名达到10个字符的书，不包括里面的空格
SELECT * FROM books
WHERE CHAR_LENGTH(REPLACE(name,' ',''))>=10;

# 16、查询书名和类型，其中note值为novel显示小说，law显示法律，medicine显示医药，cartoon显示卡通，joke显示笑话
SELECT `name` AS '书名',note,CASE note
	WHEN 'novel' THEN
		'小说'
	WHEN 'low' THEN
		'法律'
	WHEN 'medicine' THEN
		'医药'
	WHEN 'cartoon' THEN
		'卡通'
	WHEN 'joke' THEN
		'笑话'
END AS '类型'
FROM books;


# 17、查询书名、库存，其中num值超过30本的，显示滞销，大于0并低于10的，显示畅销，为0的显示需要无货
SELECT `name`,num,CASE
	WHEN num>30 THEN
		'滞销'
	WHEN num>0 AND num<10 THEN
		'畅销'
	WHEN num=0 THEN
		'无货'
END AS '销量'
FROM books;

# 18、统计每一种note的库存量，并合计总量
SELECT IFNULL(note,'合计总数') AS note,SUM(num)
FROM books
GROUP BY note
WITH ROLLUP;


# 19、统计每一种note的数量，并合计总量
SELECT IFNULL(note,'合计总数') AS note,COUNT(*)
FROM books
GROUP BY note
WITH ROLLUP;

# 20、统计库存量前三名的图书
SELECT * FROM books
ORDER BY num DESC
LIMIT 3 OFFSET 0;

# 21、找出最早出版的一本书
SELECT * FROM books
ORDER BY pubdate ASC
LIMIT 1 OFFSET 0;

# 22、找出novel中价格最高的一本书
SELECT * FROM books
WHERE note = 'novel'
ORDER BY price DESC
LIMIT 1 OFFSET 0;

# 23、找出书名中字数最多的一本书，不含空格
SELECT * FROM books
ORDER BY CHAR_LENGTH(REPLACE(name,' ','')) DESC
LIMIT 1 OFFSET 0;
```

