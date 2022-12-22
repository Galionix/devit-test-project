import { gql, useMutation } from '@apollo/client';
import { ArticleType } from '@devit-test-project/library';
import {
  Button,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  notification,
} from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { defaultTextAreaRules, defaultTextRules } from '../utils/reused';
import styles from './add-post-modal.module.scss';

dayjs.extend(customParseFormat);

const showFormat = 'YYYY-MM-DD HH:mm:ss';

const CREATE_POST_MUTATION = gql`
  mutation createPost($input: create_post_input!) {
    createPost(input: $input) {
      id
    }
  }
`;

const dateFormat = 'YYYY-MM-DDTHH:mm:ss.SSSZ';

const createContent = (title: string, link: string, username: string) => ({
  content: `&#32; submitted by &#32; <a href="https://www.reddit.com/user/${username}"> /u/${username} </a> <br/> <span><a href="${link}">[link]</a></span> &#32; <span><a href="https://www.reddit.com/r/programming/comments/">[comments]</a></span>`,
  contentSnippet: `submitted by    /u/${username}  \n [link]   [comments]`,
});
/* eslint-disable-next-line */
export interface AddPostModalProps {}

export function AddPostModal(props: AddPostModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createPostData, setCreatePostData] = useState<ArticleType>(
    {} as ArticleType
  );

  const session = useSession();

  const [createPost, result] = useMutation(CREATE_POST_MUTATION, {
    refetchQueries: ['posts'],
    context: {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.data?.user?.token}`,
      },
    },
    variables: {
      input: createPostData,
    },
    onCompleted: () => {
      setIsModalOpen(false);
    },
    onError: (e) => {
      if (e.message === 'Unauthorized') {
        signOut();
      }
      message.error('Error updating post: ' + e.message);
    },
  });

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = (values: ArticleType) => {
    const pubDate = dayjs(values.pubDate).format();
    const content = createContent(values.title, values.link, values.author);
    const res = {
      ...values,
      pubDate,
      isoDate: pubDate,
      ...content,
    };
    setCreatePostData(() => res);
    createPost({
      variables: {
        input: res,
      },
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    notification.open({
      message: 'Validation error',
      description: `Please check the following fields: ${errorInfo.errorFields.map(
        (field: any) => `${field.name}: ${field.errors[0]}`
      )}`,
    });
  };

  return (
    <div className={styles['container']}>
      <Button onClick={showModal} type="primary">
        Add post
      </Button>
      <Modal
        title="Create new post"
        open={isModalOpen}
        onCancel={handleCancel}
        destroyOnClose={true}
        footer={null}
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{
            id: uuidv4(),
            pubDate: dayjs(new Date().toISOString(), dateFormat),
            author:
              session.status === 'authenticated'
                ? session.data.user.username
                : 'admin',
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="id"
            name="id"
            rules={[{ required: true, message: 'Id should be specified' }]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="Title"
            name="title"
            rules={[
              { required: true, message: 'Please input title' },
              ...defaultTextRules,
            ]}
          >
            <Input size="large" placeholder="My post title" />
          </Form.Item>

          <Form.Item
            label="Link"
            name="link"
            rules={[
              { required: true, message: 'Please input link' },
              ...defaultTextRules,
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Pub Date" name="pubDate">
            <DatePicker showTime format={showFormat} />
          </Form.Item>

          <Form.Item label="Author" name="author" rules={defaultTextAreaRules}>
            <Input />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" loading={result.loading}>
              Create
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default AddPostModal;
