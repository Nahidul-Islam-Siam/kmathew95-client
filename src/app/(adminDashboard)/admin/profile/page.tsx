"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, X } from "lucide-react"

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

      {/* Sub-Admin */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">Sub-Admin</CardTitle>
            <Button onClick={handleAssignSubAdmin} className="bg-slate-800 hover:bg-slate-700 flex items-center gap-2">
              Assign Sub-Admin
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {subAdmins.map((subAdmin) => (
            <div key={subAdmin.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={subAdmin.avatar || "/placeholder.svg"} alt={subAdmin.name} />
                  <AvatarFallback>HJ</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{subAdmin.name}</h4>
                  <p className="text-sm text-gray-600">{subAdmin.email}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => handleViewSubAdmin(subAdmin)} className="px-6">
                  View
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleRemoveSubAdmin(subAdmin.id)}
                  className="px-4 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
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

      {/* Assign Sub-Admin Modal */}
      <Dialog open={showAssignModal} onOpenChange={setShowAssignModal}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-lg font-medium">Assign Sub-Admin</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeAssignModal}
              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
            >
            </Button>
          </DialogHeader>

          <div className="space-y-4 pt-4">

            <div className="space-y-2">
              <Label htmlFor="assign-name" className="text-sm font-medium">
                Name*
              </Label>
              <Input
                id="assign-name"
                placeholder="Enter your fast name"
                value={newSubAdminData.name}
                onChange={(e) => handleNewSubAdminChange("name", e.target.value)}
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assign-email" className="text-sm font-medium">
                Email*
              </Label>
              <Input
                id="assign-email"
                type="email"
                placeholder="Enter your name"
                value={newSubAdminData.email}
                onChange={(e) => handleNewSubAdminChange("email", e.target.value)}
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assign-phone" className="text-sm font-medium">
                Phone number
              </Label>
              <Input
                id="assign-phone"
                placeholder="+0"
                value={newSubAdminData.phone}
                onChange={(e) => handleNewSubAdminChange("phone", e.target.value)}
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assign-address" className="text-sm font-medium">
                Address*
              </Label>
              <Input
                id="assign-address"
                placeholder="Enter your address"
                value={newSubAdminData.address}
                onChange={(e) => handleNewSubAdminChange("address", e.target.value)}
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assign-password" className="text-sm font-medium">
                Password
              </Label>
              <Input
                id="assign-password"
                type="password"
                placeholder="Enter your address"
                value={newSubAdminData.password}
                onChange={(e) => handleNewSubAdminChange("password", e.target.value)}
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assign-confirm-password" className="text-sm font-medium">
                Confirm Password
              </Label>
              <Input
                id="assign-confirm-password"
                type="password"
                placeholder="Enter your address"
                value={newSubAdminData.confirmPassword}
                onChange={(e) => handleNewSubAdminChange("confirmPassword", e.target.value)}
                className="h-10"
              />
            </div>

            <div className="pt-4">
              <Button onClick={handleSubmitAssign} className="w-full bg-slate-800 hover:bg-slate-700">
                Assign
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View/Edit Sub-Admin Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-lg font-medium">Sub-Admin Information</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeViewModal}
              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
            >
            </Button>
          </DialogHeader>

          {editingSubAdmin && (
            <div className="space-y-4 pt-4">

              <div className="space-y-2">
                <Label htmlFor="edit-name" className="text-sm font-medium">
                  Name*
                </Label>
                <Input
                  id="edit-name"
                  placeholder="Enter your fast name"
                  value={editingSubAdmin.name}
                  onChange={(e) => handleEditSubAdminChange("name", e.target.value)}
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-email" className="text-sm font-medium">
                  Email*
                </Label>
                <Input
                  id="edit-email"
                  type="email"
                  placeholder="Enter your name"
                  value={editingSubAdmin.email}
                  onChange={(e) => handleEditSubAdminChange("email", e.target.value)}
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-phone" className="text-sm font-medium">
                  Phone number
                </Label>
                <Input
                  id="edit-phone"
                  placeholder="+0"
                  value={editingSubAdmin.phone}
                  onChange={(e) => handleEditSubAdminChange("phone", e.target.value)}
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-address" className="text-sm font-medium">
                  Address*
                </Label>
                <Input
                  id="edit-address"
                  placeholder="Enter your address"
                  value={editingSubAdmin.address}
                  onChange={(e) => handleEditSubAdminChange("address", e.target.value)}
                  className="h-10"
                />
              </div>

              <div className="pt-4">
                <Button onClick={handleSaveSubAdminChanges} className="w-full bg-slate-800 hover:bg-slate-700">
                  Save changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
