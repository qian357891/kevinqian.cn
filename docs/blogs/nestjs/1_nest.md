## 文件作用

在service文件中写函数，在controller文件中调用。最后放在module文件中



## controller文件

使用nest cil创建一个文件夹，里面有controller文件

```
nest generate controller
//或者简写
nest g co
```



@Controller() class装饰器工厂：参数为string或者string[]，传入url地址



### url地址中id的传递

在@Get() 方法装饰器工厂中传入`:id`

在函数中的参数中使用@Param() 参数装饰器工厂，传入`id` **这里的标识符要与@Get()装饰器的参数一致**

```ts
import { Controller, Get, Param } from '@nestjs/common';

@Controller('coffees')
export class CoffeesController {
  @Get(':id')
  findOne(@Param('id') id: string) {
    return `this is the #${id} yeah`;
  }
}

//localhost:3000/coffees/dd
//this is the #dd yeah
```



### 使用Post

使用@Post() 装饰器 参数使用@Body() 装饰器

```ts
@Post('nice')
findTwo(@Body() body) {
  return body;
}
```

在postman中传入这个json，也能得到整个传入的json

```json
{
    "name":"kevin",
    "age":20
}
```

如果只想接收一部分，可以向@Body()中传入key

```ts
@Post('nice')
findTwo(@Body('name') body: any) {
  return body;
}

//kevin
```



## 自定义状态码

我们使用get访问成功时，nest默认的状态码是200，post是201

我们也可以使用HttpCode() 方法装饰器来进行状态码的自定义

```ts
@Post('nice')
@HttpCode(HttpStatus.GONE)
findTwo(@Body() body: any) {
  return body;
}
```





由于nest是基于express的，所以我们也可以使用express的原生方法（不过不推荐这样使用）

```ts
@Get('yes')
getCoffee(@Res() response: any): void {
  response.status(303).send(`this is coffee`);
}
```





## Patch和Delete

使用@Parch()装饰器更新  @Delete()装饰器删除

```ts
@Patch(':id')
update(@Param('id') id: string | number, @Body('name') body: string): string {
  return `this action is update #${id} coffee #${body}`;
  // this action is update #lll coffee #kevin
}

@Delete(':id')
remove(@Param('id') id: string | number): string {
  return `this action is remove #${id} coffee`; //this action is remove #lll coffee
}
```



## Query参数

我们可以在方法中使用@Query() 参数装饰器来取到传入的query参数

```ts
@Get('yes')
getCoffee(@Query() paramQuery: any): string {
  const { limit, offset } = paramQuery;
  return `coffee's limit is #${limit}#, offset is #${offset}#`;
  //localhost:3000/coffees/yes?limit=20&offset=20
  //coffee's limit is #20#, offset is #20#
}
```



## service文件

service文件是用来写函数的文件，也是nest的核心文件。将函数与controller分开更有利于项目的实现

我们可以使用nest cli来创建

```
nest generate service
//或者简写
nest g s
```



下面是使用例子：

coffee.entities

```ts
export class Coffee {
  id: string;
  name: string;
  brand: string;
  flavors: string[];
}
```



coffees.service.ts

```ts
import { Injectable } from '@nestjs/common';
import { Coffee } from './entities/coffee.entities';

@Injectable()
export class CoffeesService {
  private coffees: Coffee[] = [
    {
      id: '1',
      name: 'nest demo',
      brand: 'nest coffee',
      flavors: ['sweet', 'vanlilla'],
    },
  ];
  //输出所有的coffee
  findAll() {
    return this.coffees;
  }
  //输出指定id的coffee
  findOne(id: string) {
    return this.coffees.find((item) => item.id === id);
  }
  //添加新的coffee
  create(createDto: Coffee) {
    this.coffees.push(createDto);
  }
  update(id: string, updateDto: any) {}
  //删除指定id的coffee
  remove(id: string) {
    const coffeeIndex = this.coffees.findIndex((item) => item.id === id);
    if (coffeeIndex >= 0) {
      this.coffees.splice(coffeeIndex, 1);
    }
  }
}
```



coffees.controller.ts

```ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { Coffee } from './entities/coffee.entities';

@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeesService: CoffeesService) {}
  @Get('')
  getCoffee(): Coffee[] {
    return this.coffeesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coffeesService.findOne(id);
  }

  @Post('nice')
  create(@Body() body: any) {
    return this.coffeesService.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.coffeesService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coffeesService.remove(id);
  }
}
```



## 返回错误信息

在上例中，我们如果查找的id不存在，那么将没有返回值，所以我们需要优化一下。

使用**HTTPException**类，他有两个参数，第一个是错误信息，第二个是状态码。

```ts
//输出指定id的coffee
findOne(id: string): Coffee {
  const coffee = this.coffees.find((item) => item.id === id);
  if (!coffee) {
    throw new HttpException(`can't find #${id}#`, HttpStatus.NOT_FOUND);
  }
  return coffee;
}
```

我们也可以直接使用**NotFoundException**，他只有一个参数：错误信息，但是他的输出还会多一个`error:Not Found`

```ts
//输出指定id的coffee
findOne(id: string): Coffee {
  const coffee = this.coffees.find((item) => item.id === id);
  if (!coffee) {
    throw new NotFoundException(`can't find #${id}#`);
  }
  return coffee;
}
```



如果我们在前面抛出了错误，那么在访问的时候可以看到状态码500，nest服务器会报错。这对于我们程序中比较深的错误或者使用第三方库的时候有用。

```ts
//输出指定id的coffee
findOne(id: string): Coffee {
  throw `sss`;
  const coffee = this.coffees.find((item) => item.id === id);
  if (!coffee) {
    throw new NotFoundException(`can't find #${id}#`);
  }
  return coffee;
}
```





## module文件

module文件作为一个功能模块，controller文件和service文件将会被放在里面。这样将会方便项目代码的管理

```
nest g module
//或者简写
nest g mo
```

**module文件使用了@Module()装饰器，里面有四个可选参数（类型都为数组），其中：**

- **imports：module文件**
- **controllers：controller文件**
- **providers：service文件**
- **exports：导出其他模块需要共享的Providers**



coffees.module.ts文件

```ts
import { Module } from '@nestjs/common';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';

@Module({ controllers: [CoffeesController], providers: [CoffeesService] })
export class CoffeesModule {}
```



注意：由于上例的module后创建，所以要将App.module中的 coffees.controller和coffees.providers删除掉。不然将会执行两次实例。



## DTO

DTO文件中没有任何逻辑，只是为了更好的约束值的传递。使用DTO可以让类型更加的安全

创建一个dto文件

```
nest g class coffees/dto/create-coffee.dto --no-spec
```



create-coffee.dto

```ts
export class CreateCoffeeDto {
  readonly id: string;
  readonly name: string;
  readonly brand: string;
  readonly flavors: string[];
}
```

update-coffee.dto

```ts
export class UpdateCoffeeDto {
  readonly name?: string;
  readonly brand?: string;
  readonly flavors?: string[];
}
```

controller文件

```ts
@Post('nice')
create(@Body() createCoffeeDto: CreateCoffeeDto) {
  return this.coffeesService.create(createCoffeeDto);
}

@Patch(':id')
update(@Param('id') id: string, @Body() updateCoffeeDto: UpdateCoffeeDto) {
  return this.coffeesService.update(id, updateCoffeeDto);
}
```



## Pipes 管道 与 DTO

在main.ts中启用管道

```
app.useGlobalPipes(new ValidationPipe());
```

下载两个包

```
yarn add class-validator class-transformer
```

其中：class-validator可以让你使用DTO时，如果传值类型错误，会给你提供详细的错误信息

在create-coffee.dto.ts中使用：

```ts
import { IsString } from 'class-validator';

export class CreateCoffeeDto {
  @IsString()
  readonly id: string;

  @IsString()
  readonly name: string;

  @IsString()
  readonly brand: string;

  @IsString({ each: true })
  readonly flavors: string[];
}
```



在postman中测试：

```json
// 输入
{
    "name": "year",
    "brand": "nest-ts"
}
//输出
{
    "statusCode": 400,
    "message": [
        "id must be a string",
        "each value in flavors must be a string"
    ],
    "error": "Bad Request"
}
```

这样，我们得到了详细的错误提示：id必须是string类型，flavor必须是string[]类型

我们重新修改过后：

```json
// 成功录入
{
    "id": "2",
    "name": "nest",
    "brand": "coffee",
    "flavors": [
        "nice",
        "vanlilla"
    ]
}
```





为了不在update-coffee.dto.ts中也写同样的代码。nestjs给我们提供了一个包：mapped-types

```
yarn add @nestjs/mapped-types
```



我们让类继承PartialTyp()，参数为想要继承属性的class。继承的属性全部都为可选，类型也都是相同的。

update-coffee.dto.ts：

```ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateCoffeeDto } from './create-coffee.dto';

export class UpdateCoffeeDto extends PartialType(CreateCoffeeDto) {}
```



coffees.service.ts：

```ts
// 更新指定id的coffee
update(id: string, updateDto: UpdateCoffeeDto) {
  let existingCoffee = this.findOne(id);
  const coffeeIndex = this.coffees.findIndex((item) => item.id === id);
  if (!existingCoffee) {
    throw new HttpException(`#${id}# is not found`, 401);
  }
  Object.assign(this.coffees[coffeeIndex], updateDto);
}
```

测试：

```json
// 输入
{
    "name": 132,
    "brand": "coffee"
}
// 输出
{
    "statusCode": 400,
    "message": [
        "name must be a string"
    ],
    "error": "Bad Request"
}
```



当我们将name的值设为string类型时（如`"name" : "ddwb"`），就不会报错了。然后再查询：

```json
{
    "id": "1",
    "name": "ddwb",
    "brand": "coffee",
    "flavors": [
        "sweet",
        "vanlilla"
    ]
}
```





## ValidationPipe的更多用法

### whitelist白名单

在使用creat方法创建对象时，如果输入了没有声明的属性并不会报错，而且录入进数据库。

我们并不想这样，所以我们可以使用ValidationPipe的whitelist，配合DTO来过滤掉没有声明的属性

main.ts：

```ts
app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
);
```



```json
// 使用前
{
    "id": "2",
    "name": "year",
    "brand": "nest-ts",
    "flavors": [
        "nice"
    ],
    "isNotPromission": "bbc"
}
// 使用后
{
    "id": "2",
    "name": "year",
    "brand": "nest-ts",
    "flavors": [
        "nice"
    ]
}
```



### forbidNonWhitelisted属性

我们还可以使用`forbidNonWhitelisted`属性

main.ts

```ts
app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
);
```

这样我们会得到错误提示：

```json
{
    "statusCode": 400,
    "message": [
        "property isNotPromission should not exist"
    ],
    "error": "Bad Request"
}
```



### transform

我们尝试检测CreateCoffeeDto类是否在createCoffeeDto原型链上

coffees.controller.ts：

```ts
@Post('nice')
create(@Body() createCoffeeDto: CreateCoffeeDto) {
  console.log(createCoffeeDto instanceof CreateCoffeeDto);//false
  return this.coffeesService.create(createCoffeeDto);
}
```

但意外的打印false

我们可以使用ValidationPope的transform属性

```ts
transform: true,
```

现在得到的`createCoffeeDto instanceof CreateCoffeeDto`为`true`

