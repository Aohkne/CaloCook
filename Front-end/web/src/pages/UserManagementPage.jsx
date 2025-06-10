import { Search } from "lucide-react";
import { useState } from "react";
import UserTable from "../components/UserTable";

export default function UserManagementPage() {
  const [selectedTab, setSelectedTab] = useState("All Users");
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
      <div className="h-10 bg-gray-100 inline-flex font-semibold px-1 items-center justify-center rounded-md text-gray-400 mt-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={selectedTab === tab}
            className="aria-selected:bg-white aria-selected:text-black py-1.5 px-3 rounded-md hover:cursor-pointer text-sm"
            onClick={() => setSelectedTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      {/* Searchbar */}
      <div className="flex mt-5 gap-5 mb-5">
        <div className="flex flex-1 h-10 gap-2 border border-gray-300 rounded-md items-center px-3">
          <Search size={15} />
          <input placeholder="Search users..." className="outline-0 w-full" />
        </div>
        <button
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded="false"
          className="border border-gray-300 rounded-md h-10 w-[150px] text-start px-3 hover:cursor-pointer"
          tabIndex={0}
        >
          Filter by role
        </button>
      </div>
      <UserTable />
    </div>
  );
}
