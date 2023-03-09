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



对比TRUNCATE TABLE和DELETE FROM

- 相同点：都可以实现对表中所有数据的删除
- 不同点：
- - TRUNCATE TABLE：一旦执行，表数据全部删除。同时，数据不能回滚
  - DELETE FROM：一旦执行此操作，表数据可以全部清除（不带WHERE的情况下）。同时，数据可以实现回滚（也不可以）
