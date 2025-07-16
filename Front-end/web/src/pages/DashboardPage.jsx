import { Soup, User, Users } from "lucide-react";
import Card from "../components/Card";
import { useEffect, useState } from "react";
import { userCount, dishCount, getTopFavorites } from "../api/dashboard";
import { useAuth } from "../components/AuthContext";
import TopFavoriteBoard from "../components/TopFavoriteBoard";
export default function DashboardPage() {
  const { accessToken } = useAuth();
  const [users, setUsers] = useState(0);
  const [dishes, setDishes] = useState(0);
  const [topFavorites, setTopFavorites] = useState([]);

  // Fetch user and dish counts from the API
  // and update the state variables
  const fetchData = async () => {
    const userCountResponse = await userCount(accessToken);
    const dishCountResponse = await dishCount(accessToken);
    const topFavoritesResponse = await getTopFavorites({
      accessToken,
      limit: 10,
    });
    setUsers(userCountResponse.data);
    setDishes(dishCountResponse.data);
    setTopFavorites(topFavoritesResponse.data);
    console.log(topFavoritesResponse.data);
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
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4  ">
        <Card
          className={"col-span-2 md:col-span-1"}
          title={"Total Users"}
          value={users}
          icon={<Users size={20} color="gray" />}
        />
        <Card
          className={"col-span-2 md:col-span-1"}
          title={"Total Dishes"}
          value={dishes}
          icon={<Soup size={20} color="gray" />}
        />
        <TopFavoriteBoard className={"col-span-2"} dishes={topFavorites} />
      </div>
    </div>
  );
}
