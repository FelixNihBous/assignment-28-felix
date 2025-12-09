'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Table, Button, Modal, Form, Input, Popconfirm, InputNumber, message } from 'antd';
import { PlusOutlined, ReloadOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';

const AdvancedCrud = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Major', dataIndex: 'major', key: 'major' },
    { title: 'Class', dataIndex: 'class_name', key: 'class_name' },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this student?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger>
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/students', { cache: 'no-store' });
      if (!response.ok) throw new Error('Failed to fetch students');
      const data = await response.json();
      const studentsData = data.body?.data || data;
      setStudents(studentsData);
      setFilteredStudents(studentsData);
      console.log('Student data refreshed.');
    } catch (error) {
      console.error('Fetch Error:', error);
      messageApi.error('Failed to load student data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (selectedStudent) {
      form.setFieldsValue({
        name: selectedStudent.name,
        major: selectedStudent.major,
        class_name: selectedStudent.class_name,
      });
    }
  }, [selectedStudent, form]);

  useEffect(() => {
    const filtered = students.filter(student =>
      student.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [searchText, students]);

  const handlePostStudent = async (values) => {
    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        messageApi.error(errorData.message || 'Failed to add student');
        return;
      }

      console.log('Student added successfully!');
      setIsModalVisible(false);
      messageApi.success('Student added successfully!');
      setSelectedStudent(null);
      form.resetFields();
      fetchStudents();
    } catch (error) {
      console.error('POST Error:', error);
      messageApi.error('An unexpected error occurred while adding the student.');
    }
  };

  const handleUpdateStudent = async (values) => {
    try {
      const payload = {
        name: values.name,
        major: values.major,
        class_name: values.class_name,
      };
      const response = await fetch(`/api/students/${selectedStudent.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        messageApi.error(errorData.message || 'Failed to update student');
        return;
      }

      console.log('Student updated successfully!');
      messageApi.success('Student updated successfully!');
      setIsModalVisible(false);
      setSelectedStudent(null);
      form.resetFields();
      fetchStudents(); // Refresh after update
    } catch (error) {
      console.error('PUT Error:', error);
      messageApi.error('An unexpected error occurred while updating the student.');
    }
  };

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/students/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        messageApi.error(errorData.message || 'Failed to delete student');
        return;
      }

      console.log('Student deleted successfully!');
      messageApi.success('Deleted Successfully');
      fetchStudents();
    } catch (error) {
      console.error('DELETE Error:', error);
      messageApi.error('An unexpected error occurred while deleting the student.');
    }
  };

  return (
    <>
      {contextHolder}
      <div style={{ padding: 24 }}>
        <h1>👨‍🎓 Student Management (App Router API Test)</h1>
        <div style={{ marginBottom: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
          <Input
            placeholder="Search by name"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 200 }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
          >
            Add New Student
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchStudents}
            loading={loading}
          >
            Refresh Data
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={filteredStudents}
          rowKey="id"
          loading={loading}
          pagination={false}
          bordered
        />

        <Modal
          title={selectedStudent ? "Edit Student" : "Add New Student"}
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            setSelectedStudent(null);
            form.resetFields();
          }}
          footer={null}
          destroyOnHidden={true}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={selectedStudent ? handleUpdateStudent : handlePostStudent}
            autoComplete="off"
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: 'Please input the student name!', type: 'string'  }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Major"
              name="major"
              rules={[{ required: true, message: 'Please input the student major!', type: 'string' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Class"
              name="class"
              rules={[{ required: true, message: 'Please input the student class!', type: 'string' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                {selectedStudent ? "Update Student" : "Add Student"}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default AdvancedCrud;
