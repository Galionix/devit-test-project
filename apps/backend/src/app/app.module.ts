import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { FileProducerService } from 'src/producers/file.producer.service';
// import { FileConsumer } from 'src/consumers/file.consumer';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { PostEntity } from 'src/post/entities/post.entity';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { PostEntity } from './entities/post.entity';
import { PostModule } from './entities/post/post.module';
import { PostConsumer } from './queueConsumers/post.consumer';
import { PostProducerService } from './queueProducers/post.producer.service';

@Module({
	imports: [
		// BullModule.forRoot({
		// 	redis: {
		// 	  host: 'localhost',
		// 	  port: 6379,
		// 	},
		//   }),
		//   BullModule.registerQueue(
		// 	{
		// 	  name: 'posts-queue',
		// 	},
		//   ),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get('BULL_REDIS_HOST'),
          port: configService.get('BULL_REDIS_PORT'),
        //   password: configService.get('BULL_REDIS_PASSWORD'),
        },
      }),
    }),
    BullModule.registerQueue({
      name: 'posts-queue',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        // postgres because generic typeorm driver doesn't support Aurora Data API
        type: config.get<'postgres'>('TYPEORM_CONNECTION'),
        host: config.get<string>('API_HOST'),
        port: config.get<number>('TYPEORM_PORT'),
        username: config.get<string>('TYPEORM_USERNAME'),
        password: config.get<string>('TYPEORM_PASSWORD'),
        database: config.get<string>('TYPEORM_DATABASE'),
        entities: [PostEntity],
        synchronize: true,
        autoLoadEntities: true,
        logging: true,
      }),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
      playground: true,
    }),

    ScheduleModule.forRoot(),

    PostModule,
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: '.env'
    }),
  ],
  controllers: [AppController],
  providers: [
    // FileConsumer,
    // FileProducerService,
    AppService,
    PostProducerService,
    PostConsumer,
  ],
  // exports: [
  //   BullModule, // <— this is important!
  // ],
})
export class AppModule {}
