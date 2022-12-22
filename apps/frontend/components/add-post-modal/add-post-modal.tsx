import { useState } from 'react';
import styles from './add-post-modal.module.scss';
import { Modal, Button, Checkbox, Form, Input, DatePicker } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useSession } from 'next-auth/react';

dayjs.extend(customParseFormat);

const defaultTextRules = [
  {
    min: 5,
    message: 'Value should be at least 5 characters long',
  },
  {
    max: 200,
    message: 'Value should be at most 200 characters long',
  },
];

const defaultTextAreaRules = [
  {
    min: 5,
    message: 'Value should be at least 5 characters long',
  },
  {
    max: 500,
    message: 'Value should be at most 500 characters long',
  },
];
const dateFormat = 'YYYY-MM-DD';

/* eslint-disable-next-line */
export interface AddPostModalProps {}

export function AddPostModal(props: AddPostModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const session = useSession();
  console.log('session: ', session);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  console.log(uuidv4());
  return (
    <div className={styles['container']}>
      {/* <h1>Welcome to AddPostModal!</h1>
	  "&#32; submitted by &#32; <a href="https://www.reddit.com/user/signalbound"> /u/signalbound </a> <br/> <span><a href="https://mdalmijn.com/p/breaking-the-planning-death-cycle">[link]</a></span> &#32; <span><a href="https://www.reddit.com/r/programming/comments/zskelp/breaking_the_planning_death_cycle/">[comments]</a></span>"
       */}
      <Button onClick={showModal} type="primary">
        Add post
      </Button>
      <Modal
        title="Create new post"
        open={isModalOpen}
        // onOk={handleOk}
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

          <Form.Item label="Link" name="link" rules={defaultTextRules}>
            <Input />
          </Form.Item>

          <Form.Item label="Pub Date" name="pubDate">
            <DatePicker showTime />
          </Form.Item>

          <Form.Item label="Author" name="author" rules={defaultTextAreaRules}>
            <Input />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              onClick={(e: any) => {
                console.log('e: ', e);
                console.log(dayjs(e.pubDate).format());
              }}
            >
              Create
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default AddPostModal;
