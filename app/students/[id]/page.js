'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Form, Input, Button, message, Spin } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

const EditStudentPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [form] = Form.useForm();

  const fetchStudent = async () => {
    try {
      const response = await fetch(`/api/students/${id}`);
      if (!response.ok) throw new Error('Failed to fetch student');
      const data = await response.json();
      setStudent(data);
      form.setFieldsValue({
        name: data.name,
        major: data.major,
      });
    } catch (error) {
      console.error('Fetch Error:', error);
      message.error('Failed to load student data.');
      router.push('/students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchStudent();
    }
  }, [id]);

  const handleUpdateStudent = async (values) => {
    setUpdating(true);
    try {
      const response = await fetch(`/api/students/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error('Failed to update student');

      console.log('Student updated successfully!');
      router.push('/students');
    } catch (error) {
      console.error('PUT Error:', error);
      message.error('Error updating student.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => router.push('/students')}
        style={{ marginBottom: 16 }}
      >
        Back to Students
      </Button>
      <h1>Edit Student</h1>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleUpdateStudent}
        autoComplete="off"
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please input the student name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Major"
          name="major"
          rules={[{ required: true, message: 'Please input the student major!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={updating} style={{ width: '100%' }}>
            Update Student
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditStudentPage;
