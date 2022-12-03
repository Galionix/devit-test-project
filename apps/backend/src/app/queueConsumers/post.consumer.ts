
// import Parser from 'rss-parser';
import { Process, Processor } from '@nestjs/bull';
import { PostService } from 'backend/src/app/entities/post/post.service';
import { Article } from 'backend/src/assets/article.type';
import { Job } from 'bull';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Parser = require('rss-parser');

// interface IPopulatedArticle extends Omit<Article,"isoDate"|"pubDate">{
//   isoDate: Date;
//   pubDate: Date;
// }

const getLatestDate = (articles: Article[]) => {
const articlesDates = articles
.map((article) => new Date(article.isoDate))
console.log('articlesDates: ', articlesDates);

const newestArticleDate =  articlesDates.sort((a, b) =>{
  return b.getTime() - a.getTime();})[0]
console.log('newestArticleDate: ', newestArticleDate);


  return newestArticleDate;
};

const getArticlesLaterThanDate = (articles: Article[], date: Date) => {
  return articles.filter((article) => {
    return new Date(article.pubDate) > date;
  });
};

const processArticles = (
  postService: PostService,
  articles: Article[],
  currentLatestDate: Date,
) => {
  const latestArticles = getArticlesLaterThanDate(articles, currentLatestDate);

  if (latestArticles.length > 0) {
    latestArticles.forEach(async (article) => {
      const withPopulatedDates = {
        ...article,
        pubDate: new Date(article.pubDate),
        isoDate: new Date(article.isoDate),
      };
      await postService.create(withPopulatedDates);
    });
    console.log(
      `
        NEW LATEST ARTICLES!!!!!!!!!!
        NEW LATEST ARTICLES!!!!!!!!!!
        NEW LATEST ARTICLES!!!!!!!!!!

        latestArticles.length`,
      latestArticles.length,
    );
  }

  const newLatestDate =
  latestArticles.length > 0
  ? getLatestDate(latestArticles)
      : currentLatestDate;

  console.log('newLatestDate: ', newLatestDate);

  return {
    latestArticles,
    newLatestDate,
  };
};

export const parseRss = async (): Promise<Article[]> => {
  const parser = new Parser();
  // {
  // customFields: {
  //   feed: ['otherTitle', 'extendedDescription'],
  //   item: ['coAuthor','subtitle'],
  // }
  // }

  const feed = await parser.parseURL('https://www.reddit.com/r/programming/.rss');
  // const feed = await parser.parseString(redditProgrammingRss);
  //

  // feed.items.forEach((item) => {
  //
  // })
  return feed.items as Article[];
};

@Processor('posts-queue')
export class PostConsumer {
  newestDate = null;
  constructor(private readonly postService: PostService) {}

  @Process('post-job')
  async postJob(job: Job<unknown>) {
    try {
      console.log('-----\\---post job started');
      // Initialize newestDate if it's null
      if (!this.newestDate) {
        const latestPost = await this.postService.getLatest();
        console.log('latestPost: ', latestPost);

        if (latestPost) this.newestDate = latestPost.pubDate;
      }
      console.log('this.newestDate: ', this.newestDate);

      const articles = await parseRss();
      // const dates = articles.map((article) => article.isoDate);

      // const latestPost = await this.postService.getLatest();
      //

      this.newestDate = processArticles(
        this.postService,
        articles,
        new Date(this.newestDate),
      ).newLatestDate;

      console.log('----//----post job ended');
	} catch (error) {
		console.error('error: ', error);

	}
  }
}
