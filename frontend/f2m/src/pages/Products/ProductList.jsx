import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ProductCard } from "./../../components/Elements/ProductCard";
import { getAllProducts } from "../../services/ProductsService";
import { FilterBar } from "./components/FilterBar";
import { useTitle } from "../../hooks/UseTitle";
import { useFilter } from "../../Context/FilterContext";

export function ProductList() {
  useTitle("Products Page");

  // ✅ get products + filter state
  const { products, initialProductList, state } = useFilter();

  const [show, setShow] = useState(false);

  const location = useLocation();
  const searchTerm = new URLSearchParams(location.search).get("q");

  // ✅ get user role
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  // ✅ FETCH PRODUCTS
  useEffect(() => {
    async function fetchData() {
      const data = await getAllProducts();

      let filteredProducts = data;

      // ✅ SEARCH FILTER
      if (searchTerm) {
        filteredProducts = data.filter((product) =>
          product.productName
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        );
      }

      initialProductList(filteredProducts);
    }

    fetchData();
  }, [searchTerm]);

  // ✅ 🔥 MAIN FILTER FUNCTION (CATEGORY + OTHERS)
  const applyFilters = (products, state) => {
    let filtered = [...products];

    // ✅ CATEGORY FILTER
    if (state.category && state.category !== "ALL") {
      filtered = filtered.filter(
        (p) => p.productCategory?.toUpperCase() === state.category
      );
    }

    // ✅ STOCK FILTER (if you use it)
    if (state.onlyInStock) {
      filtered = filtered.filter((p) => p.quantityAvailable );
    }

    // ✅ ADD OTHER FILTERS HERE IF NEEDED

    return filtered;
  };

  // ✅ FINAL FILTERED PRODUCTS
  const filteredProducts = applyFilters(products, state);

  return (
    <main className="w-full overflow-x-hidden pt-20">

      <section className="my-5 px-4">

        {/* HEADER */}
        <div className="my-5 flex justify-between items-center flex-wrap gap-2">

          <span className="text-2xl font-semibold dark:text-slate-100">
            All Products ({filteredProducts.length})
          </span>

          <button
            onClick={() => setShow(!show)}
            className="inline-flex items-center p-2 text-sm font-medium text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200 dark:text-white dark:bg-gray-600 dark:hover:bg-gray-700"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
            </svg>
          </button>

        </div>

        {/* PRODUCT LIST */}
        <div className="flex flex-wrap justify-center gap-4">

          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product.id} className="w-[250px]">
                <ProductCard product={product} role={role} />
              </div>
            ))
          ) : (
            <p className="text-lg text-gray-500 dark:text-gray-300">
              No products found
            </p>
          )}

        </div>

      </section>

      {/* FILTER SIDEBAR */}
      {show && <FilterBar setShow={setShow} />}

    </main>
  );
}

export default ProductList;