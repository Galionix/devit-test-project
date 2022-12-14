import { ApolloError, gql, useQuery } from '@apollo/client';
import { ArticleType } from '@devit-test-project/library';
import { memo, useEffect, useMemo, useState } from 'react';
import s from './search-bar.module.scss';
import { useDebounce } from 'react-use';
import { useFoundPostsStore } from './post-search.store';
import { ArticlePreview } from '../article/article';
import { Button, Result, Space, Spin, Typography } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';

const { Paragraph, Text } = Typography;

type TSortDirection = 'ASC' | 'DESC';
interface IQueryProps {
  searchText: string;
  sortDirection: TSortDirection;
}
const QUERY = ({ searchText, sortDirection }: IQueryProps) => gql`
query{
	posts(
	  options:{
		searchText:"${searchText}"
		sortDirection:"${sortDirection}"
	  }
	){
		id
		pubDate
		title
		author
		content
		link
		contentSnippet
	}
  }
`;

export interface ISearchResult {
  posts: ArticleType[];

  keyword: string;
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
    status: { keyword },
  } = useFoundPostsStore();

  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState(keyword);
  const [sortDirection, setSortDirection] = useState<TSortDirection>('DESC');
  const [debouncedSortDirection, setDebouncedSortDirection] =
    useState<TSortDirection>('DESC');

  const [debouncedSearch, setDebouncedSearch] = useState('');

  const { data, loading, error } = useQuery(
    QUERY({
      searchText: `${debouncedSearch}`,
      sortDirection: debouncedSortDirection,
    })
    //   ,
    // {
    //   onCompleted: () => {
    //     console.log('data?.posts: ', data);
    //     setPrevLoadedPosts(data?.posts);
    //   },
    // }
    //   , {
    // 	skip:
    // }
  );

  //   const { onSearch } = props;

  //   setStatus &&
  //     setStatus({
  //       posts: debouncedSearch === '' || search === '' ? [] : data?.posts,
  //       loading:
  //         loading ||
  //         (search !== debouncedSearch && search !== '') ||
  //         sortDirection !== debouncedSortDirection,
  //       error,
  //     });

  const [, cancel] = useDebounce(
    () => {
      setDebouncedSearch(search);
      setDebouncedSortDirection(sortDirection);
    },
    2000,
    [search, sortDirection]
  );

  //   const searched = debouncedSearch === '' || search === '';

  //   useEffect(() => {
  //     console.log(prevLoadedPosts);
  //   }, []);

  useEffect(() => {
    // FIXME: if we search every time from an empty,
    // this shows previously loaded results from another query in loading state
    if (debouncedSearch !== '') {
      setPrevLoadedPosts(data?.posts);
    }
    // else {
    //   setPrevLoadedPosts(initialPosts);
    // }
    //   return () => {
    // 	second
    //   }
  }, [data?.posts, setPrevLoadedPosts, debouncedSearch]);

  const generalLoading =
    loading ||
    (search !== debouncedSearch && search !== '') ||
    sortDirection !== debouncedSortDirection;
  const status: ISearchResult = useMemo(
    () => ({
      keyword: debouncedSearch,
      //   posts:
      //     prevLoadedPosts.length > 0 && loading
      //       ? prevLoadedPosts
      //       : !loading
      //       ? data?.posts
      //       : initialPosts,
      posts: generalLoading
        ? prevLoadedPosts
        : search === ''
        ? initialPosts
        : data?.posts,
      loading: generalLoading,
      error,
    }),
    [
      debouncedSearch,
      generalLoading,
      prevLoadedPosts,
      search,
      initialPosts,
      data?.posts,
      error,
    ]
  );

  useEffect(() => {
    setStatus && setStatus(status);
  }, [status, setStatus]);
  //   setStatus(status);

  return (
    <div className={s['container']}>
      <div className={s['searchGroup']}>
        <input
          type="search"
          name=""
          id=""
          placeholder="Search author or title"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
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
              console.log(e.target.value);
              setSortDirection(e.target.value as TSortDirection);
            }}
          >
            <option value="ASC">Oldest first</option>
            <option value="DESC">Newest first</option>
          </select>
        </section>
      )}
      {/* {status.loading && <Spin size="large" />} */}
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
                Search for {debouncedSearch} didn&apos;t return went well
              </Text>
            </Paragraph>
            <Paragraph>
              <CloseCircleOutlined className="site-result-demo-error-icon" />{' '}
              Please repeat again later.
            </Paragraph>
          </div>
        </Result>
      )}

      {/* {searched && <span>Showing pre-rendered results</span>}
      {search !== '' && !status.loading && <span>Showing search results</span>} */}
      {/* <pre>
        {(loading ||
          (search !== debouncedSearch && search !== '') ||
          sortDirection !== debouncedSortDirection) &&
          'Loading...'}
        {error && 'Error'} */}
      {/* {JSON.stringify(
          debouncedSearch === '' || search === '' ? [] : data?.posts,
          null,
          2
        )} */}
      {/* {status.posts &&
        status.posts.map((post) => <ArticlePreview {...post} key={post.id} />)} */}
      {/* </pre>
       */}
    </div>
  );
}

// export const MemoizedSearchBar = memo(SearchBar);
