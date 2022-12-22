import { gql, useMutation } from '@apollo/client';
import { ArticleType, stripUsername } from '@devit-test-project/library';
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
import { defaultTextAreaRules, defaultTextRules } from '../utils/reused';
import styles from './upadte-post-modal.module.scss';

dayjs.extend(customParseFormat);

export interface UpadtePostModalProps {
  post: ArticleType;
  open: boolean;
  setOpen: (open: boolean) => void;
}
const UPDATE_POST_MUTATION = gql`
  mutation updatePost($input: UpdatePostInput!) {
    updatePost(input: $input) {
      id
      author
    }
  }
`;

const dateFormat = 'YYYY-MM-DDTHH:mm:ss.SSSZ';
const showFormat = 'YYYY-MM-DD HH:mm:ss';

export function UpadtePostModal({ post, open, setOpen }: UpadtePostModalProps) {
  const session = useSession();
  const [updatePost, { loading: updatePostLoading }] = useMutation(
    UPDATE_POST_MUTATION,
    {
      context: {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.data?.user?.token}`,
        },
      },
      refetchQueries: ['posts'],
      onCompleted: () => {
        message.success('Post updated');
        setOpen(false);
      },
      onError: (e) => {
        if (e.message === 'Unauthorized') {
          signOut();
        }
        message.error('Error updating post ' + e.message);
      },
    }
  );

  const onPostUpdate = (input: Partial<ArticleType>) => {
    updatePost({
      variables: {
        input,
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

  const onFinish = (values: any) => {
    onPostUpdate({
      ...post,
      ...values,
    });
  };
  return (
    <Modal
      className={styles['container']}
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      title="Update post"
      destroyOnClose
    >
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ ...post, author: stripUsername(`${post.author}`) }}
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

        <Form.Item label="Pub Date" name="pubDate" valuePropName="date">
          <DatePicker
            showTime
            defaultValue={dayjs(post.pubDate, dateFormat)}
            format={showFormat}
          />
        </Form.Item>

        <Form.Item label="Author" name="author" rules={defaultTextAreaRules}>
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit" loading={updatePostLoading}>
            Update
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default UpadtePostModal;
