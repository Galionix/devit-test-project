import {
  CloseCircleOutlined,
  EditOutlined,
  EyeOutlined,
  SearchOutlined,
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
        />
        <Space>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),

    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) => stripUsername(text),
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
                  const { __typename, ...rest } = record as any;
                  setPostToUpdate(rest);
                  setUpdatePostModalOpen(true);
                }}
                icon={<EditOutlined />}
              />
              <Popconfirm
                placement="right"
                title={'Are you sure to delete this post?'}
                okButtonProps={{ loading: removePostLoading }}
                onConfirm={() => onPostRemove(record.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button icon={<CloseCircleOutlined />} />
              </Popconfirm>
              <Button
                icon={<EyeOutlined />}
                onClick={() => {
                  window.open(`/post/${record.id}`, '__blank');
                }}
              ></Button>
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
    {
      title: 'pubDate',
      dataIndex: 'pubDate',
      sorter: true,
      key: 'pubDate',
    },
  ];

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
  };

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
    </div>
  );
}

export default AdminDisplayPosts;
