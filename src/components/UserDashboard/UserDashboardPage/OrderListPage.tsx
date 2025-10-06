/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Table,
  Tag,
  Space,
  Typography,
  Button,
  Modal,
  Card,
  Row,
  Col,
  Statistic,
  Tooltip,
  Input,
  Select,
  DatePicker,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  FilterOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useDeleteTaskManagementMutation, useGetPrivateTasksQuery } from "@/redux/service/admin/taskManagemant";
import { format, differenceInDays } from "date-fns";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import UpdateTaskModal from "./EditTaskModal";


const { Text, Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

// Define Task type (must match modal)
export interface Task {
  id: string;
  title: string;
  taskType: "CASH" | "PAYMENT";
  location?: string;
  min_salary: number;
  max_salary: number;
  require_skills: string[];
  description: string;
  deadline: string;
  tags: string[];
  categoryid: string;
  subcategoryid?: string;
  uploadedFileUrl?: string;
  status: string;
  createdAt: string;
}

export default function OrderListPage() {
  // ✅ Destructure refetch to refresh after edit/delete
  const { data: privateTaskData, isLoading, isError, refetch } = useGetPrivateTasksQuery({});
  const [deleteTask] = useDeleteTaskManagementMutation();

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState<any>(null);

  // 🔁 Modal States
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null); // ✅ Store full task
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const tasks: Task[] = (privateTaskData?.data?.data || []).map((item: any) => ({
    ...item,
    taskType: item.taskType === "CASH" ? "CASH" : item.taskType === "PAYMENT" ? "PAYMENT" : "CASH", // fallback to "CASH" if not valid
  }));
  const total = privateTaskData?.data?.meta?.total || tasks.length;

  // Show delete confirmation
  const showDeleteConfirm = (id: string) => {
    setDeletingId(id);
    setIsDeleteModalVisible(true);
  };

  // Handle delete
  const handleDeleteConfirm = async () => {
    if (!deletingId) return;

    try {
      const result = await deleteTask(deletingId).unwrap();
      if (result.success) {
        toast.success(result.message || "Task deleted successfully!");
        refetch(); // ✅ Refresh task list
      } else {
        toast.error(result.message || "Failed to delete task.");
      }
    } catch (error: any) {
      console.error("❌ Delete failed:", error);
      toast.error(error?.data?.message || "Failed to delete task.");
    } finally {
      setIsDeleteModalVisible(false);
      setDeletingId(null);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
    setDeletingId(null);
  };

  // Status mapping
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "ORDER_ACTIVE":
        return { color: "green", text: "Active" };
      case "ORDER_INACTIVE":
        return { color: "volcano", text: "Inactive" };
      case "EXPIRED":
        return { color: "gray", text: "Expired" };
      default:
        return { color: "default", text: "Unknown" };
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchText.toLowerCase()) ||
      task.id.toLowerCase().includes(searchText.toLowerCase());

    const matchesStatus = statusFilter === "all" || task.status === statusFilter;

    let matchesDate = true;
    if (dateRange && dateRange.length === 2) {
      const taskDate = new Date(task.createdAt);
      matchesDate = taskDate >= dateRange[0] && taskDate <= dateRange[1];
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Stats
  const activeTasks = filteredTasks.filter((t) => t.status === "ORDER_ACTIVE").length;
  const inactiveTasks = filteredTasks.filter((t) => t.status === "ORDER_INACTIVE").length;
  const expiredTasks = filteredTasks.filter((t) => t.status === "EXPIRED").length;

  // Columns
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: 200,
      fixed: "left" as const,
      render: (text: string, record: Task) => (
        <Link href={`/dashboard/tasks/${record.id}`}>
          <Text strong className="text-blue-600 hover:underline cursor-pointer">
            {text}
          </Text>
        </Link>
      ),
    },
    {
      title: "Task ID",
      dataIndex: "id",
      key: "id",
      width: 120,
      render: (id: string) => (
        <Tooltip title={id}>
          <Text type="secondary" className="font-mono text-xs">
            {id.slice(0, 8)}...
          </Text>
        </Tooltip>
      ),
    },
    {
      title: "Posted Date",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      sorter: (a: Task, b: Task) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (date: string) => (
        <Tooltip title={format(new Date(date), "PPpp")}>
          {format(new Date(date), "PP")}
        </Tooltip>
      ),
    },
    {
      title: "Deadline",
      dataIndex: "deadline",
      key: "deadline",
      width: 150,
      sorter: (a: Task, b: Task) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime(),
      render: (date: string) => {
        if (!date) return "N/A";
        const daysLeft = differenceInDays(new Date(date), new Date());
        const isExpired = daysLeft < 0;
        const isUrgent = daysLeft >= 0 && daysLeft < 3;

        return (
          <Tooltip title={`${daysLeft} days ${isExpired ? 'overdue' : 'left'}`}>
            <span className={isExpired ? "text-gray-400 line-through" : isUrgent ? "text-red-500 font-medium" : ""}>
              {format(new Date(date), "PP")}
            </span>
          </Tooltip>
        );
      },
    },
    {
      title: "Budget",
      key: "budget",
      width: 150,
      sorter: (a: Task, b: Task) => (a.min_salary + a.max_salary) - (b.min_salary + b.max_salary),
      render: (_: any, task: Task) => (
        <Text className="font-medium">
          ${task.min_salary?.toFixed(2)} - ${task.max_salary?.toFixed(2)}
        </Text>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      filters: [
        { text: 'Active', value: 'ORDER_ACTIVE' },
        { text: 'Inactive', value: 'ORDER_INACTIVE' },
        { text: 'Expired', value: 'EXPIRED' },
      ],
      onFilter: (value: any, record: Task) => record.status === value,
      render: (status: string) => {
        const { color, text } = getStatusConfig(status);
        return <Tag color={color} className="px-2 py-1 rounded-md">{text}</Tag>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      fixed: "right" as const,
      render: (_: any, task: Task) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Link href={`/all-services/${task.id}`}>
              <Button type="text" icon={<EyeOutlined />} size="small" />
            </Link>
          </Tooltip>

          {/* ✏️ Edit Button */}
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              size="small"
              onClick={() => {
                setEditingTask(task); // ✅ Pass full task object
                setIsEditModalOpen(true);
              }}
            />
          </Tooltip>

          {/* 🗑️ Delete Button */}
          <Tooltip title="Delete">
            <Button
              type="text"
              icon={<DeleteOutlined />}
              size="small"
              danger
              onClick={() => showDeleteConfirm(task.id)}
              loading={deletingId === task.id}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  if (isError) {
    return (
      <div className="p-5 text-center">
        <Title level={4} className="text-red-600">Failed to load tasks</Title>
        <Text type="secondary">Please try again later.</Text>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 bg-gray-50 min-h-screen">
      <Title level={2} className="!mb-2">Task Management</Title>
      <Text type="secondary">Manage your posted tasks and track their status</Text>

      {/* Statistics */}
      <Row gutter={16} className="my-6">
        <Col span={6}>
          <Card><Statistic title="Total Tasks" value={total} valueStyle={{ color: '#3f8600' }} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="Active Tasks" value={activeTasks} valueStyle={{ color: '#1890ff' }} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="Inactive Tasks" value={inactiveTasks} valueStyle={{ color: '#faad14' }} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="Expired Tasks" value={expiredTasks} valueStyle={{ color: '#cf1322' }} /></Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <Text strong>Search</Text>
            <Input
              placeholder="Search by title or ID..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </div>
          <div className="w-[160px]">
            <Text strong>Status</Text>
            <Select value={statusFilter} onChange={setStatusFilter} className="w-full" suffixIcon={<FilterOutlined />}>
              <Option value="all">All</Option>
              <Option value="ORDER_ACTIVE">Active</Option>
              <Option value="ORDER_INACTIVE">Inactive</Option>
              <Option value="EXPIRED">Expired</Option>
            </Select>
          </div>
          <div className="w-[250px]">
            <Text strong>Date Range</Text>
            <RangePicker className="w-full" onChange={setDateRange} value={dateRange} />
          </div>
          <Button onClick={() => { setSearchText(""); setStatusFilter("all"); setDateRange(null); }}>
            Clear Filters
          </Button>
        </div>
      </Card>

      {/* Table */}
      <Card
        title={`Task List (${filteredTasks.length} of ${total} tasks)`}
        extra={<Button type="primary"><Link href="/post-task">New Task</Link></Button>}
        className="shadow-md rounded-lg"
      >
        <Table
          columns={columns}
          dataSource={filteredTasks.map(task => ({ ...task, key: task.id }))}
          loading={isLoading}
          pagination={{
            total: filteredTasks.length,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} tasks`,
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "20", "50"],
          }}
          scroll={{ x: 1000 }}
          bordered
          size="middle"
        />
      </Card>

      {/* Delete Modal */}
      <Modal
        title={
          <Space><ExclamationCircleOutlined className="text-red-500" /> Confirm Delete</Space>
        }
        open={isDeleteModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        okButtonProps={{ danger: true, loading: deletingId !== null }}
        okText="Delete"
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete this task? This action cannot be undone.</p>
      </Modal>

      {/* ✅ Edit Task Modal */}
      {isEditModalOpen && editingTask && (
        <UpdateTaskModal
          open={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingTask(null);
          }}
          task={editingTask}
          onSuccess={() => {
            refetch(); // ✅ Refresh list after update
            toast.success("Task updated successfully!");
          }}
        />
      )}

      {/* Styles */}
      <style jsx global>{`
        .ant-table-thead > tr > th {
          background-color: #fafafa;
          font-weight: 600;
        }
        .ant-table-tbody > tr:hover td {
          background-color: #f5f5f5 !important;
        }
      `}</style>
    </div>
  );
}