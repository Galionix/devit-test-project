import { useState } from 'react';
import styles from './add-post-modal.module.scss';
import {
  Modal,
  Button,
  Checkbox,
  Form,
  Input,
  DatePicker,
  notification,
  message,
} from 'antd';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { signOut, useSession } from 'next-auth/react';
import { ArticleType } from '@devit-test-project/library';
import { gql, useMutation } from '@apollo/client';
import { defaultTextRules, defaultTextAreaRules } from '../utils/reused';

dayjs.extend(customParseFormat);

const showFormat = 'YYYY-MM-DD HH:mm:ss';

// const CREATE = ({
//   id,
//   author,
//   content,
//   contentSnippet,
//   isoDate,
//   pubDate,
//   title,
//   link,
// }: ArticleType) => gql`
// mutation{
// 	createPost(input:{
// 	  id:"${id}",
// 	  author:"${author}",
// 	  content:"${content}",
// 	  contentSnippet:"${contentSnippet}",
// 	  isoDate:"${isoDate}",
// 	  pubDate:"${pubDate}",
// 	  title:"${title}",
// 	  link:"${link}",
// 	}){
// 	  id
// 	}
//   }
// `;
const CREATE_POST_MUTATION = gql`
  mutation createPost($input: create_post_input!) {
    createPost(input: $input) {
      id
    }
  }
`;
// const CREATE =

const dateFormat = 'YYYY-MM-DDTHH:mm:ss.SSSZ';
/*
content
:
"&#32; submitted by &#32; <a href=\"https://www.reddit.com/user/TheSwedeheart\"> /u/TheSwedeheart </a> <br/> <span><a href=\"https://encore.dev/blog/preview-envs\">[link]</a></span> &#32; <span><a href=\"https://www.reddit.com/r/programming/comments/zsodzu/fullstack_preview_environments_for_speed_and/\">[comments]</a></span>"
contentSnippet
:
"submitted by    /u/TheSwedeheart  \n [link]   [comments]"

*/
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

  console.log('createPostData: ', createPostData);
  const session = useSession();
  console.log('session: ', session);
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

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = (values: ArticleType) => {
    // console.log(dayjs(values.pubDate).format());
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
    // console.log('result: ', res);
  };

  const onFinishFailed = (errorInfo: any) => {
    // console.log('Failed:', errorInfo);

    notification.open({
      message: 'Validation error',
      description: `Please check the following fields: ${errorInfo.errorFields.map(
        (field: any) => `${field.name}: ${field.errors[0]}`
      )}`,

      // <pre>{JSON.stringify(errorInfo.errorFields[0].name, null, 2)}</pre>
      //   ),
      //   onClick: () => {
      //     console.log('Notification Clicked!');
      //   },
    });
  };

  //   console.log(uuidv4());
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
          //   onChange={(e) => console.log(e)}
          //   onValuesChange={(e) => console.log(e)}
          //   onFieldsChange={(e) => console.log(e)}
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
            <Button
              type="primary"
              htmlType="submit"
              loading={result.loading}
              //   onClick={(e: any) => {}}
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
