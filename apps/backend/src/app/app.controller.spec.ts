import { Test, TestingModule } from '@nestjs/testing';
import { PostProducerService } from 'backend/src/app/queueProducers/post.producer.service';
import { Article } from 'backend/src/assets/article.type';

import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, PostProducerService],
    }).compile();
  });

	describe('getData', () => {
		it('should return the same article that was sent', () => {
			const appController = app.get<AppController>(AppController);
			const article: Article = {
				    title: 'My first script in a while, a Powershell MSI extractor!',
				    link: 'https://www.reddit.com/r/programming/comments/yzk53r/my_first_script_in_a_while_a_powershell_msi/',
				    pubDate: '2022-11-19T19:37:44.000Z',
				    author: '/u/jamesfarted09',
				    content: '&#32; submitted by &#32; <a href="https://www.reddit.com/user/jamesfarted09"> /u/jamesfarted09 </a> <br/> <span><a href="https://github.com/JamesIsWack/Simple-MSI-Extractor">[link]</a></span> &#32; <span><a href="https://www.reddit.com/r/programming/comments/yzk53r/my_first_script_in_a_while_a_powershell_msi/">[comments]</a></span>',
				    contentSnippet: 'submitted by    /u/jamesfarted09  \n [link]   [comments]',
				    id: 't3_yzk53r',
				    isoDate: '2022-11-19T19:37:44.000Z'
			}
			expect(appController.addPost(article)).toEqual(article);
		});
    // it('should return "Welcome to backend!"', () => {
    //   const appController = app.get<AppController>(AppController);
    //   expect(appController.addPost()).toEqual({
    //     message: 'Welcome to backend!',
    //   });
    // });
  });
});
