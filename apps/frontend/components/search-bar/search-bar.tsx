import { CloseCircleOutlined } from '@ant-design/icons';
import { ApolloError, gql, useQuery } from '@apollo/client';
import { ArticleType } from '@devit-test-project/library';
import { Result, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useDebounce } from 'react-use';
import { HeadComponent } from '../head/head';
import { useFoundPostsStore } from './post-search.store';
import s from './search-bar.module.scss';

const { Paragraph, Text } = Typography;

type TSortDirection = 'ASC' | 'DESC';
interface IQueryProps {
  searchTitle: string;
  searchAuthor: string;
  sortDirection: TSortDirection;
}

const QUERY = ({
  searchTitle,
  searchAuthor,
  sortDirection,
}: IQueryProps) => gql`
query{
	posts(
	  options:{
		searchTitle:"${searchTitle}"
		searchAuthor:"${searchAuthor}"
		sortDirection:"${sortDirection}"
	  }
	){
		posts{
			id
			pubDate
			title
			author
			content
			link
			contentSnippet
		}
	}
  }
`;

export interface ISearchResult {
  posts: ArticleType[];

  searchTitle: string;
  searchAuthor: string;
  loading: boolean;
  error: ApolloError;
}
export interface SearchBarProps {
  initialPosts: ArticleType[];
  onSearch?: (searchResult: ISearchResult) => void;
}

export function SearchBar(props: SearchBarProps) {
  const { initialPosts } = props;
  const {
    setPrevLoadedPosts,
    prevLoadedPosts,
    setStatus,
    status: searchStatus,
  } = useFoundPostsStore();

  const { searchAuthor, searchTitle } = searchStatus;
  const [open, setOpen] = useState(false);

  const [searchQueryTitle, setSearchQueryTitle] = useState(searchTitle);
  const [sortDirection, setSortDirection] = useState<TSortDirection>('DESC');
  const [debouncedSortDirection, setDebouncedSortDirection] =
    useState<TSortDirection>('DESC');

  const [debouncedSearchQueryTitle, setDebouncedSearchQueryTitle] =
    useState('');

  const { data, loading, error } = useQuery(
    QUERY({
      searchTitle: `${debouncedSearchQueryTitle}`,
      searchAuthor: '',
      sortDirection: debouncedSortDirection,
    })
  );

  const [, cancel] = useDebounce(
    () => {
      setDebouncedSearchQueryTitle(searchQueryTitle);
      setDebouncedSortDirection(sortDirection);
    },
    2000,
    [searchQueryTitle, sortDirection]
  );

  useEffect(() => {
    if (debouncedSearchQueryTitle !== '') {
      setPrevLoadedPosts(data?.posts?.posts);
    }
  }, [data?.posts?.posts, setPrevLoadedPosts, debouncedSearchQueryTitle]);

  const generalLoading =
    loading ||
    (searchQueryTitle !== debouncedSearchQueryTitle &&
      searchQueryTitle !== '') ||
    sortDirection !== debouncedSortDirection;
  const status: ISearchResult = useMemo(
    () => ({
      searchTitle: debouncedSearchQueryTitle,
      searchAuthor: '',
      posts: generalLoading
        ? prevLoadedPosts
        : searchQueryTitle === ''
        ? initialPosts
        : data?.posts?.posts,
      loading: generalLoading,
      error,
    }),
    [
      debouncedSearchQueryTitle,
      generalLoading,
      prevLoadedPosts,
      searchQueryTitle,
      initialPosts,
      data?.posts,
      error,
    ]
  );

  useEffect(() => {
    setStatus && setStatus(status);
  }, [status, setStatus]);

  return (
    <div className={s['container']}>
      {searchQueryTitle !== '' && (
        <HeadComponent title={`${searchQueryTitle} - search`} />
      )}
      <div className={s['searchGroup']}>
        <input
          type="search"
          name=""
          id=""
          placeholder="Search title"
          value={searchQueryTitle}
          onChange={(e) => {
            setSearchQueryTitle(e.target.value);
            if (e.target.value === '') {
              cancel();
            }
          }}
        />
        <button onClick={() => setOpen((v) => !v)}>
          {open ? 'Hide' : 'Options'}
        </button>
      </div>
      {open && (
        <section>
          <p>Sort by date</p>
          <select
            name=""
            id=""
            value={sortDirection}
            onChange={(e) => {
              setSortDirection(e.target.value as TSortDirection);
            }}
          >
            <option value="ASC">Oldest first</option>
            <option value="DESC">Newest first</option>
          </select>
        </section>
      )}
      {status.error && (
        <Result status="error" title="Search Failed" subTitle={error?.message}>
          <div className="desc">
            <Paragraph>
              <Text
                strong
                style={{
                  fontSize: 16,
                }}
              >
                Search didn&apos;t went well
              </Text>
            </Paragraph>
            <Paragraph>
              <CloseCircleOutlined className="site-result-demo-error-icon" />{' '}
              Please repeat again later.
            </Paragraph>
          </div>
        </Result>
      )}
    </div>
  );
}
