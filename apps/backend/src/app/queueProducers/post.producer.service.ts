import { ArticleType } from '@devit-test-project/library';
import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';

const logger = new Logger('PostProducerService');

@Injectable()
export class PostProducerService {
  constructor(
    // inject the queue
    @InjectQueue('posts-queue') private readonly postQueue: Queue
  ) {}

  async addPost(post: ArticleType) {
    logger.verbose('Adding post to queue');
    try {
      await this.postQueue.add('post-job', post);
    } catch (error) {
      logger.error(error);
    }
    logger.verbose('Done adding post to queue');
  }
}
