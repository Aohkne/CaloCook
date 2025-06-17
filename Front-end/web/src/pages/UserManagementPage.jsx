import { useState } from "react";
import UserTable from "../components/UserTable";
import Tabs from "../components/Tabs";
import SearchBar from "../components/SearchBar";

export default function UserManagementPage() {
  const [selectedTab, setSelectedTab] = useState("All Users");
  const [searchText, setSearchText] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const tabs = ["All Users", "Active", "Banned"];
  return (
    <div>
      <h2 className="text-3xl font-bold h-10 items-center flex">
        User Management
      </h2>
      <p className="text-gray-600">
        Manage user accounts, permissions and roles.
      </p>
      {/* Tabs */}
      <Tabs
        tabs={tabs}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
      {/* Searchbar */}
      <SearchBar
        searchText={searchText}
        setSearchText={setSearchText}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
      />
      {/* User Table */}
      <UserTable
        tabs={selectedTab}
        searchText={searchText}
        roleFilter={roleFilter}
      />
    </div>
  );
}
