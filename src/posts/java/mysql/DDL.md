### 创建表的两种方式

#### 根据字段和数据类型创建

```mysql
CREATE TABLE employees_1(
	id INT,
	the_name CHAR,
	jobs CHAR,
	age INT
);
```

#### 根据现有表进行创建

导入数据

```mysql
CREATE TABLE employees_copy
AS
SELECT *
FROM employees;
```

不导入数据

```mysql
CREATE TABLE employees_blank
AS
SELECT *
FROM employees
WHERE FALSE;
```

