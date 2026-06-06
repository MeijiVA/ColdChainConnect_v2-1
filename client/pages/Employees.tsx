import { useState } from "react";

// Employee interface with all required fields
interface Employee {
  id: string; // REQ-EMP-002: Auto-generated
  firstName: string;
  middleName: string;
  lastName: string;
  username: string; // REQ-EMP-004: Unique constraint
  email: string;
  contactNumber: string;
  address: string;
  age: number;
  dateOfBirth: string;
  sex: "Male" | "Female" | "Other";
  position: "Administrator" | "Sales Staff" | "Inventory Staff" | "Assistant";
  status: "Active" | "Inactive"; // REQ-EMP-003: Deactivate instead of delete
  dateHired: string;
}

export function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: "ADM-0001",
      firstName: "Antonio",
      middleName: "Cristobal",
      lastName: "Dela Pena",
      username: "AntonDelaPena2",
      email: "adp@acdp.ph",
      contactNumber: "09171110000",
      address: "San Fernando, Pampanga",
      age: 45,
      dateOfBirth: "1980-05-15",
      sex: "Male",
      position: "Administrator",
      status: "Active",
      dateHired: "2021-07-01",
    },
    {
      id: "AST-0001",
      firstName: "Mizael",
      middleName: "Anton",
      lastName: "Bautista",
      username: "MeijiVA",
      email: "mizael@acdp.ph",
      contactNumber: "09281110001",
      address: "San Fernando, Pampanga",
      age: 22,
      dateOfBirth: "2003-03-10",
      sex: "Male",
      position: "Assistant",
      status: "Active",
      dateHired: "2025-01-15",
    },
    {
      id: "INV-0001",
      firstName: "Jan",
      middleName: "Ezekiel",
      lastName: "Pagulailan",
      username: "Paguligan",
      email: "jan@acdp.ph",
      contactNumber: "09391110002",
      address: "Angeles, Pampanga",
      age: 28,
      dateOfBirth: "1997-08-22",
      sex: "Male",
      position: "Inventory Staff",
      status: "Active",
      dateHired: "2023-04-10",
    },
    {
      id: "SLS-0001",
      firstName: "Juan",
      middleName: "Miguel",
      lastName: "Reyes",
      username: "Dani",
      email: "juan@acdp.ph",
      contactNumber: "09501110003",
      address: "Pampanga",
      age: 32,
      dateOfBirth: "1992-11-18",
      sex: "Male",
      position: "Sales Staff",
      status: "Active",
      dateHired: "2025-03-01",
    },
    {
      id: "SLS-0002",
      firstName: "Shiela",
      middleName: "Mae",
      lastName: "Joson",
      username: "Pumpkin",
      email: "shiela@acdp.ph",
      contactNumber: "09611110004",
      address: "Bulacan",
      age: 26,
      dateOfBirth: "1999-06-30",
      sex: "Female",
      position: "Sales Staff",
      status: "Active",
      dateHired: "2025-03-05",
    },
    {
      id: "SLS-0003",
      firstName: "Test",
      middleName: "",
      lastName: "Kahit",
      username: "Kahitano",
      email: "test@acdp.ph",
      contactNumber: "09721110005",
      address: "Laguna",
      age: 30,
      dateOfBirth: "1995-02-14",
      sex: "Male",
      position: "Sales Staff",
      status: "Active",
      dateHired: "2025-03-10",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewData, setViewData] = useState<Employee | null>(null);

  // Form state - REQ-EMP-001: Required fields
  const [formData, setFormData] = useState<Partial<Employee>>({
    position: "Assistant",
    status: "Active",
    sex: "Male",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Generate Employee ID - REQ-EMP-002
  const generateEmployeeId = (position: string): string => {
    const prefix = {
      Administrator: "ADM",
      "Sales Staff": "SLS",
      "Inventory Staff": "INV",
      Assistant: "AST",
    }[position] || "EMP";

    const existingIds = employees
      .filter((e) => e.id.startsWith(prefix))
      .map((e) => parseInt(e.id.slice(4)))
      .sort((a, b) => b - a);

    const nextNum = (existingIds[0] || 0) + 1;
    return `${prefix}-${String(nextNum).padStart(4, "0")}`;
  };

  // Validate form - REQ-EMP-006: Duplicate validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.contactNumber) newErrors.contactNumber = "Contact number is required";
    if (!formData.position) newErrors.position = "Position is required";

    // Check for duplicates - REQ-EMP-004 & REQ-EMP-006
    const isEditMode = selectedEmployee !== null;
    if (
      !isEditMode &&
      employees.some((e) => e.username === formData.username)
    ) {
      newErrors.username = "Username already exists";
    }

    if (
      !isEditMode &&
      employees.some((e) => e.email === formData.email)
    ) {
      newErrors.email = "Email already exists";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save - REQ-EMP-001, REQ-EMP-002, REQ-EMP-004
  const handleSave = () => {
    if (!validateForm()) return;

    if (selectedEmployee) {
      // Edit mode
      setEmployees(
        employees.map((e) =>
          e.id === selectedEmployee.id
            ? { ...e, ...formData }
            : e
        ) as Employee[]
      );
    } else {
      // Add mode
      const newEmployee: Employee = {
        id: generateEmployeeId(formData.position || "Assistant"),
        firstName: formData.firstName || "",
        middleName: formData.middleName || "",
        lastName: formData.lastName || "",
        username: formData.username || "",
        email: formData.email || "",
        contactNumber: formData.contactNumber || "",
        address: formData.address || "",
        age: formData.age || 0,
        dateOfBirth: formData.dateOfBirth || "",
        sex: formData.sex || "Male",
        position: formData.position as Employee["position"],
        status: "Active",
        dateHired: new Date().toISOString().split("T")[0],
      };

      setEmployees([...employees, newEmployee]);
    }

    resetForm();
    setIsModalOpen(false);
  };

  // View employee details - REQ-EMP-005
  const handleView = (employee: Employee) => {
    setViewData(employee);
    setShowViewModal(true);
  };

  // Edit employee - REQ-EMP-005
  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setFormData(employee);
    setIsModalOpen(true);
  };

  // Archive/Deactivate employee - REQ-EMP-003, REQ-EMP-005
  const handleArchive = (employee: Employee) => {
    setEmployees(
      employees.map((e) =>
        e.id === employee.id
          ? { ...e, status: e.status === "Active" ? "Inactive" : "Active" }
          : e
      ) as Employee[]
    );
  };

  // Reset form
  const resetForm = () => {
    setFormData({ position: "Assistant", status: "Active", sex: "Male" });
    setSelectedEmployee(null);
    setErrors({});
  };

  // Filter employees - REQ-EMP-007, REQ-EMP-008
  const filteredEmployees = employees.filter(
    (e) =>
      e.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 px-4 md:px-6 lg:px-7 py-4 md:py-6 overflow-y-auto scrollbar-visible space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-rajdhani text-3xl font-bold text-navy letter-spacing-tight">
            Employee Management
          </h1>
          <p className="text-xs text-muted mt-1">
            Manage staff accounts and access levels
          </p>
        </div>
      </div>

      {/* Search Bar and Actions */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 flex items-center bg-navy-mid border border-border rounded-lg px-3 gap-2">
          <span className="text-muted">🔍</span>
          <input
            type="text"
            placeholder="Search Term"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none text-white placeholder-muted py-2 outline-none text-sm"
          />
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-white border border-border text-navy rounded-lg font-semibold text-sm hover:bg-off-white"
        >
          ➕ Add Employee
        </button>
        <button className="px-4 py-2 bg-white border border-border text-navy rounded-lg font-semibold text-sm hover:bg-off-white">
          Database
        </button>
      </div>

      {/* Employee Cards Grid - REQ-EMP-008: Display from database */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEmployees.map((employee) => (
          <EmployeeCard
            key={employee.id}
            employee={employee}
            onView={() => handleView(employee)}
            onEdit={() => handleEdit(employee)}
            onArchive={() => handleArchive(employee)}
          />
        ))}
      </div>

      {filteredEmployees.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted text-sm">No employees found</p>
        </div>
      )}

      {/* Employee Modal - REQ-EMP-001: Create/Edit with all fields */}
      {isModalOpen && (
        <EmployeeModal
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          isEditMode={selectedEmployee !== null}
          onSave={handleSave}
          onClose={() => {
            setIsModalOpen(false);
            resetForm();
          }}
        />
      )}

      {/* View Modal */}
      {showViewModal && viewData && (
        <ViewEmployeeModal
          employee={viewData}
          onClose={() => setShowViewModal(false)}
        />
      )}
    </div>
  );
}

// Employee Card Component
function EmployeeCard({
  employee,
  onView,
  onEdit,
  onArchive,
}: {
  employee: Employee;
  onView: () => void;
  onEdit: () => void;
  onArchive: () => void;
}) {
  const getPositionColor = (position: string) => {
    switch (position) {
      case "Administrator":
        return "bg-purple/15 text-purple border-purple/30";
      case "Sales Staff":
        return "bg-green/15 text-green border-green/30";
      case "Inventory Staff":
        return "bg-blue/15 text-blue border-blue/30";
      case "Assistant":
        return "bg-gold/15 text-gold border-gold/30";
      default:
        return "bg-muted/15 text-muted border-muted/30";
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-border p-5 space-y-3">
      {/* Card Header with ID and Actions */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-rajdhani text-lg font-bold text-navy">
            {employee.id}
          </h3>
          <p className="text-xs text-muted mt-1">
            {employee.firstName} {employee.middleName} {employee.lastName}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onView}
            className="p-2 rounded-lg bg-off-white hover:bg-navy/10 text-navy transition-colors"
            title="View Details"
          >
            ℹ️
          </button>
          <button
            onClick={onArchive}
            className="p-2 rounded-lg bg-red/10 hover:bg-red/20 text-red transition-colors"
            title={employee.status === "Active" ? "Archive" : "Unarchive"}
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Employee Username */}
      <div>
        <p className="text-xs text-muted font-semibold">USERNAME</p>
        <p className="text-sm text-navy font-semibold">{employee.username}</p>
      </div>

      {/* Badges */}
      <div className="flex gap-2 flex-wrap">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPositionColor(
            employee.position
          )}`}
        >
          {employee.position}
        </span>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${
            employee.status === "Active"
              ? "bg-green/15 text-green border-green/30"
              : "bg-red/15 text-red border-red/30"
          }`}
        >
          {employee.status}
        </span>
      </div>

      {/* Edit Button */}
      <button
        onClick={onEdit}
        className="w-full px-3 py-2 rounded-lg bg-navy text-white font-semibold text-sm hover:opacity-90 transition-opacity"
      >
        Edit Employee
      </button>
    </div>
  );
}

// Employee Modal - REQ-EMP-001: All required fields
function EmployeeModal({
  formData,
  setFormData,
  errors,
  isEditMode,
  onSave,
  onClose,
}: {
  formData: Partial<Employee>;
  setFormData: (data: Partial<Employee>) => void;
  errors: Record<string, string>;
  isEditMode: boolean;
  onSave: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl border border-border max-w-2xl w-full max-h-96 overflow-y-auto">
        <div className="sticky top-0 bg-navy-mid px-6 py-4 flex items-center justify-between border-b border-border">
          <h2 className="font-rajdhani text-lg font-bold text-white">
            {isEditMode ? "Edit Employee" : "Add New Employee"}
          </h2>
          <button onClick={onClose} className="text-white hover:opacity-70 text-2xl">
            ×
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {/* First Name */}
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">
                First Name *
              </label>
              <input
                type="text"
                value={formData.firstName || ""}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none ${
                  errors.firstName
                    ? "border-red"
                    : "border-border focus:border-accent-2"
                }`}
                placeholder="First name"
              />
              {errors.firstName && (
                <p className="text-xs text-red mt-1">{errors.firstName}</p>
              )}
            </div>

            {/* Middle Name */}
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">
                Middle Name
              </label>
              <input
                type="text"
                value={formData.middleName || ""}
                onChange={(e) =>
                  setFormData({ ...formData, middleName: e.target.value })
                }
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-accent-2"
                placeholder="Middle name"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">
                Last Name *
              </label>
              <input
                type="text"
                value={formData.lastName || ""}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none ${
                  errors.lastName
                    ? "border-red"
                    : "border-border focus:border-accent-2"
                }`}
                placeholder="Last name"
              />
              {errors.lastName && (
                <p className="text-xs text-red mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">
                Username *
              </label>
              <input
                type="text"
                value={formData.username || ""}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none ${
                  errors.username
                    ? "border-red"
                    : "border-border focus:border-accent-2"
                }`}
                placeholder="Username"
              />
              {errors.username && (
                <p className="text-xs text-red mt-1">{errors.username}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">
                Email *
              </label>
              <input
                type="email"
                value={formData.email || ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none ${
                  errors.email
                    ? "border-red"
                    : "border-border focus:border-accent-2"
                }`}
                placeholder="Email"
              />
              {errors.email && (
                <p className="text-xs text-red mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Contact Number */}
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">
                Contact Number *
              </label>
              <input
                type="text"
                value={formData.contactNumber || ""}
                onChange={(e) =>
                  setFormData({ ...formData, contactNumber: e.target.value })
                }
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none ${
                  errors.contactNumber
                    ? "border-red"
                    : "border-border focus:border-accent-2"
                }`}
                placeholder="09XXXXXXXXX"
              />
              {errors.contactNumber && (
                <p className="text-xs text-red mt-1">{errors.contactNumber}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">
                Address
              </label>
              <input
                type="text"
                value={formData.address || ""}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-accent-2"
                placeholder="Address"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {/* Age */}
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">
                Age
              </label>
              <input
                type="number"
                value={formData.age || ""}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-accent-2"
                placeholder="Age"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                value={formData.dateOfBirth || ""}
                onChange={(e) =>
                  setFormData({ ...formData, dateOfBirth: e.target.value })
                }
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-accent-2"
              />
            </div>

            {/* Sex */}
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">
                Sex
              </label>
              <select
                value={formData.sex || "Male"}
                onChange={(e) =>
                  setFormData({ ...formData, sex: e.target.value as Employee["sex"] })
                }
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-accent-2"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Position */}
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">
                Position *
              </label>
              <select
                value={formData.position || "Assistant"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    position: e.target.value as Employee["position"],
                  })
                }
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none ${
                  errors.position
                    ? "border-red"
                    : "border-border focus:border-accent-2"
                }`}
              >
                <option>Administrator</option>
                <option>Sales Staff</option>
                <option>Inventory Staff</option>
                <option>Assistant</option>
              </select>
              {errors.position && (
                <p className="text-xs text-red mt-1">{errors.position}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">
                Status
              </label>
              <select
                value={formData.status || "Active"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as Employee["status"],
                  })
                }
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-accent-2"
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-off-white px-6 py-4 flex justify-end gap-2 border-t border-border">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-border rounded-lg font-semibold text-sm hover:bg-white"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-accent-2 text-white rounded-lg font-semibold text-sm hover:opacity-90"
          >
            {isEditMode ? "Update Employee" : "Add Employee"}
          </button>
        </div>
      </div>
    </div>
  );
}

// View Employee Modal
function ViewEmployeeModal({
  employee,
  onClose,
}: {
  employee: Employee;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl border border-border max-w-md w-full">
        <div className="bg-navy-mid px-6 py-4 flex items-center justify-between border-b border-border">
          <h2 className="font-rajdhani text-lg font-bold text-white">
            Employee Details
          </h2>
          <button onClick={onClose} className="text-white hover:opacity-70 text-2xl">
            ×
          </button>
        </div>

        <div className="p-6 space-y-3">
          <DetailRow label="Employee ID" value={employee.id} />
          <DetailRow
            label="Name"
            value={`${employee.firstName} ${employee.middleName} ${employee.lastName}`}
          />
          <DetailRow label="Username" value={employee.username} />
          <DetailRow label="Email" value={employee.email} />
          <DetailRow label="Contact" value={employee.contactNumber} />
          <DetailRow label="Address" value={employee.address} />
          <DetailRow label="Age" value={employee.age.toString()} />
          <DetailRow label="Date of Birth" value={employee.dateOfBirth} />
          <DetailRow label="Sex" value={employee.sex} />
          <DetailRow label="Position" value={employee.position} />
          <DetailRow label="Status" value={employee.status} />
          <DetailRow label="Date Hired" value={employee.dateHired} />
        </div>

        <div className="flex justify-end px-6 py-4 border-t border-border">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-accent-2 text-white rounded-lg font-semibold text-sm hover:opacity-90"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2 border-b border-border">
      <span className="text-xs font-semibold text-muted">{label}</span>
      <span className="text-sm text-navy font-semibold">{value}</span>
    </div>
  );
}
