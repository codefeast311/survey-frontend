import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';

const HeaderComponent = ({ isAuthenticated, onLogout }) => {
  const items = isAuthenticated
    ? [
        {
          key: 'dashboard',
          label: <Link to="/dashboard">Dashboard</Link>,
        },
        {
          key: 'create-survey',
          label: <Link to="/create-survey">Create Survey</Link>,
        },
        {
          key: 'logout',
          label: <span onClick={onLogout}>Logout</span>,
        },
      ]
    : [
        {
          key: 'login',
          label: <Link to="/login">Login</Link>,
        },
        {
          key: 'register',
          label: <Link to="/register">Register</Link>,
        },
      ];

  return (
    <Menu theme="dark" mode="horizontal" items={items} defaultSelectedKeys={['dashboard']} />
  );
};

export default HeaderComponent;
