import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreatePostInput } from './create-post.input';

@InputType()
export class UpdatePostInput extends PartialType(CreatePostInput) {
  @Field()
  id: string;

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
  isoDate: Date;
}
