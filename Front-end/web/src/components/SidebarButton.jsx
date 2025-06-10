export default function SidebarButton({ icon, text }) {
  return (
    <button className="flex items-center p-2 w-full hover:bg-gray-200 rounded-md hover:cursor-pointer aria-selected:bg-gray-200">
      {icon}
      <span className="ml-2">{text}</span>
    </button>
  );
}
