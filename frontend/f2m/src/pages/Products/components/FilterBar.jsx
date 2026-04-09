import { useFilter } from "./../../../Context/FilterContext";
import { useEffect, useRef } from "react";

export const FilterBar = ({ setShow }) => {
  const { state, dispatch } = useFilter();

  // ✅ REF FOR OUTSIDE CLICK
  const filterRef = useRef(null);

  // ✅ CLICK OUTSIDE LOGIC
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShow(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShow]);

  return (
    <section className="filter">
      <div
        ref={filterRef} // ✅ ATTACHED HERE
        className="fixed z-40 h-screen p-5 pt-40 overflow-y-auto bg-white w-72 dark:bg-gray-800 left-0 top-0"
      >

        {/* HEADER */}
        <h5 className="text-base font-semibold text-gray-500 uppercase dark:text-gray-400">
          Filters
        </h5>

        <button
          onClick={() => setShow(false)}
          className="absolute top-2.5 right-2.5 text-gray-400 hover:bg-gray-200 rounded-lg p-1.5"
        >
          ✖
        </button>

        <div className="border-b pb-3"></div>

        <div className="py-4">
          <ul className="text-slate-700 dark:text-slate-100">

            {/* ✅ SORT */}
            <li className="mb-5">
              <p className="font-semibold mb-2">Sort by</p>

              <div className="flex items-center pt-10">
                <input
                  type="radio"
                  name="sort"
                  checked={state.sortBy === "lowtohigh"}
                  onChange={() =>
                    dispatch({ type: "SORT_BY", payload: { sortBy: "lowtohigh" } })
                  }
                />
                <label className="ml-2">Price - Low to High</label>
              </div>

              <div className="flex items-center mt-1">
                <input
                  type="radio"
                  name="sort"
                  checked={state.sortBy === "hightolow"}
                  onChange={() =>
                    dispatch({ type: "SORT_BY", payload: { sortBy: "hightolow" } })
                  }
                />
                <label className="ml-2">Price - High to Low</label>
              </div>

              <div className="flex items-center mt-1">
                <input
                  type="radio"
                  name="sort"
                  checked={state.sortBy === "qtylowtohigh"}
                  onChange={() =>
                    dispatch({ type: "SORT_BY", payload: { sortBy: "qtylowtohigh" } })
                  }
                />
                <label className="ml-2">Quantity - Low to High</label>
              </div>

              <div className="flex items-center mt-1">
                <input
                  type="radio"
                  name="sort"
                  checked={state.sortBy === "qtyhightolow"}
                  onChange={() =>
                    dispatch({ type: "SORT_BY", payload: { sortBy: "qtyhightolow" } })
                  }
                />
                <label className="ml-2">Quantity - High to Low</label>
              </div>
            </li>

            {/* ✅ PRODUCT FILTERS */}
            <li className="mb-5">
              <span className="font-semibold">Product Filters</span>

              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  checked={state.seasonalOnly}
                  onChange={(e) =>
                    dispatch({ type: "SEASONAL_ONLY", payload: e.target.checked })
                  }
                />
                <label className="ml-2">Seasonal Products</label>
              </div>

              <div className="flex items-center mt-1">
                <input
                  type="checkbox"
                  checked={state.organicOnly}
                  onChange={(e) =>
                    dispatch({ type: "ORGANIC_ONLY", payload: e.target.checked })
                  }
                />
                <label className="ml-2">Organic Products</label>
              </div>

              <div className="flex items-center mt-1">
                <input
                  type="checkbox"
                  checked={state.freshOnly}
                  onChange={(e) =>
                    dispatch({ type: "FRESH_ONLY", payload: e.target.checked })
                  }
                />
                <label className="ml-2">Fresh (Last 2 Days)</label>
              </div>

              <div className="flex items-center mt-1">
                <input
                  type="checkbox"
                  checked={state.nearbyOnly}
                  onChange={(e) =>
                    dispatch({ type: "NEARBY_ONLY", payload: e.target.checked })
                  }
                />
                <label className="ml-2">Nearby Products</label>
              </div>

              <div className="flex items-center mt-1">
                <input
                  type="checkbox"
                  checked={state.onlyInStock}
                  onChange={(e) =>
                    dispatch({ type: "ONLY_IN_STOCK", payload: e.target.checked })
                  }
                />
                <label className="ml-2">In Stock Only</label>
              </div>
            </li>

            {/* ✅ CLEAR BUTTON */}
            <li className="mt-4">
              <button
                onClick={() => dispatch({ type: "CLEAR_FILTER" })}
                className="w-full bg-gray-200 hover:bg-gray-300 text-black py-2 rounded"
              >
                Clear Filters
              </button>
            </li>

          </ul>
        </div>
      </div>
    </section>
  );
};