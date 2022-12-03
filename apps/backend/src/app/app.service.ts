import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PostService } from 'backend/src/app/entities/post/post.service';
import { PostProducerService } from 'backend/src/app/queueProducers/post.producer.service';


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
    this.postProducerService.addPost(null)
  }
}
