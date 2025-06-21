export default function Tabs({ tabs, selectedTab, setSelectedTab }) {
  return (
    <div className="h-10 bg-gray-100 inline-flex font-semibold px-1 items-center justify-center rounded-md text-gray-400 mt-4 select-none">
      {tabs.map((tab) => (
        <button
          key={tab}
          role="tab"
          aria-selected={selectedTab === tab}
          className="aria-selected:bg-white aria-selected:text-black py-1.5 px-3 rounded-md hover:cursor-pointer text-sm transition-all"
          onClick={() => setSelectedTab(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
