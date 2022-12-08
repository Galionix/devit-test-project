import { ApolloError, gql, useQuery } from '@apollo/client';
import { ArticleType } from '@devit-test-project/library';
import { useState } from 'react';
import s from './search-bar.module.scss';
import { useDebounce } from 'react-use';

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
    loading: boolean;
    error: ApolloError;
  }
export interface SearchBarProps {
  onSearch?: (searchResult: ISearchResult) => void;
}

export function SearchBar(props: SearchBarProps) {
  const [open, setOpen] = useState(false);

	const [search, setSearch] = useState('');
  const [sortDirection, setSortDirection] = useState<TSortDirection>('DESC');
  const [debouncedSortDirection, setDebouncedSortDirection] =
    useState<TSortDirection>('DESC');

  const [debouncedSearch, setDebouncedSearch] = useState('');

  const { data, loading, error } = useQuery(
    QUERY({
      searchText: `${debouncedSearch}`,
      sortDirection: debouncedSortDirection,
    })
  );

  const { onSearch } = props;

  onSearch &&
    onSearch({
      posts: debouncedSearch === '' || search === '' ? [] : data?.posts,
      loading:
        loading ||
        (search !== debouncedSearch && search !== '') ||
        sortDirection !== debouncedSortDirection,
      error,
    });

  const [, cancel] = useDebounce(
    () => {
      setDebouncedSearch(search);
      setDebouncedSortDirection(sortDirection);
    },
    2000,
    [search, sortDirection]
  );

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
      <pre>
        {(loading ||
          (search !== debouncedSearch && search !== '') ||
          (sortDirection !== debouncedSortDirection)) && 'Loading...'}
        {error && 'Error'}
        {JSON.stringify(
          debouncedSearch === '' || search === '' ? [] : data?.posts,
          null,
          2
        )}
      </pre>
    </div>
  );
}

export default SearchBar;
