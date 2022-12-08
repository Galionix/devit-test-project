import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PostService } from './entities/post/post.service';
import { PostProducerService } from './queueProducers/post.producer.service';


const logger = new Logger('AppService');

@Injectable()
export class AppService {
  constructor(
    private readonly postProducerService: PostProducerService,
    private readonly postService: PostService,
  ) { }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async getHello() {
	logger.verbose('Fetching posts...')
	  await this.postProducerService.addPost(null);
    logger.verbose('Done fetching posts');
  }
}
