"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface SubAdmin {
  id: number
  name: string
  email: string
  phone: string
  address: string
  avatar: string
}

export default function ProfilePage() {
  const [adminInfo, setAdminInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [subAdmins, setSubAdmins] = useState<SubAdmin[]>([
    {
      id: 1,
      name: "Henry Jr.",
      email: "zan.amirol@gmail.com",
      phone: "+1234567890",
      address: "123 Main St, City",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      name: "Henry Jr.",
      email: "zan.amirol@gmail.com",
      phone: "+1234567890",
      address: "456 Oak Ave, Town",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ])

  const [showAssignModal, setShowAssignModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedSubAdmin, setSelectedSubAdmin] = useState<SubAdmin | null>(null)
  const [editingSubAdmin, setEditingSubAdmin] = useState<SubAdmin | null>(null)

  const [newSubAdminData, setNewSubAdminData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  })

  const handleAdminInfoChange = (field: string, value: string) => {
    setAdminInfo((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleNewSubAdminChange = (field: string, value: string) => {
    setNewSubAdminData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleEditSubAdminChange = (field: string, value: string) => {
    if (editingSubAdmin) {
      setEditingSubAdmin((prev) =>
        prev
          ? {
            ...prev,
            [field]: value,
          }
          : null,
      )
    }
  }

  const handleSaveChanges = () => {
    console.log("Saving admin info:", adminInfo)
  }

  const handleUpdatePassword = () => {
    console.log("Updating password")
  }

  const handleAssignSubAdmin = () => {
    setShowAssignModal(true)
  }

  const handleSubmitAssign = () => {
    const newSubAdmin: SubAdmin = {
      id: Math.max(...subAdmins.map((s) => s.id)) + 1,
      name: newSubAdminData.name,
      email: newSubAdminData.email,
      phone: newSubAdminData.phone,
      address: newSubAdminData.address,
      avatar: "/placeholder.svg?height=40&width=40",
    }

    setSubAdmins([...subAdmins, newSubAdmin])
    setNewSubAdminData({
      name: "",
      email: "",
      phone: "",
      address: "",
      password: "",
      confirmPassword: "",
    })
    setShowAssignModal(false)
  }

  const handleViewSubAdmin = (subAdmin: SubAdmin) => {
    setSelectedSubAdmin(subAdmin)
    setEditingSubAdmin({ ...subAdmin })
    setShowViewModal(true)
  }

  const handleSaveSubAdminChanges = () => {
    if (editingSubAdmin) {
      setSubAdmins(subAdmins.map((admin) => (admin.id === editingSubAdmin.id ? editingSubAdmin : admin)))
      setShowViewModal(false)
      setSelectedSubAdmin(null)
      setEditingSubAdmin(null)
    }
  }

  const handleRemoveSubAdmin = (id: number) => {
    setSubAdmins(subAdmins.filter((admin) => admin.id !== id))
  }

  const closeAssignModal = () => {
    setShowAssignModal(false)
    setNewSubAdminData({
      name: "",
      email: "",
      phone: "",
      address: "",
      password: "",
      confirmPassword: "",
    })
  }

  const closeViewModal = () => {
    setShowViewModal(false)
    setSelectedSubAdmin(null)
    setEditingSubAdmin(null)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-600">Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/placeholder.svg?height=64&width=64" alt="Henry Jr." />
              <AvatarFallback>HJ</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-medium">Henry Jr.</h3>
              <p className="text-sm text-gray-600">zan.amirol@gmail.com</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admin Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Admin Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Name*
            </Label>
            <Input
              id="name"
              placeholder="Enter your first name"
              value={adminInfo.name}
              onChange={(e) => handleAdminInfoChange("name", e.target.value)}
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email*
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={adminInfo.email}
              onChange={(e) => handleAdminInfoChange("email", e.target.value)}
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium">
              Phone number
            </Label>
            <Input
              id="phone"
              placeholder=""
              value={adminInfo.phone}
              onChange={(e) => handleAdminInfoChange("phone", e.target.value)}
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-medium">
              Address*
            </Label>
            <Input
              id="address"
              placeholder="Enter your address"
              value={adminInfo.address}
              onChange={(e) => handleAdminInfoChange("address", e.target.value)}
              className="h-10"
            />
          </div>

          <div className="pt-2">
            <Button onClick={handleSaveChanges} className="bg-slate-800 hover:bg-slate-700">
              Save changes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Change Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password" className="text-sm font-medium">
              Current Password
            </Label>
            <Input
              id="current-password"
              type="password"
              placeholder="••••••••"
              value={passwordData.currentPassword}
              onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password" className="text-sm font-medium">
              New Password
            </Label>
            <Input
              id="new-password"
              type="password"
              placeholder=""
              value={passwordData.newPassword}
              onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="text-sm font-medium">
              Confirm new Password
            </Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="••••••••"
              value={passwordData.confirmPassword}
              onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
              className="h-10"
            />
          </div>

          <div className="pt-2">
            <Button onClick={handleUpdatePassword} className="bg-slate-800 hover:bg-slate-700">
              Update password
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
