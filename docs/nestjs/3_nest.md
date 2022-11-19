## add pagination 添加分页

创建一个新的dto

```
nest g class common/dto/pagination-query.dto --no-spec
```



pagination-query.dto：

```ts
import { IsOptional, IsPositive } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsPositive()
  limit: number;

  @IsOptional()
  @IsPositive()
  offset: number;
}
```



我们在main.ts中的管道中加上`transformOptions: {enableImplicitConversion: true,}`这能让我们传入的值始终为number

修改coffees.controller.ts：
```ts
@Get('')
findAll(@Query() paginationQuery: PaginationQueryDto): Promise<Coffee[]> {
  return this.coffeesService.findAll(paginationQuery);
}
```

修改coffes.service.ts：
```ts
//输出所有的coffee
findAll(paginationQuery: PaginationQueryDto) {
  const { limit, offset } = paginationQuery;
  return this.coffeeRepository.find({
    relations: ['flavors'],
    skip: offset,
    take: limit,
  });
}
```



演示：

```json
// localhost:3000/coffees?limit=1  这时只会打印一个
[
    {
        "id": 3,
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
                "id": 3,
                "name": "sweet"
            },
            {
                "id": 4,
                "name": "node"
            }
        ]
    }
]

//localhost:3000/coffees?offset=1  这时会打(印总的数量-1)个
[
    {
        "id": 4,
        "name": "#coffee #4",
        "brand": "Nest4",
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
                "id": 3,
                "name": "sweet"
            },
            {
                "id": 4,
                "name": "node"
            }
        ]
    },
    {
        "id": 5,
        "name": "#coffee #5",
        "brand": "Nest5",
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
                "id": 3,
                "name": "sweet"
            },
            {
                "id": 4,
                "name": "node"
            },
            {
                "id": 5,
                "name": "cando"
            }
        ]
    }
]
```



## nest与typeorm的transaction（事务）

### 事务的概念与作用

比如有两个表：账号表和信息表，而这两个表之间有关联。因此呢，我们在新增一个表的数据的时候就得给另外一个表也同时新增数据。然而这是两步操作(即第一步我要新增账号表数据，第一步在新增信息表数据)。假若其中有一个操作失败了呢？如账号新增成功，而信息失败了。如果不处理就会导致，这个账号没有信息的。因此事务就发生作用了。在一个事务中，必须要都成功才算是新增成功。否则都算失败。



### 应用事务

设想一下你有一个新的业务：为用户推荐喜欢口味的咖啡。

这时候，我们就需要使用transaction（事务）来进行。

创建一个文件

```
nest g class events/entities/event.entity --no-spec
```

event.entity.ts：

```ts
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column()
  name: string;

  @Column('json')
  payload: Record<string, any>;
}
```

在coffees.moudle.ts中导入

```ts
imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event])],
```



我们也需要在coffee.entity.ts中添加recommendation附加列：
```ts
@Column({ default: 0 })
recommendation: number;
```



在service文件中添加内容：

```ts
constructor(
	//...
    private readonly connection: DataSource,
  ) {}
//...
async recommendCoffe(coffee: Coffee) {
  const queryRunner = this.connection.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();
}
```

为了能够代码的健壮性，我们需要添加try catch

```ts
async recommendCoffe(coffee: Coffee) {
  const queryRunner = this.connection.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();
  try {
    coffee.recommendation++;

    const recommendEvent = new Event();
    recommendEvent.name = 'recommend_coffee';
    recommendEvent.type = 'coffee';
    recommendEvent.payload = { coffeeId: coffee.id };

    await queryRunner.manager.save(coffee);
    await queryRunner.manager.save(recommendEvent);

    await queryRunner.commitTransaction();
  } catch (err) {
    await queryRunner.rollbackTransaction();
  } finally {
    await queryRunner.release();
  }
}
```



### 使用索引

我们可以通过索引来快速访问 数据库 表中的特定信息

在entity文件中用@Index()装饰器来指定索引，在列上使用或者在类上使用，传入一个数组。

event.entity.ts

```ts
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index(['name', 'type'])
@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Index()
  @Column()
  name: string;

  @Column('json')
  payload: Record<string, any>;
}
```



## typeorm migration（迁移） - （待完善。。。）

创建一个ormconfig.js文件

```js
module.exports = {
  type: 'postgres',
  host: 'localhost',
  port: 54322,
  username: 'postgres',
  password: '123456',
  database: 'postgres',
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/migrations/*.js'],
  cli: {
    migrationsDir: 'src/migrations',
  }
}
```

生成一个迁移文件：

```
yarn typeorm migration:create ./src/migration/CoffeeRefactor
```

我们在coffee.entity.ts中将name改为title，**需要注意的是：由于开启了synchronize，所以如果不使用数据库迁移的话会将原有的name列的数据删除，而数据库迁移则保护了这些数据（相当于重命名列）。这就是数据库迁移的作用**。



1660471755457-CoffeeRefactor.ts（生成的迁移文件），修改up和down方法：

```ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CoffeeRefactor1660471755457 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "coffee" RENAME COLUMN "name" TO "title"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "coffee" RENAME COLUMN "title" TO "name"`,
    );
  }
}
```

我们还需要重新进行构建，确定TypeOrm cli能够在`/dist`找到迁移文件：

```
yarn run build
```

随后我们进行迁移：

```
```



## 控制nest模块的封装

创建一个新的文件夹和module，service文件：

```
nest g mo coffee-rating
nest g s coffee-rating 
```

coffee-rating.module.ts：

```ts
import { Module } from '@nestjs/common';
import { CoffeesModule } from 'src/coffees/coffees.module';
import { CoffeeRatingService } from './coffee-rating.service';

@Module({
  imports: [CoffeesModule],
  providers: [CoffeeRatingService],
})
export class CoffeeRatingModule {}
```

coffee-rating.service.ts：

```ts
import { Injectable } from '@nestjs/common';
import { CoffeesService } from 'src/coffees/coffees.service';

@Injectable()
export class CoffeeRatingService {
  constructor(private readonly coffeesService: CoffeesService) {}
}
```

但是现在运行会报错：Error: Nest can't resolve dependencies of the CoffeeRatingService (?). Please make sure that the argument CoffeesService at index [0] is available in the CoffeeRatingModule context.

我们需要在coffees.module.ts中将其设置为exports：

```ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from 'src/events/entities/event.entity';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { Coffee } from './entities/coffee.entities';
import { Flavor } from './entities/flavor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event])],
  controllers: [CoffeesController],
  providers: [CoffeesService],
  exports: [CoffeesService],
})
export class CoffeesModule {}
```

这样我们就可以在CoffeeRatingModule中的任何地方使用CoffeesService，简而言之，这就是封装



## provides

### value based provide

`provids:[CoffeesService]`其实是一种简写形式，相当于：

```ts
provids:[
	{
		provide: CoffeesService
		useClass: CoffeesService
	}
]
```

所以我们可以在provides中添加一些自定义类：

```ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from 'src/events/entities/event.entity';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { Coffee } from './entities/coffee.entities';
import { Flavor } from './entities/flavor.entity';

class MockCoffeeService {}

@Module({
  imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event])],
  controllers: [CoffeesController],
  providers: [{ provide: CoffeesService, useValue: new MockCoffeeService() }],
  exports: [CoffeesService],
})
export class CoffeesModule {}
```



### 使用Token与provides

我们使用一组useValue作为Token的提供：

coffees.module.ts：

```ts
providers: [
    CoffeesService,
    { provide: 'COFFEE_BRANDS', useValue: ['buddy brew', 'nescafe'] },
  ],
```

service中使用@Inject()装饰器注入：

```ts
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
    @InjectRepository(Flavor)
    private readonly flavorRepository: Repository<Flavor>,
    private readonly connection: DataSource,
    @Inject('COFFEE_BRANDS') coffeeBrands: string[],
  ) {}
```

为了避免以后重构文件出错，我们可以新建一个文件，然后使用export的变量，coffees.constants.ts：

```
export const COFFEE_BRANDS = 'COFFEE_BRANDS';
```

其他的文件也将字符串改为变量：

```ts
//...
{ provide: COFFEE_BRANDS, useValue: ['buddy brew', 'nescafe'] },
//...
@Inject(COFFEE_BRANDS) coffeeBrands: string[],
//...
```

我们也可以在constructor中写个测试：

```tsx
console.log(coffeeBrands);
```

可以看到启动的时候打印出Token：`[ 'buddy brew', 'nescafe' ]`



### 使用useClass进行provide

useClass支持动态创建provide

```ts
//...
class ConfigService {}
class DevelopmentConfigService {}
class ProductionConfigService {}
//...
{
      provide: ConfigService,
      useClass:
        process.env.NODE_ENV === 'development'
          ? DevelopmentConfigService
          : ProductionConfigService,
    },
//...
```



### useFactory

```ts
{ provide: COFFEE_BRANDS, useFactory: () => ['buddy brew', 'nescafe'] },
```

更好的实现：

```ts
//...
@Injectable()
export class CoffeeBrandsFactory {
  create() {
    // do something
    return ['buddy brew', 'nescafe'];
  }
}
//...
CoffeeBrandsFactory,
    {
      provide: COFFEE_BRANDS,
      useFactory: (brandsFactory: CoffeeBrandsFactory) =>
        brandsFactory.create(),
      inject: [CoffeeBrandsFactory],
    },
//...
```

异步：

```ts
    {
      provide: COFFEE_BRANDS,
      useFactory: async (connection: DataSource): Promise<string[]> => {
        // const coffeeBrands = await connection.query('SELECT * ...');
        const coffeeBrands = await Promise.resolve(['buddy brew', 'nescafe']);
        return coffeeBrands;
      },
      inject: [DataSource],
    },
```



## 动态模块

至此，我们使用的模块都是静态的，为了在使用模块的时候有更多的灵活性，我们使用动态的模块



## env文件

我们可能会在不同环境中使用nest，因此，我们需要使用`.env`文件。在nodejs中，env文件一般为应用程序配置的键值对。

添加config包

```
yarn add @nestjs/config
```

并且在app.moudle.ts中的imports中使用ConfigModule

```ts
imports: [//...
    ConfigModule.forRoot(),//...
]
```

这样它将能够从默认位置加载和解析我们的`.env`文件



.env：

```env
DATABASE_USER=postgres
DATABASE_PASSWORD=123456
DATABASE_NAME=postgres
DATABASE_PORT=54322
DATABASE_HOST=localhost
```

记得在gitignore中添上`*.env`



app.module.ts：

```ts
//...
TypeOrmModule.forRoot({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,//记得转一下，因为port需要传入number类型，而DATABASE_PORT为字符串
  username: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  autoLoadEntities: true,
  synchronize: true,
}),
//...
```



我们可以指定路径或者忽略env文件

```
//指定路径
ConfigModule.forRoot({
	envFilePath: '.environment'
})
// 忽略
ConfigModule.forRoot({
	ignoreEnvFile: true
})
```



## joi验证配置

```
yarn add @hapi/joi
npm i --save-dev @types/hapi__joi
```

app.module.ts

```ts
ConfigModule.forRoot({
      validationSchema: Joi.object({
        DATABASE_HOST: Joi.required(),
        DATABASE_PORT: Joi.number().default(54322),
      }),
    }),
```

这样env文件必须要有host和port才能运行项目

记得导入Joi包要这样导入

```ts
import * as Joi from '@hapi/joi';
```



## 异步添加配置

```
TypeOrmModule.forRootAsync({
	useFactory: ()=>({})
})
```

