/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Field, InputType } from '@nestjs/graphql';

@InputType('get_post_by_id_input')
export class GetPostByIdInput {
	@Field({
		description: 'ID of the post',
		name: 'id',
		nullable: true,
	})
	id: string;

}