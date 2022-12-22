import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreatePostInput } from './create-post.input';

@InputType()
export class UpdatePostInput extends PartialType(CreatePostInput) {
  @Field()
  id: string;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  link?: string;

  @Field({ nullable: true })
  pubDate?: Date;

  @Field({ nullable: true })
  author?: string;

  @Field({ nullable: true })
  content?: string;

  @Field({ nullable: true })
  contentSnippet?: string;

  @Field({ nullable: true })
  isoDate?: Date;
}
