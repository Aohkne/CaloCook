import {
  Carrot,
  ChartColumn,
  ChevronLeft,
  ChevronRight,
  DoorOpen,
  ListOrderedIcon,
  Soup,
  User,
  Users,
} from "lucide-react";
import SidebarButton from "./SidebarButton";
import { useEffect, useState } from "react";
import logoFull from "../assets/logo-full.png";
import { useLocation } from "react-router-dom";
import SettingMenu from "./SettingMenu";
export default function Sidebar() {
  const [expanded, setExpanded] = useState(true);
  const location = useLocation();
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
      className={`relative flex flex-col gap-5 m-2 rounded-md h-[calc(100vh-1rem)] select-none ${
        expanded ? "w-[250px]" : "w-[60px]"
      } bg-[#006955] p-5 text-white shadow-lg transition-all`}
    >
      {/* Expand button */}
      <button
        className={`absolute ${
          expanded ? "right-5" : "static self-center"
        } flex items-center justify-center w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 text-white shadow transition-all border border-white/30 hover:cursor-pointer`}
        onClick={() => setExpanded((prev) => !prev)}
        aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
        type="button"
      >
        {expanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>
      {expanded && <img src={logoFull} className="w-40" />}

      {/* Sidebar item list */}
      <ul className="flex flex-col items-center gap-1 transition-al h-full">
        {expanded ? (
          <>
            <SidebarButton
              icon={<ChartColumn />}
              text="Dashboard"
              link="/dashboard"
              ariaSelected={location.pathname === "/dashboard"}
            />
            <SidebarButton
              icon={<Users />}
              text="Users"
              link="/users"
              ariaSelected={location.pathname === "/users"}
            />
            <SidebarButton
              icon={<Soup />}
              text="Dishes"
              link="/dishes"
              ariaSelected={location.pathname === "/dishes"}
            />
            <SidebarButton
              icon={<Carrot />}
              text="Ingredients"
              link="/ingredients"
              ariaSelected={location.pathname === "/ingredients"}
            />
            <SidebarButton
              icon={<ListOrderedIcon />}
              text="Steps"
              link="/steps"
              ariaSelected={location.pathname === "/steps"}
            />
            <div className="mt-auto w-full flex">
              <SettingMenu />
            </div>
          </>
        ) : (
          <>
            <SidebarButton
              icon={<ChartColumn />}
              link="/dashboard"
              ariaSelected={location.pathname === "/dashboard"}
            />
            <SidebarButton
              icon={<Users />}
              link="/users"
              ariaSelected={location.pathname === "/users"}
            />
            <SidebarButton
              icon={<Soup />}
              link="/dishes"
              ariaSelected={location.pathname === "/dishes"}
            />
            <SidebarButton
              icon={<Carrot />}
              link="/ingredients"
              ariaSelected={location.pathname === "/ingredients"}
            />
            <SidebarButton
              icon={<ListOrderedIcon />}
              link="/steps"
              ariaSelected={location.pathname === "/steps"}
            />
            <SidebarButton
              icon={<User />}
              link="/profile"
              ariaSelected={location.pathname === "/profile"}
              classname="mt-auto "
            />
            <SidebarButton
              icon={<DoorOpen />}
              link="/logout"
              ariaSelected={location.pathname === "/logout"}
            />
          </>
        )}
      </ul>
    </div>
  );
}
