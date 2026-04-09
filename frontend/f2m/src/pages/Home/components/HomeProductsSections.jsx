import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllProducts,
  getSeasonalProducts,
  getFreshProducts,
  getOrganicProducts
} from "../../../services/ProductsService";
import { ProductCard } from "../../../components/Elements/ProductCard";

export const HomeProductsSections = () => {
  const [products, setProducts] = useState([]);
  const [seasonalProducts, setSeasonalProducts] = useState([]);
  const [freshProducts, setFreshProducts] = useState([]);
  const [organicProducts, setOrganicProducts] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    getAllProducts().then(setProducts);
    getSeasonalProducts().then(setSeasonalProducts);
    getFreshProducts().then(setFreshProducts);
    getOrganicProducts().then(setOrganicProducts);
  }, []);

  return (
    <div className="px-4 py-6">

      <ProductSection
        title="All Products"
        data={products}
        route="/explore-products?type=all"
        navigate={navigate}
      />

      <ProductSection
        title="Seasonal Products"
        data={seasonalProducts}
        route="/explore-products?type=seasonal"
        navigate={navigate}
      />

      <ProductSection
        title="Fresh Products"
        data={freshProducts}
        route="/explore-products?type=fresh"
        navigate={navigate}
      />

      <ProductSection
        title="Organic Products"
        data={organicProducts}
        route="/explore-products?type=organic"
        navigate={navigate}
      />

    </div>
  );
};

function ProductSection({ title, data, route, navigate }) {
  return (
    <div className="mb-10">
      <div className="flex flex-wrap justify-between items-center mb-4 px-2 gap-2">
        <h2 className="text-xl font-bold">{title}</h2>

        <button
          onClick={() => navigate(route)}
          className="bg-blue-600 text-white px-4 py-2 rounded whitespace-nowrap"
        >
          Explore All
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto scrollbar-hide px-2 pb-2">
        {data.map((product) => (
          <div key={product.id} className="min-w-[250px] flex-shrink-0">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}