import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloServerPluginCacheControl } from 'apollo-server-core/dist/plugin/cacheControl';
import responseCachePlugin from 'apollo-server-plugin-response-cache';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PostEntity } from './entities/post.entity';
import { PostModule } from './entities/post/post.module';
import { PostConsumer } from './queueConsumers/post.consumer';
import { PostProducerService } from './queueProducers/post.producer.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get('BULL_REDIS_HOST'),
          port: configService.get('BULL_REDIS_PORT'),
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
        // dropSchema: true,
        autoLoadEntities: true,
        // logging: true,
      }),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      plugins: [
        ApolloServerPluginCacheControl({ defaultMaxAge: 5 }), // optional
        responseCachePlugin(),
      ],
    }),

    ScheduleModule.forRoot(),

    PostModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, PostProducerService, PostConsumer],
})
export class AppModule {}
