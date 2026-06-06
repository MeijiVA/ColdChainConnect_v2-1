import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  details: string;
  status: "success" | "failed";
}

// Mock audit log data
const mockAuditLog: AuditEntry[] = [
  {
    id: "1",
    timestamp: "2024-01-15 14:32:00",
    user: "Mizael Anton",
    action: "Login",
    resource: "System",
    details: "User logged in from IP 192.168.1.100",
    status: "success",
  },
  {
    id: "2",
    timestamp: "2024-01-15 14:35:22",
    user: "Mizael Anton",
    action: "Update",
    resource: "Employee Records",
    details: "Modified employee salary information",
    status: "success",
  },
  {
    id: "3",
    timestamp: "2024-01-15 15:01:45",
    user: "Mizael Anton",
    action: "Delete",
    resource: "Inventory",
    details: "Removed expired stock item SKU-1234",
    status: "success",
  },
  {
    id: "4",
    timestamp: "2024-01-15 15:45:12",
    user: "Mizael Anton",
    action: "Export",
    resource: "Sales Report",
    details: "Exported monthly sales report to CSV",
    status: "success",
  },
  {
    id: "5",
    timestamp: "2024-01-15 16:12:33",
    user: "Mizael Anton",
    action: "Failed Login",
    resource: "System",
    details: "Failed login attempt with incorrect credentials",
    status: "failed",
  },
];

type TabType = "personal" | "security" | "audit";

export function Settings() {
  const [activeTab, setActiveTab] = useState<TabType>("personal");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Personal Details state
  const [personalDetails, setPersonalDetails] = useState({
    firstName: "Mizael",
    lastName: "Anton",
    email: "mizael.anton@acdp.com",
    phone: "+1 (555) 123-4567",
    department: "Management",
    jobTitle: "System Administrator",
    profilePicture: "👤",
  });

  // Security state
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePersonalDetailsChange = (field: string, value: string) => {
    setPersonalDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSavePersonalDetails = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast({
        title: "Success",
        description: "Profile information updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile information.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast({
        title: "Success",
        description: "Password changed successfully.",
      });
      setShowChangePassword(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to change password.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 px-4 md:px-6 lg:px-7 py-4 md:py-6 overflow-y-auto scrollbar-visible">
      <div className="max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-navy mb-2">Settings</h1>
          <p className="text-gray-600">
            Manage your profile, security, and view system activities
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-border">
          <button
            onClick={() => setActiveTab("personal")}
            className={`px-4 py-3 font-semibold transition-all border-b-2 ${
              activeTab === "personal"
                ? "border-accent text-accent"
                : "border-transparent text-muted hover:text-navy"
            }`}
          >
            Personal Details
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`px-4 py-3 font-semibold transition-all border-b-2 ${
              activeTab === "security"
                ? "border-accent text-accent"
                : "border-transparent text-muted hover:text-navy"
            }`}
          >
            Security
          </button>
          <button
            onClick={() => setActiveTab("audit")}
            className={`px-4 py-3 font-semibold transition-all border-b-2 ${
              activeTab === "audit"
                ? "border-accent text-accent"
                : "border-transparent text-muted hover:text-navy"
            }`}
          >
            Audit Log
          </button>
        </div>

        {/* Personal Details Tab */}
        {activeTab === "personal" && (
          <div className="space-y-6">
            {/* Profile Picture Section */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-navy mb-4">
                Profile Picture
              </h2>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent-2 to-navy-light flex items-center justify-center text-4xl border-2 border-accent-2">
                  {personalDetails.profilePicture}
                </div>
                <Button variant="outline">Change Picture</Button>
              </div>
            </Card>

            {/* Contact Information */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-navy mb-4">
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-navy mb-2">
                    First Name
                  </label>
                  <Input
                    value={personalDetails.firstName}
                    onChange={(e) =>
                      handlePersonalDetailsChange("firstName", e.target.value)
                    }
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy mb-2">
                    Last Name
                  </label>
                  <Input
                    value={personalDetails.lastName}
                    onChange={(e) =>
                      handlePersonalDetailsChange("lastName", e.target.value)
                    }
                    placeholder="Last name"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-navy mb-2">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={personalDetails.email}
                    onChange={(e) =>
                      handlePersonalDetailsChange("email", e.target.value)
                    }
                    placeholder="Email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy mb-2">
                    Phone Number
                  </label>
                  <Input
                    value={personalDetails.phone}
                    onChange={(e) =>
                      handlePersonalDetailsChange("phone", e.target.value)
                    }
                    placeholder="Phone number"
                  />
                </div>
              </div>
            </Card>

            {/* Work Information */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-navy mb-4">
                Work Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-navy mb-2">
                    Department
                  </label>
                  <Input
                    value={personalDetails.department}
                    onChange={(e) =>
                      handlePersonalDetailsChange("department", e.target.value)
                    }
                    placeholder="Department"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy mb-2">
                    Job Title
                  </label>
                  <Input
                    value={personalDetails.jobTitle}
                    onChange={(e) =>
                      handlePersonalDetailsChange("jobTitle", e.target.value)
                    }
                    placeholder="Job title"
                  />
                </div>
              </div>
            </Card>

            {/* Save Button */}
            <div className="flex gap-2 justify-end">
              <Button
                onClick={handleSavePersonalDetails}
                disabled={isSaving}
                className="bg-accent hover:bg-accent-dark text-white"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-navy mb-4">
                Password Management
              </h2>
              <p className="text-gray-600 mb-6">
                Ensure your account is secure by using a strong password
              </p>

              {!showChangePassword && (
                <Button
                  onClick={() => setShowChangePassword(true)}
                  variant="outline"
                >
                  Change Password
                </Button>
              )}

              {showChangePassword && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-2">
                      Current Password
                    </label>
                    <Input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData((prev) => ({
                          ...prev,
                          currentPassword: e.target.value,
                        }))
                      }
                      placeholder="Enter current password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-2">
                      New Password
                    </label>
                    <Input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData((prev) => ({
                          ...prev,
                          newPassword: e.target.value,
                        }))
                      }
                      placeholder="Enter new password (min. 8 characters)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-2">
                      Confirm New Password
                    </label>
                    <Input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                      placeholder="Confirm new password"
                    />
                  </div>
                  <div className="flex gap-2 justify-end pt-4">
                    <Button
                      onClick={() => setShowChangePassword(false)}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleChangePassword}
                      disabled={isSaving}
                      className="bg-accent hover:bg-accent-dark text-white"
                    >
                      {isSaving ? "Updating..." : "Update Password"}
                    </Button>
                  </div>
                </div>
              )}
            </Card>

            {/* Security Info */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-navy mb-4">
                Security Information
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-off-white rounded border border-border">
                  <span className="text-sm text-navy font-semibold">
                    Last Login
                  </span>
                  <span className="text-sm text-gray-600">
                    Today at 2:32 PM
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-off-white rounded border border-border">
                  <span className="text-sm text-navy font-semibold">
                    Last Password Change
                  </span>
                  <span className="text-sm text-gray-600">
                    30 days ago
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-off-white rounded border border-border">
                  <span className="text-sm text-navy font-semibold">
                    Account Status
                  </span>
                  <span className="text-sm text-green-600 font-semibold">
                    Active
                  </span>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Audit Log Tab */}
        {activeTab === "audit" && (
          <div className="space-y-4">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-bold text-navy">Audit Log</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Complete activity trail of all user actions and system
                    changes
                  </p>
                </div>
              </div>

              {/* Audit Log Table */}
              <div className="overflow-x-auto scrollbar-visible">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-3 font-semibold text-navy">
                        Timestamp
                      </th>
                      <th className="text-left py-3 px-3 font-semibold text-navy">
                        User
                      </th>
                      <th className="text-left py-3 px-3 font-semibold text-navy">
                        Action
                      </th>
                      <th className="text-left py-3 px-3 font-semibold text-navy">
                        Resource
                      </th>
                      <th className="text-left py-3 px-3 font-semibold text-navy">
                        Details
                      </th>
                      <th className="text-left py-3 px-3 font-semibold text-navy">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockAuditLog.map((entry) => (
                      <tr
                        key={entry.id}
                        className="border-b border-border hover:bg-off-white transition-colors"
                      >
                        <td className="py-3 px-3 text-gray-600">
                          {entry.timestamp}
                        </td>
                        <td className="py-3 px-3 text-gray-700 font-medium">
                          {entry.user}
                        </td>
                        <td className="py-3 px-3 text-gray-700 font-medium">
                          {entry.action}
                        </td>
                        <td className="py-3 px-3 text-gray-700">
                          {entry.resource}
                        </td>
                        <td className="py-3 px-3 text-gray-600">
                          {entry.details}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              entry.status === "success"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {entry.status === "success" ? "✓" : "✗"}{" "}
                            {entry.status.charAt(0).toUpperCase() +
                              entry.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-border">
                <span className="text-sm text-gray-600">
                  Showing {mockAuditLog.length} entries
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" disabled>
                    Next
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
