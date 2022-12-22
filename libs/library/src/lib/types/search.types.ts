export interface ISearchOptions {
  current: number;
  pageSize: number;

  sortBy:
    | 'pubDate'
    | 'title'
    | 'description'
    | 'author'
    | 'link'
    | 'isoDate'
    | 'id'
    | 'content'
    | 'contentSnippet';
  sortDirection: 'ASC' | 'DESC';
  searchTitle: string;
  searchAuthor: string;
}
