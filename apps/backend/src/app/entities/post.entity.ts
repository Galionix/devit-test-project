import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
	Column,
	CreateDateColumn,
	Entity, PrimaryGeneratedColumn
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
@ObjectType('posts')
@Entity('posts')
export class PostEntity {

  @Field(() => ID)
  @PrimaryGeneratedColumn()
  order: number;

  @Field()
  @Column()
  id: string;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column()
  link: string;

  @Field()
  @CreateDateColumn()
  pubDate: Date;

  @Field()
  @Column()
  author: string;

  @Field()
  @Column()
  content: string;

  @Field()
  @Column()
  contentSnippet: string;

  @Field()
  @Column()
  isoDate: Date;
}
