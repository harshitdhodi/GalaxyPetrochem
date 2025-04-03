import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, message } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const BlogCardForm = () => {
  const [form] = Form.useForm();
  const [blogCard, setBlogCard] = useState('');
  const [displayContent, setDisplayContent] = useState(''); // State for displayed content
  const [blogCardId, setBlogCardId] = useState(null);

  const fetchBlogCard = async () => {
    try {
      const response = await axios.get('/api/blogCard/getCard');
      const blogCardData = response.data[0];

      setBlogCardId(blogCardData._id);
      setBlogCard(blogCardData.blogCard);

      // Convert white text to black for display
      const parser = new DOMParser();
      const doc = parser.parseFromString(blogCardData.blogCard, 'text/html');
      const elements = doc.getElementsByTagName('*');
      for (let element of elements) {
        if (element.style.color === 'white' || element.style.color === '#ffffff') {
          element.style.color = 'black';
        }
      }
      setDisplayContent(doc.body.innerHTML);
      form.setFieldsValue({ blogCard: blogCardData.blogCard });
    } catch (error) {
      console.error('Failed to fetch blog card:', error);
      message.error('Failed to fetch blog card.');
    }
  };

  useEffect(() => {
    fetchBlogCard();
  }, [form]);

  const handleEditorChange = (newContent) => {
    setBlogCard(newContent);

    // Convert white text to black for display
    const parser = new DOMParser();
    const doc = parser.parseFromString(newContent, 'text/html');
    const elements = doc.getElementsByTagName('*');
    for (let element of elements) {
      if (element.style.color === 'white' || element.style.color === '#ffffff') {
        element.style.color = 'black';
      }
    }
    setDisplayContent(doc.body.innerHTML);
  };

  const onFinish = async () => {
    try {
      if (blogCardId) {
        await axios.put(`/api/blogCard/editCard/${blogCardId}`, { blogCard });
        message.success('Blog card updated successfully!');
      } else {
        await axios.post('/api/blogCard/addCard', { blogCard });
        message.success('Blog card added successfully!');
      }
      form.resetFields();
      setBlogCard('');
      setDisplayContent('');
      fetchBlogCard();
    } catch (error) {
      console.error('Failed to save blog card:', error);
      message.error('Failed to save blog card.');
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} name="blog_card_form">
      <Form.Item
        name="blogCard"
        label="Blog Card Content"
        rules={[{ required: true, message: 'Please input the blog card content!' }]}
      >
        <ReactQuill
          value={displayContent || blogCard}
          onChange={handleEditorChange}
          modules={{
            toolbar: [
              [{ header: '1' }, { header: '2' }, { font: [] }],
              [{ list: 'ordered' }, { list: 'bullet' }],
              ['bold', 'italic', 'underline', 'blockquote'],
              [{ align: [] }],
              ['link', 'image', 'video'],
              ['clean']
            ]
          }}
          formats={[
            'header', 'font', 'list', 'bold', 'italic', 'underline',
            'blockquote', 'align', 'link', 'image', 'video'
          ]}
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          {blogCardId ? 'Update Blog Card' : 'Add Blog Card'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default BlogCardForm;
