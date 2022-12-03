import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Article } from 'backend/src/assets/article.type';
import { Queue } from 'bull';

@Injectable()
export class PostProducerService{
    constructor(
        // inject the queue
        @InjectQueue('posts-queue') private readonly postQueue: Queue,
    ) { }

    async addPost(post: Article) {
        await this.postQueue.add('post-job', post,
        );
    }
}