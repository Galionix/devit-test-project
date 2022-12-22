import {
  CloseCircleOutlined,
  EditOutlined,
  SearchOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { gql, useMutation, useQuery } from '@apollo/client';
import {
  ArticleType,
  ISearchOptions,
  stripUsername,
} from '@devit-test-project/library';
import {
  Button,
  Input,
  InputRef,
  message,
  Popconfirm,
  Space,
  Table,
} from 'antd';
import type { TablePaginationConfig } from 'antd/es/table';
import type {
  ColumnType,
  FilterConfirmProps,
  FilterValue,
} from 'antd/es/table/interface';
import { useSession } from 'next-auth/react';
import { useRef, useState } from 'react';
import { useFoundPostsStore } from '../search-bar/post-search.store';
import UpadtePostModal from '../upadte-post-modal/upadte-post-modal';
import styles from './admin-display-posts.module.scss';

// const POST_DISPLAY_QUERY = 'POST_DISPLAY_QUERY';
const QUERY = ({
  pageSize,
  current,
  sortBy = 'pubDate',
  sortDirection = 'ASC',
  searchTitle = '',
  searchAuthor = '',
}: Partial<ISearchOptions>) => gql`
  query {
    posts(options: {
		sortBy: "${sortBy}"
		searchTitle: "${searchTitle}"
		searchAuthor: "${searchAuthor}"
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
const REMOVE_POST_MUTATION = gql`
  mutation removePost($id: String!) {
    removePost(id: $id) {
      id
    }
  }
`;

/* eslint-disable-next-line */
export interface AdminDisplayPostsProps {}

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
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const session = useSession();

  const [postToUpdate, setPostToUpdate] = useState<ArticleType>(
    {} as ArticleType
  );
  const [updatePostModalOpen, setUpdatePostModalOpen] = useState(false);

  const { data, loading, error } = useQuery(
    QUERY({
      sortBy: tableParams?.field,
      sortDirection: tableParams?.order === 'ascend' ? 'ASC' : 'DESC',
      pageSize: tableParams.pagination?.pageSize,
      current: tableParams.pagination?.current,
      searchTitle: searchedColumn === 'title' ? searchText : '',
      searchAuthor: searchedColumn === 'author' ? searchText : '',
    }),
    {
      pollInterval: 10000,
    }
  );
  const [removePost, { loading: removePostLoading }] = useMutation(
    REMOVE_POST_MUTATION,
    {
      context: {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.data?.user?.token}`,
        },
      },
      refetchQueries: ['posts'],
      onCompleted: () => {
        message.success('Post removed');
      },
      onError: () => {
        message.error('Error removing post');
      },
    }
  );

  const onPostRemove = (id: string) => {
    removePost({
      variables: {
        id,
      },
    });
  };

  const getColumnSearchProps = (
    dataIndex: keyof ArticleType
  ): ColumnType<ArticleType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: 'block' }}
          //   allowClear
          //   handleReset={() => clearFilters && handleReset(clearFilters)}
        />
        <Space>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          {/*  <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>*/}
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    // onFilter: (value, record) =>
    //   record[dataIndex]
    //     .toString()
    //     .toLowerCase()
    //     .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) => stripUsername(text),
    //   searchedColumn === dataIndex ? (
    //     <Highlighter
    //       highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
    //       searchWords={[searchText]}
    //       autoEscape
    //       textToHighlight={text ? text.toString() : ''}
    //     />
    //   ) : (
    //     text
    //   ),
  });

  const columns = [
    {
      title: 'actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (text: string, record: ArticleType, index: number) => {
        return (
          <>
            <Space direction="horizontal">
              <Button
                onClick={() => {
                  console.log({
                    record,
                    open: true,
                  });
                  const { __typename, ...rest } = record as any;
                  setPostToUpdate(rest);
                  setUpdatePostModalOpen(true);
                }}
                icon={<EditOutlined />}
              />
              <Popconfirm
                placement="right"
                title={'Are you sure to delete this post?'}
                // description="Delete post"
                okButtonProps={{ loading: removePostLoading }}
                onConfirm={() => onPostRemove(record.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  //   loading={removePostLoading}
                  icon={<CloseCircleOutlined />}
                />
              </Popconfirm>
              <Button
                icon={<EyeOutlined />}
                onClick={() => {
                  window.open(`/post/${record.id}`, '__blank');
                }}
              >
                {/* <Link href={`/posts/${record.id}`}>View</Link> */}
              </Button>
            </Space>
          </>
        );
      },
      width: 150,
    },
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
      ellipsis: true,
      width: 100,
    },
    {
      title: 'author',
      sorter: true,
      dataIndex: 'author',
      key: 'author',
      width: 300,
      render: (text: string) => <a>{stripUsername(text)}</a>,
      ...getColumnSearchProps('author'),
    },
    {
      title: 'title',
      dataIndex: 'title',
      sorter: true,
      key: 'title',
      ellipsis: true,
      ...getColumnSearchProps('title'),
    },
  ];
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

  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: keyof ArticleType
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  return (
    <div className={styles['container']}>
      {/* <pre>{JSON.stringify({ searchedColumn, searchText }, null, 2)}</pre> */}
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      <UpadtePostModal
        open={updatePostModalOpen}
        setOpen={setUpdatePostModalOpen}
        post={postToUpdate}
      />

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
