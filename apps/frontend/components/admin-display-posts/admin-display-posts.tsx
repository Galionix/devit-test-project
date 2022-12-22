import { ArticlePreview } from '../article/article';
import { useFoundPostsStore } from '../search-bar/post-search.store';
import styles from './admin-display-posts.module.scss';
import { Table } from 'antd';
import { ArticleType, stripUsername } from '@devit-test-project/library';
import { useEffect, useState } from 'react';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import { gql, useQuery } from '@apollo/client';
import { ISearchOptions } from '@devit-test-project/library';

const QUERY = ({
  pageSize,
  current,
  sortBy = 'pubDate',
  sortDirection = 'ASC',
}: Partial<ISearchOptions>) => gql`
  query {
    posts(options: {
		sortBy: "${sortBy}"
		sortDirection: "${sortDirection}"
		pageSize: ${pageSize}
		current: ${current}
	}) {
		posts{

			id
			pubDate
			title
			author
			content
			link
			contentSnippet
		}
		total
    }
  }
`;

/* eslint-disable-next-line */
export interface AdminDisplayPostsProps {}

const columns = [
  {
    title: 'index',
    dataIndex: 'index',
    key: 'index',
    render: (text: string, record: ArticleType, index: number) => index + 1,
  },
  {
    title: 'id',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'author',
    sorter: true,
    dataIndex: 'author',
    key: 'author',
    render: (text: string) => <a>{stripUsername(text)}</a>,
  },
  {
    title: 'title',
    dataIndex: 'title',
    sorter: true,
    key: 'title',
    ellipsis: true,
  },
];
interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue>;
  field?: ISearchOptions['sortBy'];
  order?: 'ascend' | 'descend';
}

export function AdminDisplayPosts(props: AdminDisplayPostsProps) {
  const { status } = useFoundPostsStore();
  // const [loading, setLoading] = useState(false);

  //   const [data, setData] = useState<ArticleType[]>();
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      showSizeChanger: true,
      current: 1,
      pageSize: 10,
    },
  });

  const { data, loading, error } = useQuery(
    QUERY({
      sortBy: tableParams?.field,
      sortDirection: tableParams?.order === 'ascend' ? 'ASC' : 'DESC',
      pageSize: tableParams.pagination?.pageSize,
      current: tableParams.pagination?.current,
    }),
    {
      pollInterval: 1000,
    }
  );
  console.log('total:', tableParams);

  // const handlePaginationChange = (page: number, pageSize?: number) => {
  // 	setTableParams({
  // 		...tableParams,
  // 		pagination: {
  // 			...tableParams.pagination,
  // 			current: page,
  // 			pageSize: pageSize,
  // 		},
  // 	});
  // };
  const { posts } = status;

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue>,
    sorter: any
  ) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });

    // `dataSource` is useless since `pageSize` changed
    // if (pagination.pageSize !== tableParams.pagination?.pageSize) {
    //   setData([]);
    // }
  };
  //   const getRandomuserParams = (params: TableParams) => ({
  //     results: params.pagination?.pageSize,
  //     page: params.pagination?.current,
  //     ...params,
  //   });

  //   const fetchData = () => {
  //     // setLoading(true);
  //     console.log(tableParams);
  //     // fetch(
  //     //   `https://randomuser.me/api?${qs.stringify(
  //     //     getRandomuserParams(tableParams)
  //     //   )}`
  //     // )
  //     //   .then((res) => res.json())
  //     //   .then(({ results }) => {
  //     //     setData(results);
  //     //     setLoading(false);
  //     //     setTableParams({
  //     //       ...tableParams,
  //     //       pagination: {
  //     //         ...tableParams.pagination,
  //     //         total: 200,
  //     //         // 200 is mock data, you should read it from server
  //     //         // total: data.totalCount,
  //     //       },
  //     //     });
  //     //   });
  //   };

  //   useEffect(() => {
  //     fetchData();
  //   }, [JSON.stringify(tableParams)]);

  return (
    <div className={styles['container']}>
      {/* <pre>{JSON.stringify(tableParams, null, 2)}</pre> */}
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      <Table
        dataSource={data ? data.posts.posts : []}
        columns={columns}
        loading={loading}
        rowKey={(record) => record.id}
        pagination={{ ...tableParams.pagination, total: data?.posts?.total }}
        onChange={handleTableChange}
        scroll={{
          y: 500,
        }}
      />
      {/* <pre>{JSON.stringify(posts, null, 2)}</pre> */}

      {/* <pre>{JSON.stringify(status, null, 2)}</pre> */}
      {/* {posts &&
        posts.map((post, index) => (
          <ArticlePreview {...post} key={`${post.id} ${index}`} />
        ))} */}
    </div>
  );
}

export default AdminDisplayPosts;
