"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function AdminChangePassword() {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleUpdatePassword = () => {
    // Validation
    if (!passwordData.currentPassword) {
      alert("Please enter your current password.");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert("New password must be at least 6 characters long.");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New password and confirmation do not match.");
      return;
    }

    // ✅ All checks passed — simulate API call
    console.log("Submitting password change...", {
      currentPassword: "••••••••",
      newPassword: "••••••••",
    });

    // 🔁 Replace this with real API call later
    // Example:
    // try {
    //   const res = await fetch("/api/auth/change-password", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //       currentPassword: passwordData.currentPassword,
    //       newPassword: passwordData.newPassword,
    //     }),
    //   });
    //
    //   if (res.ok) {
    //     alert("Password updated successfully!");
    //   } else {
    //     const error = await res.json();
    //     alert(`Error: ${error.message}`);
    //   }
    // } catch (err) {
    //   alert("Failed to connect to server.");
    // }

    // Show success feedback
    alert("Password updated successfully!");

    // Reset form
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Change Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Password */}
          <div className="space-y-2">
            <Label htmlFor="current-password" className="text-sm font-medium">
              Current Password
            </Label>
            <Input
              id="current-password"
              type="password"
              placeholder="Enter your current password"
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  currentPassword: e.target.value,
                })
              }
              className="h-10"
            />
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="new-password" className="text-sm font-medium">
              New Password
            </Label>
            <Input
              id="new-password"
              type="password"
              placeholder="Enter a new password (at least 6 characters)"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value,
                })
              }
              className="h-10"
            />
            {passwordData.newPassword && passwordData.newPassword.length > 0 && passwordData.newPassword.length < 6 && (
              <p className="text-sm text-red-500">Password must be at least 6 characters long.</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="text-sm font-medium">
              Confirm New Password
            </Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Re-enter your new password"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  confirmPassword: e.target.value,
                })
              }
              className="h-10"
            />
            {passwordData.confirmPassword &&
              passwordData.newPassword !== passwordData.confirmPassword && (
                <p className="text-sm text-red-500">Passwords do not match.</p>
              )}
          </div>

          {/* Update Button */}
          <div className="pt-2">
            <Button
              onClick={handleUpdatePassword}
              disabled={
                !passwordData.currentPassword ||
                passwordData.newPassword.length < 6 ||
                passwordData.newPassword !== passwordData.confirmPassword
              }
              className="w-full bg-slate-800 hover:bg-slate-700 disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              Update Password
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}