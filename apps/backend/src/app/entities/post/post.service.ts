import { ISearchOptions } from '@devit-test-project/library';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostPaginationEntity } from '../post-pagination.entity';
import { PostEntity } from '../post.entity';
import { CreatePostInput } from './dto/create-post.input';
import { GetAllPostsInput } from './dto/get-all-posts.input';
import { GetPostByIdInput } from './dto/get-post-by-id.input';
import { UpdatePostInput } from './dto/update-post.input';

const defaultSearchOptions: ISearchOptions = {
  pageSize: 25,
  current: 1,
  sortBy: 'pubDate',
  sortDirection: 'DESC',
  searchTitle: '',
  searchAuthor: '',
};

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>
  ) {}
  async create(createPostInput: CreatePostInput) {
    const exists = await this.postRepository.findOne({
      where: {
        id: createPostInput.id,
      },
    });
    if (exists) {
      throw new Error('Post already exists');
    }
    return await this.postRepository.save({ ...createPostInput });
  }

  async getLatest(): Promise<PostEntity> {
    const res = await this.postRepository.query(
      'SELECT * FROM "posts" ORDER BY "pubDate" desc LIMIT 1'
    );

    return res[0];
  }

  async getOnePost(input: GetPostByIdInput): Promise<PostEntity> {
    const { id } = input;
    const res = await this.postRepository.findOne({
      where: { id },
    });
    return res;
  }

  async getAllPosts(options: GetAllPostsInput): Promise<PostPaginationEntity> {
    const resolvedOptions: ISearchOptions = {
      ...defaultSearchOptions,
      ...options,
    };
    const {
      current,
      pageSize,
      sortBy,
      sortDirection,
      searchTitle,
      searchAuthor,
    } = resolvedOptions;
    const query = this.postRepository.createQueryBuilder('posts');
    if (searchTitle) {
      //   search can be done by title and author
      query.andWhere('(posts.title ILIKE :search)', {
        search: `%${searchTitle}%`,
      });
    }
    if (searchAuthor) {
      //   search can be done by title and author
      query.andWhere('(posts.author ILIKE :search)', {
        search: `%${searchAuthor}%`,
      });
    }
    const total = await query.getCount();
    if (sortBy) {
      query.addOrderBy(`posts.${sortBy}`, sortDirection);
    }
    const pageSizeResolved = pageSize > 100 ? 100 : pageSize;
    const offset = (current - 1) * pageSizeResolved;

    query.skip(offset).take(pageSizeResolved);

    const res = await query.getManyAndCount();

    const preNext = total - pageSizeResolved * current;
    const next = preNext > 0 ? preNext : 0;
    const prev = (current - 1) * pageSizeResolved;

    return {
      posts: res[0],
      total,
      next,
      prev,
    };
  }

  async removePost(id: string) {
    await this.postRepository.delete({ id });

    return { id };
  }

  async updatePost(updatePostInput: UpdatePostInput) {
    const updated = await this.postRepository.update(
      { id: updatePostInput.id },
      { ...updatePostInput }
    );
    return updated.affected > 0 ? { ...updatePostInput } : null;
  }
}
