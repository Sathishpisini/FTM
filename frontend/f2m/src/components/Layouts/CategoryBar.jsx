import { useNavigate } from "react-router-dom";

const categories = [
  { name: "ALL", icon: "🛒" },
  { name: "FRUITS", icon: "🍎" },
  { name: "VEGETABLES", icon: "🥦" },
  { name: "GRAINS", icon: "🌾" },
  { name: "DAIRY", icon: "🥛" },
  { name: "POULTRY", icon: "🍗" },
  { name: "SPICES", icon: "🌶️" },
  { name: "OTHERS", icon: "📦" }
];

export const CategoryBar = () => {
  const navigate = useNavigate();

  const handleClick = (catName) => {
    const category = catName.toLowerCase();
    navigate(`/explore-products?category=${category}`);
  };

  return (
    <div className="
      flex gap-4 overflow-x-auto px-4 py-2
      bg-white border-t border-gray-200
      dark:bg-gray-900 dark:border-gray-700
    ">
      {categories.map((cat) => (
        <button
          key={cat.name}
          onClick={() => handleClick(cat.name)}
          className="
            flex flex-col items-center min-w-[70px] p-2 rounded-lg
            bg-gray-100 hover:bg-gray-200
            dark:bg-gray-800 dark:hover:bg-gray-700
            transition
          "
        >
          <span className="text-2xl">{cat.icon}</span>

          <span className="
            text-xs font-medium
            text-gray-800
            dark:text-gray-200
          ">
            {cat.name}
          </span>
        </button>
      ))}
    </div>
  );
};