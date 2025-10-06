/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Trash2 } from "lucide-react";
import { debounce } from "lodash";
import { useEffect, useMemo, useState } from "react";

// Ant Design
import {
  Modal,
  Form,
  Input as AntInput,
  InputNumber,
  Button as AntButton,
  message,
  Select,
  Spin,
  FormListFieldData,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";

// RTK Query
import {
  useGetSubscriptionPlanQuery,
  useCreateSubscriptionPlanMutation,

  SubscriptionPlan,
  CreateSubscriptionPlanRequest,
  useUpdateSubscriptionPlanMutation,
  useDeleteSubscriptionPlanMutation,
  UpdateSubscriptionPlanRequest,
} from "@/redux/service/admin/subscriptionPlan";
import Swal from "sweetalert2";
import { toast } from "sonner";

export default function Subscription() {
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchText);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [form] = Form.useForm();

  // RTK Query hooks
  const {  data: subscriptionData, isError, isLoading: isPlansLoading } = useGetSubscriptionPlanQuery({
    page: currentPage,
    limit: pageSize,
    name: debouncedSearch || undefined,
  });



//   {
//     "message": "Subscription Plan Found Successfully",
//     "success": true,
//     "meta": null,
//     "data": {
//         "meta": {
//             "page": 1,
//             "limit": 10,
//             "total": 1,
//             "totalPage": 1
//         },
//         "data": [
//             {
//                 "id": "68a207e403c6043359824939",
//                 "plan": "PRO_PLAN",
//                 "name": "Pro Monthly Plan",
//                 "description": "Access all premium features including analytics, priority support, and unlimited usage.",
//                 "featuresList": [
//                     "Unlimited usage",
//                     "Priority support",
//                     "Advanced analytics",
//                     "Team collaboration"
//                 ],
//                 "trialPeriod": false,
//                 "price": 50.99,
//                 "stripeProductId": "prod_Ssvc3nGv3eXMHQ",
//                 "stripePriceId": "price_1Rx9l5Gf2Ac6ZswaRay8FYyB",
//                 "createdAt": "2025-08-17T16:48:36.561Z",
//                 "updatedAt": "2025-08-17T16:48:37.684Z"
//             }
//         ]
//     }
// }





  const [createSubscriptionPlan] = useCreateSubscriptionPlanMutation();
  const [updateSubscriptionPlan] = useUpdateSubscriptionPlanMutation();


  // for update the body acccept 

//   {
//   "stripePriceId":"price_1RtbWdGf2Ac6ZswahPSzY2Kn",
//   "plan": "ELITE_PLAN",
//   "name": "Pro Monthly Plan",
//   "description": "Access all premium features including analytics, priority support, and unlimited usage.",
//   "featuresList": [
//     "Unlimited usage",
//     "Priority support",
//     "Advanced analytics",
//     "Team collaboration"
//   ],
//   "trialPeriod": true,
//   "price": 50.99
// }

// stripePriceId will be found on from response data ..for update the body accept

  const [deleteSubscriptionPlan] = useDeleteSubscriptionPlanMutation();



const handleDelete = async (id: string) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
    reverseButtons: true,
    background: "#fff",
    customClass: {
      popup: "rounded-lg shadow-xl",
      confirmButton: "focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
      cancelButton: "focus:ring-2 focus:ring-offset-2 focus:ring-gray-500",
    },
  });

  if (result.isConfirmed) {
    try {
 const res =     await deleteSubscriptionPlan(id).unwrap();
      Swal.fire({
        title: "Deleted!",
        text: "The subscription plan has been deleted.",
        icon: "success",
        background: "#fff",
      });
      message.success(res?.message || "Subscription plan deleted successfully.");
    } catch (error: any) {
      const errorMsg = error?.data?.message || error?.message || "Failed to delete plan.";
      Swal.fire({
        title: "Error!",
        text: errorMsg,
        icon: "error",
        background: "#fff",
      });
      message.error(errorMsg);
    }
  }
};

  // Extract data
  const plans: SubscriptionPlan[] = subscriptionData?.data?.data || [];
  const total = subscriptionData?.data?.meta?.total || 0;
  const totalPages = Math.ceil(total / pageSize);

  // Debounce search
  const debouncedSetSearch = useMemo(
    () => debounce((value: string) => {
      setDebouncedSearch(value);
      setCurrentPage(1);
    }, 500),
    []
  );

  useEffect(() => {
    debouncedSetSearch(searchText);
  }, [searchText, debouncedSetSearch]);

  // Reset form when modal closes
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPlan(null);
    form.resetFields();
  };

  // Handle Add New Plan
//   const handleAddSubscription = async (values: any) => {
//     const payload: CreateSubscriptionPlanRequest = {
//       plan: values.plan.trim(),
//       name: values.name.trim(),
//       description: values.description.trim(),
//       featuresList: values.featuresList
//         .map((f: string) => f.trim())
//         .filter((f: string) => f),
//       price: parseFloat(values.price),
//       trialPeriod: false,
//     };

//     try {
//     const res =  await createSubscriptionPlan(payload).unwrap();
// if(res.success){
//   toast.success(res?.message || "Plan created successfully.");
// }else{
//   toast.error(res?.message || "Failed to create plan.");
// }
//       closeModal();
//     } catch (error: any) {
//       const errorMsg = error.data?.message || "Failed to create plan";
//       toast.error(errorMsg);
//     }
//   };

  // Handle Edit Existing Plan
const handleAddOrEditSubscription = async (values: any) => {
  try {
    if (editingPlan) {
      // ✅ use backend stripePriceId (not editable in form)
      const payload: UpdateSubscriptionPlanRequest = {
        plan: values.plan.trim(),
        name: values.name.trim(),
        description: values.description.trim(),
        featuresList: values.featuresList.map((f: string) => f.trim()).filter(Boolean),
        price: parseFloat(values.price),
        trialPeriod: values.trialPeriod ?? false,
        stripePriceId: editingPlan.stripePriceId, // always from backend
      };

   const res =  await updateSubscriptionPlan({ id: editingPlan.id, body: payload }).unwrap();
   if(res.success){
toast.success(res?.message || "Plan updated successfully.");
   }else{
toast.error(res?.message || "Failed to update plan.");
closeModal();
   }
      message.success("Plan updated successfully!");
    } else {
      const payload: CreateSubscriptionPlanRequest = {
        plan: values.plan.trim(),
        name: values.name.trim(),
        description: values.description.trim(),
        featuresList: values.featuresList.map((f: string) => f.trim()).filter(Boolean),
        price: parseFloat(values.price),
        trialPeriod: values.trialPeriod ?? false,
      };

      await createSubscriptionPlan(payload).unwrap();
      message.success("Plan created successfully!");
    }

    closeModal();
  } catch (error: any) {
    message.error(error?.data?.message || "Failed to save plan");
  }
};


  // Handle opening edit modal
  const openEditModal = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setIsModalOpen(true);
    form.setFieldsValue({
      plan: plan.plan,
      name: plan.name,
      description: plan.description,
      featuresList: plan.featuresList,
      price: plan.price,
    });
  };

  // Trial badge class
  const trialBadgeClass = (hasTrial: boolean) =>
    `px-2 py-1 rounded-full text-xs font-medium ${
      hasTrial ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
    }`;

  return (
    <div className="bg-white w-full">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b">
        <h2 className="text-xl font-semibold text-gray-900">Subscription Plans</h2>
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search plans by name..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-10 w-64 border-gray-200 focus-visible:ring-slate-500"
            />
          </div>

          {/* Add Plan Button */}
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded-md flex items-center gap-1"
          >
            + Add Plan
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-700 hover:bg-slate-700">
              <TableHead className="text-white font-medium">Plan Code</TableHead>
              <TableHead className="text-white font-medium">Name</TableHead>
              <TableHead className="text-white font-medium">Description</TableHead>
              <TableHead className="text-white font-medium">Features</TableHead>
              <TableHead className="text-white font-medium">Trial</TableHead>
              <TableHead className="text-white font-medium">Price ($)</TableHead>
              <TableHead className="text-white font-medium">Created At</TableHead>
              <TableHead className="text-white font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPlansLoading && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10">
                  <Spin size="small" />
                </TableCell>
              </TableRow>
            )}

            {isError && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-red-500">
                  Failed to load plans.
                </TableCell>
              </TableRow>
            )}

            {!isPlansLoading && !isError && plans.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-gray-500">
                  No subscription plans found.
                </TableCell>
              </TableRow>
            )}

            {!isPlansLoading &&
              !isError &&
              plans.map((plan) => (
                <TableRow key={plan.id} className="hover:bg-gray-50">
                  <TableCell className="font-mono text-sm text-gray-700 truncate" title={plan.plan}>
                    {plan.plan}
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">{plan.name}</TableCell>
                  <TableCell
                    className="text-gray-600 max-w-xs truncate"
                    title={plan.description}
                  >
                    {plan.description}
                  </TableCell>
                  <TableCell className="text-gray-700 max-w-xs">
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {plan.featuresList.slice(0, 3).map((f, i) => (
                        <li key={i} className="truncate" title={f}>
                          {f}
                        </li>
                      ))}
                      {plan.featuresList.length > 3 && (
                        <li className="text-xs text-gray-500">+{plan.featuresList.length - 3} more</li>
                      )}
                    </ul>
                  </TableCell>
                  <TableCell>
                    <span className={trialBadgeClass(plan.trialPeriod)}>
                      {plan.trialPeriod ? "Yes" : "No"}
                    </span>
                  </TableCell>
                  <TableCell className="font-semibold">${plan.price.toFixed(2)}</TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {new Date(plan.createdAt).toLocaleDateString("en-US", {
                      year: "2-digit",
                      month: "short",
                      day: "2-digit",
                    })}
                  </TableCell>
                  <TableCell>
                    <AntButton
                      type="link"
                      size="small"
                      onClick={() => openEditModal(plan)} 
                    >
                      Edit
                    </AntButton>
                    <AntButton
                      type="link"
                      size="small"
                      onClick={() => handleDelete(plan.id)}
                    >
                <Trash2 className="mr-2 h-4 w-4 text-red-500"  />
                    </AntButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center py-6 border-t bg-gray-50">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1 || isPlansLoading}
            className="w-8 h-8"
          >
            ‹
          </Button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const startPage = Math.max(1, currentPage - 2);
            const pageNum = startPage + i;
            if (pageNum > totalPages) return null;
            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? "default" : "ghost"}
                size="icon"
                className={`w-8 h-8 ${
                  currentPage === pageNum
                    ? "bg-slate-700 text-white hover:bg-slate-800"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </Button>
            );
          })}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage >= totalPages || isPlansLoading}
            className="w-8 h-8"
          >
            ›
          </Button>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        title={editingPlan ? "Edit Subscription Plan" : "Add New Subscription Plan"}
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddOrEditSubscription}
        >
          {/* Plan Code */}
          <Form.Item
            name="plan"
            label="Plan Code"
            rules={[{ required: true, message: "Please select a plan code" }]}
          >
            <Select disabled={!!editingPlan}>
              <Select.Option value="PRO_PLAN">PRO_PLAN</Select.Option>
              <Select.Option value="ELITE_PLAN">ELITE_PLAN</Select.Option>
            </Select>
          </Form.Item>

          {/* Plan Name */}
          <Form.Item
            name="name"
            label="Plan Name"
            rules={[{ required: true, message: "Required" }]}
          >
            <AntInput placeholder="e.g. Pro Monthly Plan" />
          </Form.Item>

          {/* Description */}
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Required" }]}
          >
            <AntInput.TextArea rows={3} placeholder="Describe the plan" />
          </Form.Item>

          {/* Features (Dynamic List) */}
          <Form.Item label="Features" required>
            <Form.List name="featuresList">
              {(fields, { add, remove }) => (
                <div className="space-y-2">
                  {fields.map(({ key, name, ...restField }) => (
                    <div key={key} className="flex items-center gap-2 w-full">
                      <Form.Item
                        {...restField}
                        name={name}
                        rules={[{ required: true, message: "Feature is required" }]}
                        className="flex-1 mb-0"
                      >
                        <AntInput
                          placeholder="Enter feature (e.g. Unlimited usage)"
                          className="rounded-lg"
                        />
                      </Form.Item>
                      <AntButton
                        type="default"
                        danger
                        onClick={() => remove(name)}
                        className="h-10 px-2"
                      >
                        −
                      </AntButton>
                    </div>
                  ))}

                  <AntButton
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Feature
                  </AntButton>
                </div>
              )}
            </Form.List>
          </Form.Item>

          {/* Price */}
          <Form.Item
            name="price"
            label="Price ($)"
            rules={[{ required: true, message: "Required" }]}
          >
            <InputNumber
              min={0}
              step={0.01}
              placeholder="99.99"
              className="w-full"
            />
          </Form.Item>

          {/* Actions */}
          <div className="text-right mt-6">
            <AntButton onClick={closeModal} className="mr-2">
              Cancel
            </AntButton>
            <AntButton type="primary" htmlType="submit">
              {editingPlan ? "Save Changes" : "Add Plan"}
            </AntButton>
          </div>
        </Form>
      </Modal>
    </div>
  );
}