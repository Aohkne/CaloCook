import { Link } from "react-router-dom";

export default function SidebarButton({ icon, text, link, ariaSelected }) {
  return (
    <Link
      aria-selected={ariaSelected}
      to={link}
      className={`
          ${text ? "w-full" : "w-auto"}
          aria-selected:bg-white/20 aria-selected:border-white/30
          flex items-center p-2 hover:bg-white/20 border border-transparent hover:border-white/30 transition-all rounded-md hover:cursor-pointer`}
    >
      {icon && icon}
      {text && (
        <span
          className={`${icon ? "ml-2" : ""} whitespace-nowrap overflow-hidden`}
        >
          {text}
        </span>
      )}
    </Link>
  );
}
