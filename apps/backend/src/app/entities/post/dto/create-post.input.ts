import { Field, InputType } from '@nestjs/graphql';
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
@InputType('create_post_input')
export class CreatePostInput {
  // @Field()
  // order: number;

  @Field()
  title: string;

  @Field()
  link: string;

  @Field()
  pubDate: Date;

  @Field()
  author: string;

  @Field()
  content: string;

  @Field()
  contentSnippet: string;

  @Field()
  id: string;

  @Field()
  isoDate: Date;
}
