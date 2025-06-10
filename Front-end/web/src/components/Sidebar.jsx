import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import SidebarButton from "./SidebarButton";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const [expanded, setExpanded] = useState(true);
  // Auto resize sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setExpanded(false);
      } else {
        setExpanded(true);
      }
    };

    window.addEventListener("resize", handleResize);

    // Set initial state based on current width
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div
      className={`h-screen ${
        expanded ? "w-[260px]" : "w-[60px]"
      } bg-[#FAFAFA] p-5`}
    >
      <button
        className="hover:cursor-pointer"
        onClick={() => setExpanded((prev) => !prev)}
      >
        {expanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>
      {expanded && <h2 className="text-lg">Calocook</h2>}
      {expanded && <p className="text-gray-600 text-sm">Main Navigation</p>}
      <ul>
        {expanded ? (
          <SidebarButton icon={<Users />} text="Users Management" />
        ) : (
          <Users />
        )}
      </ul>
    </div>
  );
}
