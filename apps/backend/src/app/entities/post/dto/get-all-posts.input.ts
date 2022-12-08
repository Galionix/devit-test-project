/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Field, InputType } from '@nestjs/graphql';

@InputType('get_all_posts_input')
export class GetAllPostsInput {
	@Field({
		description: 'The number of items to return',
		name: 'limit',
		nullable: true,
	})
	limit?: number;

	@Field({
		description: 'The number of items to skip before starting to collect the result set',
		name: 'offset',
		nullable: true,
	})
	offset?: number;

	@Field({
		description: 'Sort direction',
		name: 'sortDirection',
		nullable: true,
	})
	order?: 'ASC' | 'DESC';

	@Field({
		description: 'Sort by',
		name: 'sortBy',
		nullable: true,
	})
	sortBy?: 'pubDate' | 'title' | 'description';

	@Field({
		description: 'Search text',
		name: 'searchText',
		nullable: true,
	})
	searchText?: string


}