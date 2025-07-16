import UserTable from "../components/UserTable";
import { useState } from "react";
import UserFilterBar from "../components/UserFilterBar";

export default function UserManagementPage() {
  const [filters, setFilters] = useState({});

  return (
    <div>
      <h2 className="text-xl md:text-3xl font-bold h-10 items-center flex">
        User Management
      </h2>
      <p className="text-gray-600">
        Manage user accounts, permissions and roles.
      </p>
      <div className="flex gap-2 mt-5 mb-5">
        <UserFilterBar onChange={setFilters} />
      </div>
      {/* User Table */}
      <UserTable filters={filters} />
    </div>
  );
}
