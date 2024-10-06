// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'antd/dist/reset.css';  
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import CreateSurvey from './components/CreateSurvey';
import ViewSurvey from './components/ViewSurvey';
import { Layout } from 'antd';
import ProtectedRoute from './components/ProtectedRoute'; 
import HeaderComponent from './components/Header'; 

const { Content } = Layout;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token'); 
    setIsAuthenticated(!!token); 
  }, []);

  const logout = () => {
    localStorage.removeItem('token'); 
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <HeaderComponent isAuthenticated={isAuthenticated} onLogout={logout} /> 
        <Content style={{ padding: '50px', background: '#fff' }}>
          <Routes>
            <Route path="/register" element={<Register setIsAuthenticated={setIsAuthenticated} />} /> 
            <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} /> 
            <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
            <Route path="/create-survey" element={<ProtectedRoute element={<CreateSurvey />} />} />
            <Route path="/survey/:id" element={<ViewSurvey />} />
          </Routes>
        </Content>
      </Layout>
    </Router>
  );
}

export default App;
