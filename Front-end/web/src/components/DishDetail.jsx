import { Image } from "antd";
import { Clock, Flame, Pencil } from "lucide-react";

export default function DishDetail({ dish }) {
  const renderDifficultyBadge = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return (
          <span className="px-3 py-1 rounded-full bg-green-50 text-green-900 border border-green-500">
            Easy
          </span>
        );
      case "medium":
        return (
          <span className="px-3 py-1 rounded-full bg-yellow-50 text-yellow-900 border border-yellow-500">
            Medium
          </span>
        );
      case "hard":
        return (
          <span className="px-3 py-1 rounded-full bg-red-50 text-red-900 border border-red-500">
            Hard
          </span>
        );
      default:
        return null;
    }
  };
  return (
    <div className="flex flex-col md:flex-row items-center gap-4 mt-5">
      <div>
        <Image
          src={dish.imageUrl}
          width={150}
          height={100}
          className="rounded-md object-cover border border-black/20"
        />
      </div>
      <div>
        {/* Dish Title */}
        <h1 className="text-3xl font-bold">{dish.name}</h1>

        {/* Description */}
        <p className="text-gray-500 mt-1">{dish.description}</p>

        {/* Info Chips */}
        <div className="flex flex-wrap items-center gap-3 mt-3 text-sm">
          <div className="flex items-center gap-0.5 text-black/70">
            <Clock size={16} />
            Cook: {dish.cookingTime} mins
          </div>
          <div className="flex items-center text-black/70">
            <Flame size={16} />
            Calories: {dish.calorie}
          </div>
          <div className="flex gap-2 items-center">
            {renderDifficultyBadge(dish.difficulty)}
            {dish.isActive ? (
              <span className="border border-green-500 bg-green-50 text-green-900 px-3 py-1 rounded-full">
                Active
              </span>
            ) : (
              <span className="border border-red-500 bg-red-50 text-red-900 px-3 py-1 rounded-full">
                Banned
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
