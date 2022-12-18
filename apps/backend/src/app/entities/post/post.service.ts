import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from '../post.entity';
import { Repository } from 'typeorm';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { Article } from '../../../types/article.type';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { GetAllPostsInput } from './dto/get-all-posts.input';
import { GetPostByIdInput } from './dto/get-post-by-id.input';
import { ISearchOptions } from '@devit-test-project/library';

// export interface ISearchOptions{
// 	limit: number
// 	offset: number

// 	sortBy: keyof Article;

// 	sortDirection: 'ASC' | 'DESC'

// 	searchText: string
// }

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
    // const post = this.postRepository.create(createPostInput);
    return await this.postRepository.save({ ...createPostInput });
  }

  // create(createPostInput: CreatePostInput) {
  //   return 'This action adds a new post';
  // }

  // findAll() {
  //   return `This action returns all post`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} post`;
  // }

  // update(id: number, updatePostInput: UpdatePostInput) {
  //   return `This action updates a #${id} post`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} post`;
  // }

  async getLatest(): Promise<PostEntity> {
    return await this.postRepository
      // .query('SELECT * FROM posts ORDER BY posts.pubDate DESC LIMIT 1')
      .query('SELECT * FROM "posts" ORDER BY "pubDate" desc LIMIT 1');

    // .select()
    // .se
    //   .findOne({
    //     where: { },
    //     order: {
    //       pubDate: 'DESC',
    //     },
    // })
  }

  async getOnePost(input: GetPostByIdInput): Promise<PostEntity> {
    const { id } = input;
    return await this.postRepository.findOne({
      where: { id },
    });
  }

  async getAllPosts(options: GetAllPostsInput): Promise<PostEntity[]> {
    const resolvedOptions: ISearchOptions = {
      ...defaultSearchOptions,
      ...options,
    };
    console.log('resolvedOptions: ', resolvedOptions);
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
    if (sortBy) {
      query.addOrderBy(`posts.${sortBy}`, sortDirection);
    }
    const pageSizeResolved = pageSize > 100 ? 100 : pageSize;
    const offset = (current - 1) * pageSizeResolved;
    query.skip(offset).take(pageSizeResolved);

	  const res = await query.getManyAndCount();
	  console.log('res: ', res);
    return res as any;

    // return await this.postRepository.find();
  }

  async removePost(id: string) {
    await this.postRepository.delete({ id });
    return id;
  }

  async updatePost(id: string, updatePostInput: UpdatePostInput) {
    const updated = await this.postRepository.update(
      { id },
      { ...updatePostInput }
    );
    return updated.affected > 0 ? { id, ...updatePostInput } : null;
  }
}
