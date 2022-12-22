import { ArticleType } from '@devit-test-project/library';
import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { PostService } from '../entities/post/post.service';

const logger = new Logger('PostConsumerService');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Parser = require('rss-parser');

const getLatestDate = (articles: ArticleType[]) => {
  const articlesDates = articles.map((article) => new Date(article.isoDate));
  logger.log('articlesDates: ', articlesDates);

  const newestArticleDate = articlesDates.sort((a, b) => {
    return b.getTime() - a.getTime();
  })[0];
  logger.log('newestArticleDate: ', newestArticleDate);

  return newestArticleDate;
};

const getArticlesLaterThanDate = (articles: ArticleType[], date: Date) => {
  return articles.filter((article) => {
    return new Date(article.pubDate) > date;
  });
};

const processArticles = (
  postService: PostService,
  articles: ArticleType[],
  currentLatestDate: Date
) => {
  const latestArticles = getArticlesLaterThanDate(articles, currentLatestDate);

  if (latestArticles.length > 0) {
    latestArticles.forEach(async (article) => {
      const withPopulatedDates = {
        ...article,
        pubDate: new Date(article.pubDate),
        isoDate: new Date(article.isoDate),
      };
      const exists = await postService.getOnePost(withPopulatedDates)[0];
      logger.log('exists: ', exists);
      if (!exists) {
        logger.log('Creating new post: ', withPopulatedDates.title, '...');
        await postService.create(withPopulatedDates);
      }
    });
    logger.log(
      `
        NEW LATEST ARTICLES!!!!!!!!!!
        NEW LATEST ARTICLES!!!!!!!!!!
        NEW LATEST ARTICLES!!!!!!!!!!

        latestArticles.length`,
      latestArticles.length
    );
  }

  const newLatestDate =
    latestArticles.length > 0
      ? getLatestDate(latestArticles)
      : currentLatestDate;

  logger.warn('newLatestDate: ', newLatestDate);

  return {
    latestArticles,
    newLatestDate,
  };
};

export const parseRss = async (): Promise<ArticleType[]> => {
  const parser = new Parser();

  const feed = await parser.parseURL(
    'https://www.reddit.com/r/programming/.rss'
  );

  return feed.items as ArticleType[];
};

@Processor('posts-queue')
export class PostConsumer {
  newestDate = null;
  constructor(private readonly postService: PostService) {}

  @Process('post-job')
  async postJob(job: Job<unknown>) {
    try {
      logger.verbose('-----\\---post job started');
      // Initialize newestDate if it's null
      if (!this.newestDate) {
        const latestPost = await this.postService.getLatest();

        console.log('latestPost: ', latestPost);

        if (latestPost) this.newestDate = latestPost.pubDate;
      }
      logger.verbose('this.newestDate: ', this.newestDate);

      const articles = await parseRss();

      this.newestDate = processArticles(
        this.postService,
        articles,
        new Date(this.newestDate)
      ).newLatestDate;

      logger.verbose('----//----post job ended');
    } catch (error) {
      logger.error('error: ', error);
    }
  }
}
