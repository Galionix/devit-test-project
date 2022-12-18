/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Field, InputType } from '@nestjs/graphql';
import { ISearchOptions } from '@devit-test-project/library';

@InputType('get_all_posts_input')
export class GetAllPostsInput implements Partial<ISearchOptions> {
  @Field({
    description: 'The number of items to return',
    name: 'pageSize',
    nullable: true,
  })
  pageSize?: number;

  @Field({
    description: 'Page number',
    name: 'current',
    nullable: true,
  })
  current?: number;

  @Field({
    description: 'Sort direction',
    name: 'sortDirection',
    nullable: true,
  })
  sortDirection?: 'ASC' | 'DESC';

  @Field({
    description: 'Sort by',
    name: 'sortBy',
    nullable: true,
  })
  sortBy?: 'pubDate' | 'title' | 'description';

  @Field({
    description: 'Search by title',
    name: 'searchTitle',
    nullable: true,
  })
  searchTitle?: string;

  @Field({
    description: 'Search by author',
    name: 'searchAuthor',
    nullable: true,
  })
  searchAuthor?: string;
}
