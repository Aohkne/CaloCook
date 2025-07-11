import UserTable from "../components/UserTable";
import FilterBar from "../components/FilterBar";
import { useState } from "react";

const userFields = [
  { name: "username", label: "Username", type: "text" },
  { name: "email", label: "Email", type: "text" },
  {
    name: "isActive",
    label: "Active",
    type: "select",
    options: ["true", "false"],
  },
  {
    name: "sortBy",
    label: "Sort By",
    type: "select",
    options: ["username", "email", "createdAt"],
  },
  { name: "order", label: "Order", type: "select", options: ["asc", "desc"] },
];
export default function UserManagementPage() {
  const [filters, setFilters] = useState({});

  return (
    <div>
      <h2 className="text-3xl font-bold h-10 items-center flex">
        User Management
      </h2>
      <p className="text-gray-600">
        Manage user accounts, permissions and roles.
      </p>
      <div className="mt-5">
        <FilterBar fields={userFields} onFilter={setFilters} />
      </div>
      {/* User Table */}
      <UserTable filters={filters} />
    </div>
  );
}
