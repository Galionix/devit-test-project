import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CacheControl } from 'nestjs-gql-cache-control';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { PostPaginationEntity } from '../post-pagination.entity';
import { PostEntity } from '../post.entity';
import { CreatePostInput } from './dto/create-post.input';
import { GetAllPostsInput } from './dto/get-all-posts.input';
import { GetPostByIdInput } from './dto/get-post-by-id.input';
import { UpdatePostInput } from './dto/update-post.input';
import { PostService } from './post.service';

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

  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => PostEntity, { nullable: true })
  @CacheControl({ inheritMaxAge: true })
  createPost(@Args('input') input: CreatePostInput) {
    return this.postService.create(input);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => PostEntity, { nullable: true })
  @CacheControl({ inheritMaxAge: true })
  updatePost(@Args('input') input: UpdatePostInput) {
    return this.postService.updatePost(input);
  }

  @UseGuards(JwtAuthGuard)
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
