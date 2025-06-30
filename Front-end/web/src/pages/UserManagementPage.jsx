import { useState } from "react";
import UserTable from "../components/UserTable";
import Tabs from "../components/Tabs";
import SearchBar from "../components/SearchBar";

export default function UserManagementPage() {
  // Tabs states
  const [selectedTab, setSelectedTab] = useState("All Users");
  // Search states
  const [searchText, setSearchText] = useState("");
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
        placeholder={"Search user..."}
        classname={"mb-5 mt-5"}
        searchText={searchText}
        setSearchText={setSearchText}
      />
      {/* User Table */}
      <UserTable tabs={selectedTab} searchText={searchText} />
    </div>
  );
}
