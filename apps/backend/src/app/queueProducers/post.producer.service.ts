import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { ArticleType } from '@devit-test-project/library';

@Injectable()
export class PostProducerService{
    constructor(
        // inject the queue
        @InjectQueue('posts-queue') private readonly postQueue: Queue,
    ) { }

    async addPost(post: ArticleType) {
        await this.postQueue.add('post-job', post,
        );
    }
}