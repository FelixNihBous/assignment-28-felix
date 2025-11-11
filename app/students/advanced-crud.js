'use client';

import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Popconfirm, Spin, notification, Space } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const AdvancedCrud = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/students');
      const data = await response.json();
      if (data.error) {
        notification.error({ message: 'Error', description: data.error });
      } else {
        setStudents(data.body?.data || []);
      }
    } catch (error) {
      notification.error({ message: 'Error', description: 'Failed to fetch students' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = () => {
    setEditingStudent(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingStudent(record);
    form.setFieldsValue({
      name: record.name,
      age: record.age || 18,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      setStudents(prev => prev.filter(student => student.id !== id));
      notification.success({ message: 'Success', description: 'Student deleted successfully' });
    } catch (error) {
      notification.error({ message: 'Error', description: 'Failed to delete student' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (editingStudent) {
        setStudents(prev => prev.map(student =>
          student.id === editingStudent.id
            ? { ...student, ...values }
            : student
        ));
        notification.success({ message: 'Success', description: 'Student updated successfully' });
      } else {
        const newStudent = {
          id: Date.now(),
          ...values
        };
        setStudents(prev => [...prev, newStudent]);
        notification.success({ message: 'Success', description: 'Student added successfully' });
      }
      setIsModalVisible(false);
    } catch (error) {
      notification.error({ message: 'Error', description: 'Failed to save student' });
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = Array.isArray(students) ? students.filter(student =>
    student && student.name && student.name.toLowerCase().includes(searchText.toLowerCase())
  ) : [];

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Are you sure to delete this student?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h1>Students CRUD</h1>
      <Input
        placeholder="Search by name"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: 16, width: 300 }}
      />
      <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} style={{ marginBottom: 16 }}>
        Add Student
      </Button>
      <Spin spinning={loading}>
        <Table
          dataSource={filteredStudents}
          columns={columns}
          rowKey="id"
        />
      </Spin>
      <Modal
        title={editingStudent ? 'Edit Student' : 'Add Student'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please input the name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="age"
            label="Age"
            rules={[
              { required: true, message: 'Please input the age!' },
              { type: 'number', min: 1, message: 'Age must be at least 1!' },
            ]}
          >
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {editingStudent ? 'Update' : 'Add'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdvancedCrud;
