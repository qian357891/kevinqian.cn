## docker-compose.yml文件配置

`-`和值之间应该有一个空格，并且值应该是一个字符串。

```yml
version: '3'

services:
  db:
    image: postgres
    restart: always
    ports:
      - "54322:54322"
    environment:
      POSTGRES_PASSWORD: 123456
```



## 通过typeorm使用postgresql

### 安装相关依赖

```
yarn add @nestjs/typeorm typeorm pg
```



### 在app.moudle.ts中使用

我们需要在app.moudle.ts中使用，通过TypeOrmModule.forRoot()函数来配置关联数据库

```ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesModule } from './coffees/coffees.module';

@Module({
  imports: [
    CoffeesModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 54322,
      username: 'postgres',
      password: '123456',
      database: 'postgres',
      autoLoadEntities: true,
      synchronize: true, //在开发时建议打开，但在生产环境要关闭
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

在生产环境下记得关掉synchronize。应该将其设置为flase。



启动服务器，我们可以看到typeorm成功连接了docker中的postgresql数据库

![image-20220813172516904](C:\Users\Kevin\AppData\Roaming\Typora\typora-user-images\image-20220813172516904.png)



### entity

entity（实体）表示typescript类与数据库之间的关系。

在nestjs中，我们的entity是使用@Entity()装饰器来装饰的类。

coffee.entity.ts：

```ts
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity() //一个为coffee的表（全为小写），也可以在装饰器中写表名，如："nestcoffee"
export class Coffee {
  @PrimaryGeneratedColumn() //设置为主键，并且为自增
  id: number;

  @Column() //普通的一列就直接用Column装饰器
  name: string;

  @Column()
  brand: string;

  @Column('json', { nullable: true })
  flavors: string[];
}
```

并且在coffees.module.ts中导入这个entity

注册entity实体时，我们应该使用forFeature()方法：

```ts
//...
imports: [TypeOrmModule.forFeature([Coffee])]
//...
```

这样，我们就能够在Navicat中看到这个表了：

![image-20220813182105531](C:\Users\Kevin\AppData\Roaming\Typora\typora-user-images\image-20220813182105531.png)



### 使用TypeOrm进行CRUD

- `repository.find()`函数查找表中的所有数据

- `repository.findOne()`函数等价于`Select * ... limit 1`。这意味着`findOne`实际上需要一个包含条件的对象来匹配并返回满足条件的第一个元素。如`this.coffeeRepository.findOne({where: { id: +*id* } })`
- `repository.save()`函数保存一组数据
- `repository.remove()`函数删除传入的整行数据





### 修改代码

我们在service文件中使用entity，而不是原来的“假数据库”，通过@InjectRepository()装饰器来进行，参数为entity类

```ts
//...
constructor(
  @InjectRepository(Coffee)
  private readonly coffeeRepository: Repository<Coffee>,
) {}
//...
```



我们同时也要修改方法的代码：

coffees.service.ts

```ts
import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entities';

@Injectable()
export class CoffeesService {
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
  ) {}

  //输出所有的coffee
  findAll() {
    return this.coffeeRepository.find();
  }

  //输出指定id的coffee
  async findOne(id: string) {
    const coffee = await this.coffeeRepository.findOne({
      where: { id: +id },
    });
    if (!coffee) {
      throw new NotFoundException(`can't find #${id}#`);
    }
    return coffee;
  }

  //添加新的coffee
  create(createCoffeeDto: CreateCoffeeDto) {
    const coffee = this.coffeeRepository.create(createCoffeeDto);
    return this.coffeeRepository.save(coffee);
  }

  // 更新指定id的coffee
  async update(id: string, updateCoffeeDto: UpdateCoffeeDto) {
    const coffee = await this.coffeeRepository.preload({
      id: +id,
      ...updateCoffeeDto,
    });
    if (!coffee) {
      throw new NotFoundException(`Coffee #${id}# not found`);
    }
    return this.coffeeRepository.save(coffee);
  }

  //删除指定id的coffee
  async remove(id: string) {
    const coffee = await this.findOne(id);
    return this.coffeeRepository.remove(coffee);
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
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entities';

@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeesService: CoffeesService) {}

  @Get('')
  getCoffee(): Promise<Coffee[]> {
    return this.coffeesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coffeesService.findOne(id);
  }

  @Post('add')
  create(@Body() createCoffeeDto: CreateCoffeeDto) {
    console.log(createCoffeeDto instanceof CreateCoffeeDto);
    return this.coffeesService.create(createCoffeeDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCoffeeDto: UpdateCoffeeDto) {
    return this.coffeesService.update(id, updateCoffeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coffeesService.remove(id);
  }
}
```



## 建立多对多关系

使用@JoinTable()装饰器和@ManyToMany()装饰器

coffee.entity.ts：

```ts
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Flavor } from './flavor.entity';

@Entity() //一个为coffee的表（全为小写），也可以在装饰器中写表名，如："nestcoffee"
export class Coffee {
  @PrimaryGeneratedColumn() //设置为主键，并且为自增
  id: number;

  @Column() //普通的一列就直接用Column装饰器
  name: string;

  @Column()
  brand: string;

  @JoinTable()
  @ManyToMany((type) => Flavor, (flavor) => flavor.coffees)
  flavors: string[];
}
```

flavor.entity.ts：

```ts
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Coffee } from './coffee.entities';

@Entity()
export class Flavor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany((type) => Coffee, (coffee) => coffee.flavors)
  coffees: Coffee[];
}
```



但是这样进行查询时，不会出现flavors了，我们需要使用`relations: [],`属性

```ts
//输出所有的coffee
findAll() {
  return this.coffeeRepository.find({
    relations: ['flavors'],
  });
}

//输出指定id的coffee
async findOne(id: string) {
  const coffee = await this.coffeeRepository.findOne({
    where: { id: +id },
    relations: ['flavors'],
  });
  if (!coffee) {
    throw new NotFoundException(`can't find #${id}#`);
  }
  return coffee;
}
```



## 级联插入

在coffee.entity.ts中的@ManyToMany()装饰器中设置开启级联选项：`{cascade: true,}`

```ts
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Flavor } from './flavor.entity';

@Entity() //一个为coffee的表（全为小写），也可以在装饰器中写表名，如："nestcoffee"
export class Coffee {
  @PrimaryGeneratedColumn() //设置为主键，并且为自增
  id: number;

  @Column() //普通的一列就直接用Column装饰器
  name: string;

  @Column()
  brand: string;

  @JoinTable()
  @ManyToMany((type) => Flavor, (flavor) => flavor.coffees, {
    cascade: true,
  })
  flavors: Flavor[];
}
```



同时，我们也要改变service文件中的代码，coffees.service.ts：

```ts
import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entities';
import { Flavor } from './entities/flavor.entity';

@Injectable()
export class CoffeesService {
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
    @InjectRepository(Flavor)
    private readonly flavorRepository: Repository<Flavor>,
  ) {}

  //输出所有的coffee
  findAll() {
    return this.coffeeRepository.find({
      relations: ['flavors'],
    });
  }

  //输出指定id的coffee
  async findOne(id: string) {
    const coffee = await this.coffeeRepository.findOne({
      where: { id: +id },
      relations: ['flavors'],
    });
    if (!coffee) {
      throw new NotFoundException(`can't find #${id}#`);
    }
    return coffee;
  }

  //添加新的coffee
  async create(createCoffeeDto: CreateCoffeeDto) {
    const flavors = await Promise.all(
      createCoffeeDto.flavors.map((name) => this.preloadFlavorByName(name)),
    );
    const coffee = this.coffeeRepository.create({
      ...createCoffeeDto,
      flavors,
    });
    return this.coffeeRepository.save(coffee);
  }

  // 更新指定id的coffee
  async update(id: string, updateCoffeeDto: UpdateCoffeeDto) {
    const flavors =
      updateCoffeeDto.flavors &&
      (await Promise.all(
        updateCoffeeDto.flavors.map((name) => this.preloadFlavorByName(name)),
      ));

    const coffee = await this.coffeeRepository.preload({
      id: +id,
      ...updateCoffeeDto,
      flavors,
    });
    if (!coffee) {
      throw new NotFoundException(`Coffee #${id}# not found`);
    }
    return this.coffeeRepository.save(coffee);
  }

  //删除指定id的coffee
  async remove(id: string) {
    const coffee = await this.findOne(id);
    return this.coffeeRepository.remove(coffee);
  }

  private async preloadFlavorByName(name: string): Promise<Flavor> {
    const existingFlavor = await this.flavorRepository.findOne({
      where: { name },
    });
    if (existingFlavor) {
      return existingFlavor;
    }
    return this.flavorRepository.create({ name });
  }
}
```



演示：

```json
//输入    //localhost:3000/coffees/add
{
    "name": "#coffee #3",
    "brand": "Nest",
    "flavors": ["demo","nice","sweet"]
}

//输出
{
    "name": "#coffee #3",
    "brand": "Nest",
    "flavors": [
        {
            "id": 1,
            "name": "demo"
        },
        {
            "id": 2,
            "name": "nice"
        },
        {
            "name": "sweet",
            "id": 3
        }
    ],
    "id": 3
}
```

