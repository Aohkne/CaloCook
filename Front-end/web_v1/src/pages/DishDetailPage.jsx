import { Link, useParams } from "react-router-dom";
import DishDetail from "../components/DishDetail";
import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { getDishById } from "../api/dish";
import { getIngredientsByDishId } from "../api/ingredient";
import { useAuth } from "../components/AuthContext";
import { Tabs } from "antd";
import DishTabs from "../components/DishTabs";
import { handleApiError } from "../utils/handleApiError";
import { getStepByDishId } from "../api/step";

export default function DishDetailPage() {
  const { accessToken } = useAuth();
  const { id } = useParams();
  const [dish, setDish] = useState({});
  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps] = useState([]);
  async function fetchAllData() {
    // Dish is required
    try {
      const dishRes = await getDishById({ accessToken, id });
      setDish(dishRes.data);
    } catch (error) {
      handleApiError(error);
      return; // if dish not found, don't proceed
    }

    // Ingredients are optional
    try {
      const ingredientsRes = await getIngredientsByDishId({
        accessToken,
        dishId: id,
      });
      setIngredients(ingredientsRes.data || []);
    } catch (error) {
      console.warn("No ingredients found or failed to fetch.", error);
      setIngredients([]);
    }

    // Steps are optional
    try {
      const stepsRes = await getStepByDishId({ accessToken, dishId: id });
      setSteps(stepsRes.data || []);
    } catch (error) {
      console.warn("No steps found or failed to fetch.", error);
      setSteps([]);
    }
  }

  useEffect(() => {
    fetchAllData();
  }, [id, accessToken]);
  return (
    <div className="pt-5">
      <Link to={"/dish"} className="flex gap-1 items-center text-sm">
        <ChevronLeft size={16} />
        Back to Dishes
      </Link>
      <DishDetail dish={dish} />
      <DishTabs
        ingredients={ingredients}
        steps={steps}
        onRefresh={fetchAllData}
      />
    </div>
  );
}
