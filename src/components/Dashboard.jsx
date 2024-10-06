import React, { useState, useEffect } from 'react';
import { Button, message, Row, Col, Card, Typography, Modal } from 'antd';
import axios from 'axios';

const { Title, Text } = Typography;

const Dashboard = () => {
  const [surveys, setSurveys] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [shareVisible, setShareVisible] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const API_URL = import.meta.env.VITE_API_URL;

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/surveys/fetch-surveys/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setSurveys(data.surveys);
      } catch (err) {
        message.error('Failed to load surveys');
      }
    };
    fetchSurveys();
  }, []);

  // Function to count total responses for a survey
  const getTotalResponses = (survey) => {
    return survey.responses.length;
  };

  // Function to handle showing modal
  const showModal = (survey) => {
    setSelectedSurvey(survey);
    setVisible(true);
  };

  // Function to handle closing modal
  const handleCancel = () => {
    setVisible(false);
    setSelectedSurvey(null);
  };

  // Function to handle sharing survey
  const shareSurvey = (surveyId) => {
    const link = `${window.location.origin}/#/survey/${surveyId}`;
    setShareLink(link);
    setShareVisible(true);
  };

  // Function to handle closing share modal
  const handleShareCancel = () => {
    setShareVisible(false);
    setShareLink('');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    message.success('Link copied to clipboard!');
  };

  return (
    <div style={{ maxWidth: '900px', margin: 'auto', padding: '20px' }}>
      <Title level={2} style={{ textAlign: 'center' }}>Surveys</Title>
      <Row gutter={16}>
        {surveys.map((survey) => (
          <Col span={24} key={survey._id} style={{ marginBottom: '20px' }}>
            <Card hoverable>
              <Card.Meta
                title={<a href={`/survey/${survey._id}`} style={{ color: '#1890ff' }}>{survey.title}</a>}
              />
              <div style={{ marginTop: '10px' }}>
                <Text>Total Responses: <Text type="secondary">{getTotalResponses(survey)}</Text></Text>
              </div>
              <Button type="primary" style={{ marginTop: '10px', marginRight: '10px' }} onClick={() => showModal(survey)}>
                View Responses
              </Button>
              <Button type="default" style={{ marginTop: '10px' }} onClick={() => shareSurvey(survey._id)}>
                Share Survey
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
      <Row justify="center" style={{ marginTop: '20px' }}>
        <Col>
          <Button type="primary" href="/create-survey" style={{ width: '100%' }}>
            Create New Survey
          </Button>
        </Col>
      </Row>

      <Modal
  title={`Responses for ${selectedSurvey?.title || 'Survey'}`} 
  open={visible}
  onCancel={handleCancel}
  footer={null}
>
  {selectedSurvey?.responses ? ( 
    selectedSurvey.responses.map((response) => (
      <div key={response._id} style={{ marginBottom: '20px' }}>
        <Text strong>{`${response.name} (${response.email})`}</Text>
        <div style={{ marginLeft: '20px' }}>
          {selectedSurvey.questions.map((question, qIndex) => (
            <div key={question._id} style={{ marginBottom: '5px' }}>
              <Text strong>{`${qIndex + 1}. ${question.text}: `}</Text>
              <Text>{response.answers[qIndex] || 'No response'}</Text>
            </div>
          ))}
        </div>
      </div>
    ))
  ) : (
    <Text>No responses available.</Text> 
  )}
</Modal>


      {/* Modal for sharing survey link */}
      <Modal
        title="Share Survey Link"
        open={shareVisible}
        onCancel={handleShareCancel}
        footer={[
          <Button key="copy" type="primary" onClick={copyToClipboard}>
            Copy Link
          </Button>,
          <Button key="cancel" onClick={handleShareCancel}>
            Cancel
          </Button>
        ]}
      >
        <Text>Share this link to access the survey:</Text>
        <Text strong style={{ display: 'block', marginTop: '10px' }}>{shareLink}</Text>
      </Modal>
    </div>
  );
};

export default Dashboard;
