import { Heart } from "lucide-react";

export default function TopFavoriteBoard({ dishes, className }) {
  return (
    <div className={`border border-black/10 rounded-lg p-4 ${className}`}>
      <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
        <Heart color="red" size={20} /> Top 10 Favorite Dishes
      </h3>
      <ul>
        {dishes.map((dish, index) => (
          <li
            key={dish._id}
            className="flex border border-black/10 p-2 rounded-md justify-between mt-3"
          >
            <div className="flex gap-3 items-center">
              <p className="text-black/60 font-semibold border-r border-black/10 pl-2 pr-4">
                {index + 1}
              </p>
              <p>{dish.dish.name}</p>
            </div>
            <div className="flex items-center gap-2">
              <p>
                <Heart fill="red" color="red" size={16} />
              </p>
              <p className="text-black/50 font-semibold">
                {dish.favoriteCount}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
