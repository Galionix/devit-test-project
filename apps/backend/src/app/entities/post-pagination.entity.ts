import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { PostEntity } from './post.entity';

@ObjectType('posts_pagination')
@Entity('posts_pagination')
export class PostPaginationEntity {
  @Field((type) => [PostEntity])
  @Column()
  posts: PostEntity[];

  @Field((type) => Int)
  @Column()
  total: number;

  @Field((type) => Int)
  @Column()
  next: number;

  @Field((type) => Int)
  @Column()
  prev: number;
}
