import { Outlet } from "react-router-dom";
import "./App.css";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <div className="w-full flex h-screen">
      <Sidebar />
      <main className="w-full px-5 py-3 flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
