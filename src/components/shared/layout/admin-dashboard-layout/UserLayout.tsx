// "use client";

// import {
//   DashboardOutlined,
//   TruckOutlined,
//   TeamOutlined,
//   UserOutlined,
//   FileTextOutlined,
//   CreditCardOutlined,
//   StarOutlined,
//   SettingOutlined,
//   LogoutOutlined,
// } from "@ant-design/icons";
// import { Layout, Menu } from "antd";
// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import { useState } from "react";

// const { Sider, Content, Header } = Layout;

// const UserSidebarLayout = ({ children }: { children: React.ReactNode }) => {
//   const [collapsed, setCollapsed] = useState(false);
//   const pathname = usePathname();
//   const router = useRouter();

//   const handleLogout = () => {
//     console.log("Dummy logout triggered");
//     // Place your logout logic or dispatch here
//     router.push("/login"); // redirect to login for now
//   };

//   const handleMenuClick = ({ key }: { key: string }) => {
//     if (key === "logout") {
//       handleLogout();
//     } else {
//       router.push(key);
//     }
//   };

//   const menuItems = [
//     {
//       key: "/dashboard",
//       icon: <DashboardOutlined />,
//       label: "Dashboards",
//     },
//     {
//       key: "/dashboard/shipments",
//       icon: <TruckOutlined />,
//       label: "Shipments",
//     },
//     {
//       key: "/dashboard/service-providers",
//       icon: <TeamOutlined />,
//       label: "Service Providers",
//     },
//     {
//       key: "/dashboard/users",
//       icon: <UserOutlined />,
//       label: "Users",
//     },
//     {
//       key: "/dashboard/logs",
//       icon: <FileTextOutlined />,
//       label: "Logs",
//     },
//     {
//       key: "/dashboard/payment",
//       icon: <CreditCardOutlined />,
//       label: "Payment",
//     },
//     {
//       key: "/dashboard/reviews",
//       icon: <StarOutlined />,
//       label: "Reviews",
//     },
//     {
//       key: "/dashboard/setting",
//       icon: <SettingOutlined />,
//       label: "Setting",
//     },
//   ];

//   return (
//     <Layout style={{ minHeight: "100vh" }}>
//       {/* Sidebar */}
//       <Sider
//         collapsible
//         collapsed={collapsed}
//         trigger={null}
//         width={240}
//         style={{
//           background: "#fff",
//           boxShadow: "2px 0 5px rgba(0,0,0,0.06)",
//           display: "flex",
//           flexDirection: "column",
//         }}
//       >
//         {/* Logo & Collapse Toggle */}
//         <div
//           className="flex items-center justify-between px-4 py-4 border-b"
//           style={{ height: 64 }}
//         >
//           {!collapsed && (
//             <Link href="/">
//               <span className="text-xl font-bold text-[#092c4c] cursor-pointer">
//                 Barrel<span className="text-orange-500">Link</span>
//               </span>
//             </Link>
//           )}
//           <span
//             className="text-[#FA8800] text-xl cursor-pointer"
//             onClick={() => setCollapsed(!collapsed)}
//           >
//             »
//           </span>
//         </div>

//         {/* Menu */}
//         <Menu
//           mode="inline"
//           selectedKeys={[pathname ?? ""]}
//           onClick={handleMenuClick}
//           style={{
//             borderRight: 0,
//             paddingTop: 12,
//             fontSize: 15,
//             fontWeight: 500,
//           }}
//           items={menuItems}
//           rootClassName="custom-menu"
//         />

//         {/* Logout */}
//         <div className="p-4 absolute bottom-10">
//           <div
//             onClick={handleLogout}
//             className="flex items-center gap-2 cursor-pointer text-red-500 hover:text-red-600 font-medium text-[15px]"
//           >
//             <LogoutOutlined />
//             {!collapsed && <span>Log out</span>}
//           </div>
//         </div>
//       </Sider>

//       {/* Main Content */}
//       <Layout>
//         <Header
//           style={{
//             height: 64,
//             background: "#fff",
//             borderBottom: "1px solid #f0f0f0",
//             padding: "0 20px",
//             display: "flex",
//             alignItems: "center",
//           }}
//         >
//           <h1 className="text-lg font-semibold text-[#092c4c]">Admin Panel</h1>
//         </Header>

//         <Content
//           style={{
//             margin: 0,
//             height: "calc(100vh - 64px)",
//             overflowY: "auto",
//             padding: 24,
//             background: "#ffffff",
//           }}
//         >
//           {children}
//         </Content>
//       </Layout>
//     </Layout>
//   );
// };

// export default UserSidebarLayout;
