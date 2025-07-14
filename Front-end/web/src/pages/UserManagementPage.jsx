import UserTable from "../components/UserTable";
import { useState } from "react";
import FilterModal from "../components/FilterModal";
import SearchBar from "../components/SearchBar";

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
  const [search, setSearch] = useState("");

  // Combine filters and search for UserTable
  const combinedFilters = { ...filters };
  if (search) {
    combinedFilters.username = search;
    // Or use 'email' if you want to search by email
    // combinedFilters.email = search;
  }

  return (
    <div>
      <h2 className="text-xl md:text-3xl font-bold h-10 items-center flex">
        User Management
      </h2>
      <p className="text-gray-600">
        Manage user accounts, permissions and roles.
      </p>
      <div className="flex gap-2 mt-5 mb-5">
        <SearchBar
          placeholder="Search username..."
          onSearch={({ search }) => setSearch(search)}
        />
        <FilterModal fields={userFields} onFilter={setFilters} />
      </div>
      {/* User Table */}
      <UserTable filters={combinedFilters} />
    </div>
  );
}
