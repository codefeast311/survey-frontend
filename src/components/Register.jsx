import React, { useState } from 'react';
import { Form, Input, Button, message, Card } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = ({ setIsAuthenticated }) => { 
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;  

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/api/auth/register`, values);
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId);
      setIsAuthenticated(true);
      message.success('Registration Successful!');
      navigate('/dashboard');
    } catch (err) {
      message.error('Registration Failed! Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
      <Card title="Register" bordered={false}>
        <Form name="register" onFinish={onFinish} layout="vertical">
          <Form.Item 
            name="email" 
            label="Email" 
            rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item 
            name="password" 
            label="Password" 
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
              Register
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
