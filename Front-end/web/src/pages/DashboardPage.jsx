import { Soup, User, Users } from "lucide-react";
import Card from "../components/Card";
import { useEffect, useState } from "react";
import { userCount, dishCount } from "../api/dashboard";
import { useAuth } from "../components/AuthContext";
export default function DashboardPage() {
  const { accessToken } = useAuth();
  const [users, setUsers] = useState(0);
  const [dishes, setDishes] = useState(0);

  // Fetch user and dish counts from the API
  // and update the state variables
  const fetchData = async () => {
    const userCountResponse = await userCount(accessToken);
    const dishCountResponse = await dishCount(accessToken);
    setUsers(userCountResponse.data);
    setDishes(dishCountResponse.data);
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div>
      <h2 className="text-xl md:text-3xl font-bold h-10 items-center flex">
        Dashboard
      </h2>
      <p className="text-gray-600">
        Manage dish details, ingredients, and categories.
      </p>
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4  ">
        <Card
          title={"Total Users"}
          value={users}
          icon={<Users size={20} color="gray" />}
        />
        <Card
          title={"Total Dishes"}
          value={dishes}
          icon={<Soup size={20} color="gray" />}
        />
        <Card
          title={"Total Ingredients"}
          value={"1000"}
          icon={<User size={20} color="gray" />}
        />
        <Card
          title={"Total Step"}
          value={"1000"}
          icon={<User size={20} color="gray" />}
        />
      </div>
    </div>
  );
}
