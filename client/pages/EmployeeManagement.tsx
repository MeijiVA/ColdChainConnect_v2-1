import { useState } from "react";
import { X, Info, Trash2, Plus } from "lucide-react";

interface Employee {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  username: string;
  position: "Administrator" | "Assistant" | "Field Employee";
  status: "Active" | "Inactive";
  email: string;
  phone: string;
  address: string;
  age: number;
  dateOfBirth: string;
  sex: "Male" | "Female";
}

const positionPrefixes: Record<string, string> = {
  Administrator: "ADM",
  Assistant: "AST",
  "Field Employee": "FLD",
};

const positionColors: Record<string, string> = {
  Administrator: "bg-blue-100 text-blue-700",
  Assistant: "bg-pink-100 text-pink-700",
  "Field Employee": "bg-green-100 text-green-700",
};

export function EmployeeManagement() {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: "ADM-0001",
      firstName: "Delta",
      middleName: "Pena",
      lastName: "Antonio",
      username: "AntonDelaPena2",
      position: "Administrator",
      status: "Active",
      email: "delta.antonio@acdp.com",
      phone: "09123456789",
      address: "123 Main St",
      age: 35,
      dateOfBirth: "1991-03-15",
      sex: "Male",
    },
    {
      id: "AST-0001",
      firstName: "Bautista",
      lastName: "Mizael Anton",
      username: "MeijVA",
      position: "Assistant",
      status: "Active",
      email: "baudista.mizael@acdp.com",
      phone: "09123456790",
      address: "456 Oak Ave",
      age: 28,
      dateOfBirth: "1998-07-22",
      sex: "Male",
    },
    {
      id: "FLD-0001",
      firstName: "Azaryah",
      lastName: "Carino",
      username: "ryah",
      position: "Field Employee",
      status: "Active",
      email: "carino.ryah@acdp.com",
      phone: "09123456791",
      address: "789 Pine Rd",
      age: 32,
      dateOfBirth: "1994-11-08",
      sex: "Male",
    },
    {
      id: "FLD-0002",
      firstName: "Dane Andrea",
      middleName: "Dela Cruz",
      lastName: "Bautista",
      username: "Dane",
      position: "Field Employee",
      status: "Active",
      email: "bautista.dane@acdp.com",
      phone: "09123456792",
      address: "321 Elm St",
      age: 29,
      dateOfBirth: "1997-05-14",
      sex: "Female",
    },
    {
      id: "FLD-0003",
      firstName: "Claret",
      lastName: "Santos",
      username: "claret",
      position: "Field Employee",
      status: "Inactive",
      email: "santos.claret@acdp.com",
      phone: "09123456793",
      address: "654 Maple Dr",
      age: 26,
      dateOfBirth: "2000-01-30",
      sex: "Female",
    },
    {
      id: "FLD-0004",
      firstName: "Test",
      lastName: "Kahit",
      username: "Kahitano",
      position: "Field Employee",
      status: "Active",
      email: "test.kahit@acdp.com",
      phone: "09123456794",
      address: "987 Cedar Ln",
      age: 31,
      dateOfBirth: "1995-09-03",
      sex: "Male",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    username: "",
    position: "Assistant" as "Administrator" | "Assistant" | "Field Employee",
    email: "",
    phone: "",
    address: "",
    age: 0,
    dateOfBirth: "",
    sex: "Male" as "Male" | "Female",
  });

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddEmployee = () => {
    if (
      newEmployee.firstName &&
      newEmployee.lastName &&
      newEmployee.username &&
      newEmployee.email
    ) {
      const nextNumber = (
        Math.max(
          ...employees
            .filter((e) => e.position === newEmployee.position)
            .map((e) => parseInt(e.id.split("-")[1]) || 0)
        ) || 0
      ) + 1;

      const newId = `${positionPrefixes[newEmployee.position]}-${String(nextNumber).padStart(4, "0")}`;

      const employee: Employee = {
        id: newId,
        firstName: newEmployee.firstName,
        middleName: newEmployee.middleName,
        lastName: newEmployee.lastName,
        username: newEmployee.username,
        position: newEmployee.position,
        status: "Active",
        email: newEmployee.email,
        phone: newEmployee.phone,
        address: newEmployee.address,
        age: newEmployee.age,
        dateOfBirth: newEmployee.dateOfBirth,
        sex: newEmployee.sex,
      };

      setEmployees([...employees, employee]);
      setShowAddForm(false);
      setNewEmployee({
        firstName: "",
        middleName: "",
        lastName: "",
        username: "",
        position: "Assistant",
        email: "",
        phone: "",
        address: "",
        age: 0,
        dateOfBirth: "",
        sex: "Male",
      });
    }
  };

  const handleArchiveEmployee = (id: string) => {
    setEmployees(
      employees.map((emp) =>
        emp.id === id ? { ...emp, status: "Inactive" } : emp
      )
    );
    setSelectedEmployee(null);
    setShowModal(false);
  };

  const handleUnarchiveEmployee = (id: string) => {
    setEmployees(
      employees.map((emp) =>
        emp.id === id ? { ...emp, status: "Active" } : emp
      )
    );
    setSelectedEmployee(null);
    setShowModal(false);
  };

  return (
    <div className="flex-1 px-4 md:px-6 lg:px-7 py-4 md:py-6 overflow-y-auto space-y-6">
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
        <div className="text-xs text-muted">
          Total Employees: {employees.length}
        </div>
      </div>

      {/* Search and Actions Bar */}
      <div className="bg-white rounded-2xl border border-border p-4 flex flex-col md:flex-row md:items-center gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search Term"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-accent-2"
          />
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-accent-2 text-white rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <Plus size={16} />
          Add Employee
        </button>
        <button className="px-4 py-2 bg-navy text-white rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity whitespace-nowrap">
          Database
        </button>
      </div>

      {/* Employees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEmployees.map((employee) => (
          <div
            key={employee.id}
            className="bg-white border-2 border-navy rounded-2xl p-4 flex flex-col gap-3 hover:shadow-lg transition-shadow"
          >
            {/* Card Header with ID and Actions */}
            <div className="flex items-start justify-between gap-2">
              <div className="font-rajdhani text-lg font-bold text-navy">
                {employee.id}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedEmployee(employee);
                    setShowModal(true);
                  }}
                  className="p-1.5 rounded-lg hover:bg-navy/10 transition-colors text-navy"
                  title="View details"
                >
                  <Info size={18} />
                </button>
                <button
                  onClick={() => handleArchiveEmployee(employee.id)}
                  className="p-1.5 rounded-lg hover:bg-red/10 transition-colors text-red"
                  title="Archive employee"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {/* Employee Info */}
            <div>
              <div className="font-semibold text-navy text-sm">
                {employee.firstName} {employee.middleName && employee.middleName + " "}
                {employee.lastName}
              </div>
              <div className="text-xs text-muted mt-0.5">{employee.username}</div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${positionColors[employee.position]}`}
              >
                {employee.position}
              </span>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  employee.status === "Active"
                    ? "bg-green/20 text-green"
                    : "bg-red/20 text-red"
                }`}
              >
                {employee.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredEmployees.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted">No employees found matching your search.</p>
        </div>
      )}

      {/* View/Edit Modal */}
      {showModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-rajdhani text-xl font-bold text-navy">
                Employee Details
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-off-white rounded transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-muted font-semibold uppercase">
                  Employee ID
                </p>
                <p className="text-navy font-semibold">{selectedEmployee.id}</p>
              </div>
              <div>
                <p className="text-xs text-muted font-semibold uppercase">
                  Full Name
                </p>
                <p className="text-navy">
                  {selectedEmployee.firstName} {selectedEmployee.middleName && selectedEmployee.middleName + " "}
                  {selectedEmployee.lastName}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted font-semibold uppercase">
                  Username
                </p>
                <p className="text-navy">{selectedEmployee.username}</p>
              </div>
              <div>
                <p className="text-xs text-muted font-semibold uppercase">
                  Position
                </p>
                <p className="text-navy">{selectedEmployee.position}</p>
              </div>
              <div>
                <p className="text-xs text-muted font-semibold uppercase">
                  Status
                </p>
                <p
                  className={`font-semibold ${
                    selectedEmployee.status === "Active"
                      ? "text-green"
                      : "text-red"
                  }`}
                >
                  {selectedEmployee.status}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted font-semibold uppercase">
                  Email
                </p>
                <p className="text-navy">{selectedEmployee.email}</p>
              </div>
              <div>
                <p className="text-xs text-muted font-semibold uppercase">
                  Phone
                </p>
                <p className="text-navy">{selectedEmployee.phone}</p>
              </div>
              <div>
                <p className="text-xs text-muted font-semibold uppercase">
                  Address
                </p>
                <p className="text-navy">{selectedEmployee.address}</p>
              </div>
              <div>
                <p className="text-xs text-muted font-semibold uppercase">
                  Age
                </p>
                <p className="text-navy">{selectedEmployee.age}</p>
              </div>
              <div>
                <p className="text-xs text-muted font-semibold uppercase">
                  Date of Birth
                </p>
                <p className="text-navy">{selectedEmployee.dateOfBirth}</p>
              </div>
              <div>
                <p className="text-xs text-muted font-semibold uppercase">
                  Sex
                </p>
                <p className="text-navy">{selectedEmployee.sex}</p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex gap-2">
              {selectedEmployee.status === "Active" ? (
                <button
                  onClick={() =>
                    handleArchiveEmployee(selectedEmployee.id)
                  }
                  className="flex-1 px-4 py-2 bg-red/10 text-red rounded-lg font-semibold text-sm hover:bg-red/20 transition-colors"
                >
                  Archive
                </button>
              ) : (
                <button
                  onClick={() =>
                    handleUnarchiveEmployee(selectedEmployee.id)
                  }
                  className="flex-1 px-4 py-2 bg-green/10 text-green rounded-lg font-semibold text-sm hover:bg-green/20 transition-colors"
                >
                  Unarchive
                </button>
              )}
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 bg-off-white text-navy rounded-lg font-semibold text-sm hover:bg-navy/10 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-rajdhani text-xl font-bold text-navy">
                Add Employee
              </h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-1 hover:bg-off-white rounded transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <input
                type="text"
                placeholder="First Name *"
                value={newEmployee.firstName}
                onChange={(e) =>
                  setNewEmployee({
                    ...newEmployee,
                    firstName: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-accent-2"
              />
              <input
                type="text"
                placeholder="Middle Name"
                value={newEmployee.middleName}
                onChange={(e) =>
                  setNewEmployee({
                    ...newEmployee,
                    middleName: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-accent-2"
              />
              <input
                type="text"
                placeholder="Last Name *"
                value={newEmployee.lastName}
                onChange={(e) =>
                  setNewEmployee({
                    ...newEmployee,
                    lastName: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-accent-2"
              />
              <input
                type="text"
                placeholder="Username *"
                value={newEmployee.username}
                onChange={(e) =>
                  setNewEmployee({
                    ...newEmployee,
                    username: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-accent-2"
              />
              <input
                type="email"
                placeholder="Email *"
                value={newEmployee.email}
                onChange={(e) =>
                  setNewEmployee({
                    ...newEmployee,
                    email: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-accent-2"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={newEmployee.phone}
                onChange={(e) =>
                  setNewEmployee({
                    ...newEmployee,
                    phone: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-accent-2"
              />
              <input
                type="text"
                placeholder="Address"
                value={newEmployee.address}
                onChange={(e) =>
                  setNewEmployee({
                    ...newEmployee,
                    address: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-accent-2"
              />
              <input
                type="number"
                placeholder="Age"
                value={newEmployee.age || ""}
                onChange={(e) =>
                  setNewEmployee({
                    ...newEmployee,
                    age: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-accent-2"
              />
              <input
                type="date"
                placeholder="Date of Birth"
                value={newEmployee.dateOfBirth}
                onChange={(e) =>
                  setNewEmployee({
                    ...newEmployee,
                    dateOfBirth: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-accent-2"
              />
              <select
                value={newEmployee.sex}
                onChange={(e) =>
                  setNewEmployee({
                    ...newEmployee,
                    sex: e.target.value as "Male" | "Female",
                  })
                }
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-accent-2"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <select
                value={newEmployee.position}
                onChange={(e) =>
                  setNewEmployee({
                    ...newEmployee,
                    position: e.target.value as "Administrator" | "Assistant" | "Field Employee",
                  })
                }
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-accent-2"
              >
                <option value="Assistant">Assistant</option>
                <option value="Field Employee">Field Employee</option>
                <option value="Administrator">Administrator</option>
              </select>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex gap-2">
              <button
                onClick={handleAddEmployee}
                className="flex-1 px-4 py-2 bg-accent-2 text-white rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                Add Employee
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 px-4 py-2 bg-off-white text-navy rounded-lg font-semibold text-sm hover:bg-navy/10 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
