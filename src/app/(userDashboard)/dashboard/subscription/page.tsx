/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import {
  Table,
  Tag,
  Typography,
  Spin,
  Alert,
  Button,
  Space,
  Tooltip,
} from 'antd';
import { SyncOutlined, DeleteOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import {
  useGetSubscriptionQuery,
  useDeleteSubscriptionMutation,
  useUpdateSubscriptionMutation,
} from '@/redux/service/admin/subscriptionPlan';
import { useRouter } from 'next/navigation';

const { Text } = Typography;

const SubscriptionsPage = () => {
  const router = useRouter();
  const { data, error, isLoading } = useGetSubscriptionQuery();
  const [deleteSubscription] = useDeleteSubscriptionMutation();
  const [updateSubscription] = useUpdateSubscriptionMutation();

  // Safely extract nested data
  const innerData = data?.data;
  const subscriptions = innerData?.data || [];
  const meta = innerData?.meta;
  const total = meta?.total || 0;

  // Handle delete with SweetAlert2
  // const handleDelete = async (id: string) => {
  //   const confirmResult = await Swal.fire({
  //     title: 'Are you sure?',
  //     text: "You won't be able to revert this!",
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#d33',
  //     cancelButtonColor: '#3085d6',
  //     confirmButtonText: 'Yes, delete it!',
  //     cancelButtonText: 'Cancel',
  //     reverseButtons: true,
  //     focusConfirm: false,
  //     focusCancel: false,
  //     width: 400,
  //   });

  //   if (!confirmResult.isConfirmed) return;

  //   try {
  //     const res = await deleteSubscription(id).unwrap();
  //     await Swal.fire({
  //       title: 'Deleted!',
  //       text: `Subscription ${id} has been deleted.`,
  //       icon: 'success',
  //       confirmButtonColor: '#3085d6',
  //       confirmButtonText: 'OK',
  //     });
  //   } catch (err) {
  //     const errorMessage =
  //       typeof err === 'object' && err !== null && 'message' in err
  //         ? (err as { message?: string }).message
  //         : 'Failed to delete subscription';

  //     await Swal.fire({
  //       title: 'Error!',
  //       text: errorMessage,
  //       icon: 'error',
  //       confirmButtonColor: '#d33',
  //       confirmButtonText: 'OK',
  //     });
  //   }
  // };

  // Handle renewal: show warning, then open Stripe URL in new tab
  const handleRenew = async (id: string) => {
    try {
      const result = await updateSubscription(id).unwrap();

      console.log(result);

//       {
//     "message": "Subscription Updated Successfully",
//     "success": true,
//     "meta": null,
//     "data": {
//         "renualURL": "https://billing.stripe.com/p/session/test_YWNjdF8xUmFLYzhHZjJBYzZac3dhLF9TeHNBRmx3RXNHZ1MyMXJkbGszcWRTZEdOTXpQUWdU0100oawS5qbb"
//     }
// }

 

      if (result.success && result.data?.renualURL) {
        // Show informative warning about JavaScript requirement
        const alertResult = await Swal.fire({
          title: '<strong>Stripe Renewal Page</strong>',
          html: `
            <div style="text-align: left; font-size: 14px;">
              <p>You're being redirected to Stripe to manage your subscription.</p>
              <strong style="color: #d33;">⚠️ JavaScript must be enabled</strong> in your browser,<br>
              otherwise the page will not load correctly.
            </div>
          `,
          icon: 'info',
          confirmButtonText: 'Proceed to Stripe',
          confirmButtonColor: '#1677ff',
          showCancelButton: true,
          cancelButtonText: 'Cancel',
          allowOutsideClick: true,
          width: 500,
        });

        if (!alertResult.isConfirmed) return;

        // Open Stripe billing session in a new tab
        window.open(result.data.renualURL, '_blank', 'noopener,noreferrer');
      } else {
        throw new Error('Renewal URL is missing in the response.');
      }
    } catch (err) {
      const errorMessage =
        typeof err === 'object' && err !== null && 'message' in err
          ? (err as { message?: string }).message
          : 'Failed to initiate renewal. Please try again.';

      await Swal.fire({
        title: 'Renewal Failed',
        text: errorMessage,
        icon: 'error',
        confirmButtonColor: '#d33',
        confirmButtonText: 'OK',
      });
    }
  };

  // Table columns
  const columns = [
    {
      title: 'Subscription ID',
      dataIndex: 'id',
      key: 'id',
      width: '20%',
      render: (text: string) => <code className="text-xs">{text}</code>,
    },
    {
      title: 'Plan ID',
      dataIndex: 'subscriptionPlanId',
      key: 'subscriptionPlanId',
      width: '15%',
      render: (text: string) => <code className="text-xs">{text}</code>,
    },
    {
      title: 'Owner ID',
      dataIndex: 'ownerId',
      key: 'ownerId',
      width: '15%',
      render: (text: string) => <code className="text-xs">{text}</code>,
    },
    {
      title: 'Status',
      dataIndex: 'subscriptionStatus',
      key: 'subscriptionStatus',
      width: '10%',
      render: (status: string) => (
        <Tag
          color={
            status === 'ACTIVE'
              ? 'green'
              : status === 'CANCELLED'
              ? 'volcano'
              : status === 'EXPIRED'
              ? 'orange'
              : 'default'
          }
        >
          {status}
        </Tag>
      ),
    },
    {
      title: 'Expires At',
      dataIndex: 'expiresAt',
      key: 'expiresAt',
      width: '12%',
      render: (text: string) =>
        new Date(text).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
    },
    {
      title: 'Cancel Requested',
      dataIndex: 'cancelRequest',
      key: 'cancelRequest',
      width: '8%',
      render: (requested: boolean) =>
        requested ? <Tag color="warning">Yes</Tag> : <Tag color="success">No</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '12%',
      render: (_: any, record: (typeof subscriptions)[0]) => (
        <Space size="middle">
          {/* Renew Button with Tooltip */}
          <Tooltip title="Opens Stripe billing page. Requires JavaScript enabled in your browser.">
            <Button
              type="primary"
              icon={<SyncOutlined />}
              size="small"
              onClick={() => handleRenew(record.id)}
            >
              Renew
            </Button>
          </Tooltip>

 
        </Space>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spin size="large" tip="Loading subscriptions..." />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description="Failed to load subscriptions. Please try again later."
        type="error"
        showIcon
        className="m-6"
      />
    );
  }

  return (
    <div className="p-6">
      {total === 0 ? (
        <Alert
          message="No Subscription Found"
          description="There are currently no active subscriptions."
          type="info"
          showIcon
          className="mb-6"
        />
      ) : (
        <div className="mb-4">
          <Text type="secondary">
            Showing <strong>{subscriptions.length}</strong> of <strong>{total}</strong> subscription(s)
          </Text>
        </div>
      )}

      <Table
        dataSource={subscriptions}
        columns={columns}
        rowKey="id"
        pagination={
          total > 10
            ? {
                current: meta?.page || 1,
                pageSize: meta?.limit || 10,
                total,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50'],
              }
            : false
        }
        locale={{ emptyText: 'No subscription found' }}
        scroll={{ x: 'max-content' }}
        bordered
        loading={isLoading}
      />
    </div>
  );
};

export default SubscriptionsPage;