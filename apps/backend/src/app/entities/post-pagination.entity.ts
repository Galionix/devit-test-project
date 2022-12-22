import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { PostEntity } from './post.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

/*
export type Article = {
    title: string;
    link: string;
    pubDate: string;
    author: string;
    content: string;
    contentSnippet: string;
    id: string;
    isoDate: string;
}
*/
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
