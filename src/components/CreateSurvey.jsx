import React, { useState } from "react";
import { Form, Input, Button, message, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateSurvey = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([{ text: "", options: [""] }]);

  const handleAddQuestion = () => {
    if (questions.length < 3) {
      setQuestions([...questions, { text: "", options: [""] }]);
    } else {
      message.warning("You can only add up to 3 questions.");
    }
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  const handleAddOption = (questionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.push("");
    setQuestions(updatedQuestions);
  };

  const onFinish = async (values) => {
    setLoading(true);
    const surveyData = { title: values.title, questions };

    try {
      await axios.post(`${API_URL}/api/surveys/create-survey`, surveyData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      message.success("Survey Created!");
      setQuestions([{ text: "", options: [""] }]);
      navigate("/dashboard");
    } catch (err) {
      message.error("Survey Creation Failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <Form name="create-survey" onFinish={onFinish} layout="vertical">
        <Form.Item
          name="title"
          label="Survey Title"
          rules={[{ required: true, message: "Please enter a survey title" }]}
        >
          <Input placeholder="Title" />
        </Form.Item>

        {questions.map((question, questionIndex) => (
          <div key={questionIndex}>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label={`Question ${questionIndex + 1}`}
                  rules={[
                    {
                      required: true,
                      message: `Please enter question ${questionIndex + 1}`,
                    },
                  ]}
                >
                  <Input
                    placeholder={`Enter Question ${questionIndex + 1}`}
                    value={question.text}
                    onChange={(e) =>
                      handleQuestionChange(
                        questionIndex,
                        "text",
                        e.target.value
                      )
                    }
                  />
                </Form.Item>
              </Col>

              {question.options.map((option, optionIndex) => (
                <Col span={24} key={optionIndex}>
                  <Form.Item
                    label={`Option ${optionIndex + 1}`}
                    rules={[
                      {
                        required: true,
                        message: `Please enter option ${optionIndex + 1}`,
                      },
                    ]}
                  >
                    <Input
                      placeholder={`Enter Option ${optionIndex + 1}`}
                      value={option}
                      onChange={(e) =>
                        handleOptionChange(
                          questionIndex,
                          optionIndex,
                          e.target.value
                        )
                      }
                    />
                  </Form.Item>
                </Col>
              ))}
            </Row>
            <Button
              type="dashed"
              onClick={() => handleAddOption(questionIndex)}
            >
              Add Option
            </Button>
          </div>
        ))}

        <Button
          type="dashed"
          onClick={handleAddQuestion}
          style={{ marginTop: "20px" }}
        >
          Add Question
        </Button>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{ width: "100%", marginTop: "20px" }}
          >
            Create Survey
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateSurvey;
