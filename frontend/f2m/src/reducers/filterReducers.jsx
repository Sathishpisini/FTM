export const filterReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {

    case "PRODUCT_LIST":
      return { ...state, productList: payload.products };

    case "SORT_BY":
      return { ...state, sortBy: payload.sortBy };

    case "ONLY_IN_STOCK":
      return { ...state, onlyInStock: payload };

    // ✅ NEW FILTERS
    case "SEASONAL_ONLY":
      return { ...state, seasonalOnly: payload };

    case "ORGANIC_ONLY":
      return { ...state, organicOnly: payload };

    case "FRESH_ONLY":
      return { ...state, freshOnly: payload };

    case "NEARBY_ONLY":
      return { ...state, nearbyOnly: payload };

    case "FILTER_BY_CATEGORY":
    return {
        ...state, category: payload};
        
    case "CLEAR_FILTER":
      return {
        ...state,
        onlyInStock: false,
        sortBy: null,
        seasonalOnly: false,
        organicOnly: false,
        freshOnly: false,
        nearbyOnly: false
      };

    default:
      throw new Error("No Case Found!");
  }
};