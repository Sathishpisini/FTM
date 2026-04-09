import { createContext, useContext, useReducer, useMemo } from "react"; // ✅ ADDED useMemo
import { filterReducer } from "../reducers";

const filterInitialState = {
  productList: [],
  onlyInStock: false,
  sortBy: null,

  // ✅ NEW FILTERS
  seasonalOnly: false,
  organicOnly: false,
  freshOnly: false,
  nearbyOnly: false,
  category: "ALL"
};

const FilterContext = createContext(filterInitialState);

export const FilterProvider = ({ children }) => {
  const [state, dispatch] = useReducer(filterReducer, filterInitialState);

  // ✅ SET INITIAL PRODUCTS
  function initialProductList(products) {
    dispatch({
      type: "PRODUCT_LIST",
      payload: { products }
    });
  }

  // ✅ FILTERS

  function inStock(products) {
    return state.onlyInStock
      ? products.filter(p => p.quantityAvailable > 0)
      : products;
  }

  function seasonal(products) {
    return state.seasonalOnly
      ? products.filter(p => p.seasonal === true)
      : products;
  }

  function organic(products) {
    return state.organicOnly
      ? products.filter(p => p.organic === true)
      : products;
  }

  function fresh(products) {
    if (!state.freshOnly) return products;

    const now = new Date();

    return products.filter(p => {
      if (!p.createdAt) return false;

      const created = new Date(p.createdAt);
      const diffDays = (now - created) / (1000 * 60 * 60 * 24);

      return diffDays <= 2;
    });
  }

  // ✅ BASIC NEARBY
  function nearby(products) {
    if (!state.nearbyOnly) return products;

    const userLat = 12.97;
    const userLng = 77.59;

    return products.filter(p => {
      if (!p.latitude || !p.longitude) return false;

      const distance = Math.sqrt(
        Math.pow(p.latitude - userLat, 2) +
        Math.pow(p.longitude - userLng, 2)
      );

      return distance < 0.5;
    });
  }

  // ✅ SORT
  function sort(products) {
    if (state.sortBy === "lowtohigh") {
      return [...products].sort((a, b) => a.pricePerKg - b.pricePerKg);
    }

    if (state.sortBy === "hightolow") {
      return [...products].sort((a, b) => b.pricePerKg - a.pricePerKg);
    }
    // ✅ NEW: Quantity sorting
  if (state.sortBy === "qtylowtohigh") {
    return [...products].sort(
      (a, b) => a.quantityAvailable - b.quantityAvailable
    );
  }

  if (state.sortBy === "qtyhightolow") {
    return [...products].sort(
      (a, b) => b.quantityAvailable - a.quantityAvailable
    );
  }
    return products;
  }

  // ✅ FINAL PIPELINE (UPDATED WITH useMemo)
  const filteredProductList = useMemo(() => {
    return sort(
      nearby(
        fresh(
          organic(
            seasonal(
              inStock(state.productList)
            )
          )
        )
      )
    );
  }, [
    state.productList,
    state.onlyInStock,
    state.seasonalOnly,
    state.organicOnly,
    state.freshOnly,
    state.nearbyOnly,
    state.sortBy
  ]);

  const value = {
    state,
    dispatch,
    products: filteredProductList,
    initialProductList
  };

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => useContext(FilterContext);