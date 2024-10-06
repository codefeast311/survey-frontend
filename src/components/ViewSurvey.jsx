import React, { useState, useEffect } from 'react';
import { Form, Radio, Button, message, Card, Spin, Input } from 'antd';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ViewSurvey = () => {
  const { id } = useParams();
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;  
  const token = localStorage.getItem('token'); 

  useEffect(() => {
    const fetchSurvey = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${API_URL}/api/surveys/${id}`, {
          headers: {
            Authorization: `Bearer ${token}` 
          }
        });
        setSurvey(data);
      } catch (err) {
        message.error('Failed to load survey');
      } finally {
        setLoading(false);
      }
    };
    fetchSurvey();
  }, [id, token]); 

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/surveys/${id}/response`, values, {
        headers: {
          Authorization: `Bearer ${token}` 
        }
      });
      if(response.data.success) {
        message.success(response.data.message);
        setSubmitted(true);
      } else {
        message.error(response.data.message);
      }
    } catch (err) {
      message.error('Failed to submit response');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Spin size="large" />
    </div>
  );

  if (submitted) {
    return (
      <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
        <Card bordered={false}>
          <h2>Thank you for your submission!</h2>
          <p>Your response has been recorded successfully.</p>
        </Card>
      </div>
    );
  }

  if (!survey) return <div>No survey found.</div>;

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
      <Card title={survey.title} bordered={false}>
        <Form onFinish={onFinish}>
          <Form.Item 
            name="name" 
            label="Name" 
            rules={[{ required: true, message: 'Please enter your name' }]}
          >
            <Input placeholder="Enter your name" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item 
            name="email" 
            label="Email" 
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input placeholder="Enter your email" style={{ width: '100%' }} />
          </Form.Item>

          {/* Survey Questions */}
          {survey.questions.map((question, index) => (
            <Form.Item 
              key={index} 
              name={['responses', index]} 
              label={question.text}
              rules={[{ required: true, message: 'Please select an option' }]}
            >
              <Radio.Group>
                {question.options.map((option, optIndex) => (
                  <Radio key={optIndex} value={option}>
                    {option}
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>
          ))}
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ViewSurvey;
