import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GetAllPostsInput } from './dto/get-all-posts.input';
import { PostEntity } from '../post.entity';
// import { PostType } from 'src/post/post.type';
import { PostService } from './post.service';
// import {ISearchOptions} from './post.service'
import { GetPostByIdInput } from './dto/get-post-by-id.input';
import { CacheControl } from 'nestjs-gql-cache-control';
import { PostPaginationEntity } from '../post-pagination.entity';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';

@Resolver(() => PostEntity)
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @Query(() => PostPaginationEntity)
  @CacheControl({ maxAge: 30 })
  async posts(@Args('options') options: GetAllPostsInput) {
    console.log('options: ', options);
    const res = await this.postService.getAllPosts(options);
    return res;
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

  @Query((returns) => [PostEntity], { nullable: true })
  @CacheControl({ inheritMaxAge: true })
  getLatest() {
    return this.postService.getLatest();
  }

  @Query((returns) => PostEntity, { nullable: true })
  @CacheControl({ inheritMaxAge: true })
  getOnePost(@Args('input') input: GetPostByIdInput) {
    return this.postService.getOnePost(input);
  }

  @Mutation((returns) => PostEntity, { nullable: true })
  @CacheControl({ inheritMaxAge: true })
  createPost(@Args('input') input: CreatePostInput) {
    return this.postService.create(input);
  }

  @Mutation((returns) => PostEntity, { nullable: true })
  @CacheControl({ inheritMaxAge: true })
  updatePost(@Args('input') input: UpdatePostInput) {
    return this.postService.updatePost(input);
  }

  @Mutation((returns) => PostEntity, {
    nullable: true,
  })
  @CacheControl({
    inheritMaxAge: true,
  })
  removePost(@Args('id') id: string) {
    return this.postService.removePost(id);
  }
}
