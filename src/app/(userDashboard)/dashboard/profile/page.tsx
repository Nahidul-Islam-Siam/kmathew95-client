// app/profile/page.tsx
"use client"; // Required because it uses state and interacts with modal

import ProfileContent from "@/components/UserDashboard/UserDashboardPage/Profilecontent";
import EditProfileModal from "@/components/UserDashboard/UserDashboardPage/UserProfileModal";
import { useState } from "react";


export default function ProfilePage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <ProfileContent onEditClick={() => setModalOpen(true)} />
      <EditProfileModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}