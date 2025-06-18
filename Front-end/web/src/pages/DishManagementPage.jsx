import { Search } from "lucide-react";
import { useState } from "react";
import UserTable from "../components/UserTable";
import Tabs from "../components/Tabs";

export default function DishManagementPage() {
  const [selectedTab, setSelectedTab] = useState("All Users");
  const tabs = ["All Users", "Active", "Banned"];
  return (
    <div>
      <h2 className="text-3xl font-bold h-10 items-center flex">
        Dish Management
      </h2>
      <p className="text-gray-600">
        Manage dish details, ingredients, and categories.
      </p>
      {/* Tabs */}
      <Tabs
        tabs={tabs}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
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
