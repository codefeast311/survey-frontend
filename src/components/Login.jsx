import React, { useState } from 'react';
import { Form, Input, Button, message, Card } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsAuthenticated }) => { 
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;  

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/api/auth/login`, values);
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId);
      setIsAuthenticated(true); 
      message.success('Login Successful!');
      navigate('/dashboard');
    } catch (err) {
      message.error('Login Failed! Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
      <Card title="Login" bordered={false}>
        <Form name="login" onFinish={onFinish} layout="vertical">
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
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
