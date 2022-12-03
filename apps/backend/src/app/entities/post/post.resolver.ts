/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Args, Query, Resolver } from '@nestjs/graphql';
import { GetAllPostsInput } from 'backend/src/app/entities/post/dto/get-all-posts.input';
import { PostEntity } from '../post.entity';
// import { PostEntity } from 'backend/src/app/entities/post.entity';
// import { PostType } from 'src/post/post.type';
import { PostService } from './post.service';
import {ISearchOptions} from './post.service'

@Resolver(() => PostEntity)
export class PostResolver {
  constructor(private readonly postService: PostService) {}

	@Query(() => [PostEntity])
	async posts(
		@Args('options') options: GetAllPostsInput
	) {
		const res = await this.postService.getAllPosts(options);
		console.log('res: ', res);
		return res[0]
	}
  // @Mutation(() => Post)
  // createPost(@Args('createPostInput') createPostInput: CreatePostInput) {
  //   return this.postService.create(createPostInput);
  // }

  // @Query(() => [Post], { name: 'posts' })
  // findAll() {
  //   return this.postService.findAll();
  // }

  // @Query(() => Post, { name: 'post' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.postService.findOne(id);
  // }

  // @Mutation(() => Post)
  // updatePost(@Args('updatePostInput') updatePostInput: UpdatePostInput) {
  //   return this.postService.update(updatePostInput.id, updatePostInput);
  // }

  // @Mutation(() => Post)
  // removePost(@Args('id', { type: () => Int }) id: number) {
  //   return this.postService.remove(id);
  // }

  @Query(
    returns => PostEntity
  )
  getLatest() {
    return this.postService.getLatest();
  }
}
