import { useEffect, useState  } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getAllProducts,
  getSeasonalProducts,
  getFreshProducts,
  getOrganicProducts
} from "../../services/ProductsService";
import { ProductCard } from "../../components/Elements/ProductCard";
import { FilterBar } from "../../pages/Products/components/FilterBar";
import { useFilter } from "../../Context/FilterContext";

export const ExploreProductsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ USE GLOBAL FILTER STATE
  const { state, products, initialProductList } = useFilter();

  const [show, setShow] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get("type");
  const category = queryParams.get("category");

  // ✅ FETCH DATA
  useEffect(() => {
  const fetchData = async () => {
    let data = [];

    if (type === "seasonal") data = await getSeasonalProducts();
    else if (type === "fresh") data = await getFreshProducts();
    else if (type === "organic") data = await getOrganicProducts();
    else data = await getAllProducts();

    if (category && category !== "all") {
      data = data.filter(
        (p) =>
          p.productCategory?.toLowerCase() === category.toLowerCase()
      );
    }

    // ✅ IMPORTANT: Only update if data changed
    if (JSON.stringify(products) !== JSON.stringify(data)) {
      initialProductList(data);
    }
  };

  fetchData();
}, [type, category]); // ❌ DO NOT add products here

  // ✅ SAME FILTER LOGIC AS PRODUCT LIST
  const applyFilters = (products, state) => {
    let filtered = [...products];

    if (state.category && state.category !== "ALL") {
      filtered = filtered.filter(
        (p) => p.productCategory?.toUpperCase() === state.category
      );
    }

    if (state.onlyInStock) {
      filtered = filtered.filter((p) => p.quantityAvailable > 0);
    }

    if (state.seasonalOnly) {
      filtered = filtered.filter((p) => p.seasonal === true);
    }

    if (state.organicOnly) {
      filtered = filtered.filter((p) => p.organic === true);
    }

    if (state.freshOnly) {
        const now = new Date();

        filtered = filtered.filter((p) => {
            if (!p.createdAt) return false;

            const createdDate = new Date(p.createdAt);

            const diffTime = now - createdDate; // milliseconds
            const diffDays = diffTime / (1000 * 60 * 60 * 24);

            return diffDays <= 2;
        });
        }

    // ✅ SORT
    if (state.sortBy === "lowtohigh") {
      filtered.sort((a, b) => a.pricePerKg - b.pricePerKg);
    }

    if (state.sortBy === "hightolow") {
      filtered.sort((a, b) => b.pricePerKg - a.pricePerKg);
    }

    if (state.sortBy === "qtylowtohigh") {
      filtered.sort((a, b) => a.quantityAvailable - b.quantityAvailable);
    }

    if (state.sortBy === "qtyhightolow") {
      filtered.sort((a, b) => b.quantityAvailable - a.quantityAvailable);
    }

    return filtered;
  };

  const filteredProducts = applyFilters(products, state);

  // ✅ TITLE
  const getTitle = () => {
    let baseTitle = "";

    if (type === "seasonal") baseTitle = "Seasonal Products";
    else if (type === "fresh") baseTitle = "Fresh Products";
    else if (type === "organic") baseTitle = "Organic Products";
    else baseTitle = "All Products";

    if (category && category !== "all") {
      return `${category.toUpperCase()} PRODUCTS`;
    }

    return baseTitle.toUpperCase();
  };

  return (
    <div className="flex">

      {/* ✅ FILTER SIDEBAR */}
      {show && (
        <div className="fixed left-0 top-0 z-50">
          <FilterBar setShow={setShow} />
        </div>
      )}

      {/* ✅ MAIN CONTENT */}
      <div className="flex-1 px-4 py-6">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{getTitle()}</h1>

          {/* 3 DOT BUTTON */}
          <button
            onClick={() => setShow(!show)}
            className="p-2 bg-gray-200 rounded"
          >
            ☰
          </button>
        </div>

        {/* PRODUCTS */}
        {filteredProducts.length === 0 ? (
          <p>No products found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* BACK */}
        <button
          onClick={() => navigate("/")}
          className="mt-6 bg-gray-600 text-white px-4 py-2 rounded"
        >
          Back
        </button>

      </div>
    </div>
  );
};