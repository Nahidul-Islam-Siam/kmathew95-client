// "use client";

// import Image from "next/image";
// import { useParams } from "next/navigation";
// import { Download } from "lucide-react";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { useGetTaskManagementByIdQuery } from "@/redux/service/admin/taskManagemant";
// import { Skeleton } from "@/components/ui/skeleton";
// import img from "@/assets/CardImage/image 2.png";

// export default function ServicesDetailsPage() {
//   const params = useParams(); 
//   const id = Array.isArray(params.id) ? params.id[0] : params.id; // Safe string access

//   const { data, isLoading, error } = useGetTaskManagementByIdQuery({id});

//   const task = data?.data; // ✅ Real task data

//   if (isLoading) {
//     return <ServiceDetailSkeleton />;
//   }

//   if (error || !task) {
//     return (
//       <div className="text-center py-10">
//         <p className="text-red-500">Failed to load task details.</p>
//       </div>
//     );
//   }

//   // Derived values
//   const formattedSalary = `$${task.min_salary} - $${task.max_salary}`;
//   const attachments = task.files?.length > 0 ? task.files : [];

//   const handleDownload = (url: string, filename = "attachment") => {
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = filename;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//     <div className="min-h-screen container mx-auto px-4 my-8">
//       {/* Header Card */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200">
//         <div className="flex flex-col md:flex-row gap-4">
//           <div className="w-full md:h-full md:w-72 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
//             <Image
//               src={img}
//               alt={task.title}
//               width={600}
//               height={600}
//               className="rounded-lg object-cover"
//             />
//           </div>
//           <div className="flex-1 min-w-0 p-4">
//             <div className="flex flex-wrap items-start justify-between mb-2 gap-2">
//               {task.tags.map((tag) => (
//                 <span
//                   key={tag}
//                   className="px-2 py-1 bg-orange-100 text-orange-600 text-xs rounded-full"
//                 >
//                   {tag}
//                 </span>
//               ))}
//               <span className="px-3 py-1 bg-blue-900 text-white text-xs rounded-full">
//                 {task.taskType}
//               </span>
//             </div>
//             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between my-2">
//               <h3 className="font-medium text-gray-900 mb-3 line-clamp-2">{task.title}</h3>
//               <h2 className="text-xs text-gray-500">
//                 Posted on {new Date(task.createdAt).toLocaleDateString()}
//               </h2>
//             </div>
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-1">
//                 <span className="text-orange-500">★</span>
//                 <span className="font-semibold text-gray-900">{formattedSalary}</span>
//               </div>
//               <Button
//                 size="sm"
//                 className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-3 py-1 rounded-full"
//                 onClick={() => alert("Hire Now clicked")}
//               >
//                 Hire Now
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Job Description & Order */}
//       <div className="flex flex-col lg:flex-row gap-8 my-10">
//         <div className="w-full lg:w-2/3">
//           <h2 className="text-2xl font-semibold text-gray-900 mb-4">Job Description</h2>
//           <p className="text-gray-700 leading-relaxed mb-6">{task.description}</p>

//           {/* Attached Files */}
//           {attachments.length > 0 && (
//             <div className="py-6">
//               <h2 className="text-xl font-semibold text-gray-900 mb-4">Attached Files</h2>
//               <div className="space-y-3">
//                 {attachments.map((fileUrl, index) => {
//                   const fileName = fileUrl.split("/").pop() || `Attachment ${index + 1}`;
//                   const fileExt = fileName.split(".").pop()?.toUpperCase() || "FILE";

//                   return (
//                     <div
//                       key={index}
//                       className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-100"
//                     >
//                       <div className="flex flex-col">
//                         <span className="text-sm font-medium text-gray-700">{fileName}</span>
//                         <span className="text-xs text-gray-500 uppercase">{fileExt}</span>
//                       </div>
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => handleDownload(fileUrl, fileName)}
//                         className="text-orange-600 hover:text-orange-700 hover:bg-orange-100"
//                       >
//                         <Download className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Order Summary */}
//         <div className="w-full max-w-md mx-auto lg:mx-0 bg-white p-6 border border-gray-200 rounded-xl shadow-sm">
//           <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
//           <div className="flex items-start gap-4 pb-6 border-b border-gray-200">
//             <div className="w-16 h-16 bg-gray-900 rounded flex-shrink-0 flex items-center justify-center">
//               <div className="w-8 h-8 border-2 border-orange-400 rounded-full flex items-center justify-center">
//                 <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
//               </div>
//             </div>
//             <div className="flex-1 min-w-0">
//               <div className="flex justify-between items-start">
//                 <h3 className="text-sm font-medium text-gray-900 leading-tight">{task.title}</h3>
//                 <span className="text-lg font-semibold text-gray-900 ml-4">{formattedSalary}</span>
//               </div>
//               <p className="text-sm text-gray-500 mt-2">{task.location}</p>
//             </div>
//           </div>

//           <div className="py-6 border-b border-gray-200 flex gap-3">
//             <Input
//               placeholder="Enter your bid"
//               type="number"
//               className="flex-1 h-10 text-sm border-gray-300 focus:border-gray-400 focus:ring-0"
//             />
//             <Button
//               variant="outline"
//               className="px-6 h-10 text-sm border-gray-300 hover:bg-gray-50"
//             >
//               Apply
//             </Button>
//           </div>

//           <div className="py-6 space-y-3 border-b border-gray-200">
//             <div className="flex justify-between text-sm">
//               <span>Total</span>
//               <span>{formattedSalary}</span>
//             </div>
//             <div className="flex justify-between text-sm">
//               <span>Platform Charge</span>
//               <span>$7.24</span>
//             </div>
//             <div className="flex justify-between text-sm">
//               <span>Tax</span>
//               <span>$7.24</span>
//             </div>
//           </div>

//           <div className="py-6">
//             <div className="flex justify-between items-center mb-6">
//               <span className="text-2xl font-semibold text-gray-900">Total</span>
//               <span className="text-2xl font-semibold text-gray-900">$59.28</span>
//             </div>
//             <Button
//               className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-medium text-base rounded-md"
//               onClick={() => alert("Task Requested")}
//             >
//               Request Task
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Similar Jobs - Mocked for now */}
//       <div className="mb-20">
//         <h2 className="text-2xl font-semibold text-gray-900 mb-4">Similar Jobs</h2>
//         <div className="grid grid-cols-1 gap-6">
//           {[1, 2].map((_, i) => (
//             <div
//               key={i}
//               className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
//             >
//               <div className="flex gap-4 p-4">
//                 <div className="w-40 md:w-72 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
//                   <Image src={img} alt="Similar job" width={60} height={60} className="rounded-lg" />
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <div className="flex gap-2 flex-wrap mb-2">
//                     <span className="px-2 py-1 bg-orange-100 text-orange-600 text-xs rounded-full">
//                       Popular
//                     </span>
//                   </div>
//                   <div className="flex items-center justify-between my-2">
//                     <h3 className="font-medium text-gray-900 line-clamp-2">
//                       {task.title.length > 30 ? `${task.title.slice(0, 30)}...` : task.title}
//                     </h3>
//                     <h2 className="text-xs text-gray-500">2 day / $4.00</h2>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-1">
//                       <span className="text-orange-500">★</span>
//                       <span className="font-semibold text-gray-900">{formattedSalary}</span>
//                     </div>
//                     <Link href={`/all-services/${task.id}`}>
//                       <Button className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-3 py-1 rounded-full">
//                         View Details
//                       </Button>
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// // Skeleton Loader
// function ServiceDetailSkeleton() {
//   return (
//     <div className="container mx-auto px-4 my-8 space-y-6">
//       <div className="bg-white rounded-xl border shadow-sm">
//         <div className="flex flex-col md:flex-row gap-4 p-4">
//           <div className="w-full md:w-72 h-48 md:h-full bg-gray-200 rounded-lg"></div>
//           <div className="flex-1 space-y-3">
//             <div className="flex gap-2 flex-wrap">
//               <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
//             </div>
//             <div className="h-6 w-64 bg-gray-200 rounded"></div>
//             <div className="h-8 w-32 bg-orange-200 rounded-full"></div>
//           </div>
//         </div>
//       </div>

//       <div className="flex flex-col lg:flex-row gap-8">
//         <div className="w-full lg:w-2/3 space-y-4">
//           <div className="h-8 w-64 bg-gray-200 rounded"></div>
//           <div className="h-4 w-full bg-gray-200 rounded"></div>
//           <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
//         </div>
//         <div className="w-full max-w-md bg-white p-6 border rounded-xl">
//           <div className="space-y-4">
//             {[1, 2, 3].map(i => (
//               <div key={i} className="h-16 bg-gray-100 rounded"></div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }