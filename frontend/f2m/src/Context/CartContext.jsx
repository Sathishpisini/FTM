import { createContext, useContext, useReducer, useEffect } from "react";
import { cartReducer } from "../reducers";

const CartContext = createContext();

// ✅ Load from localStorage
const initialState = {
  cartList: JSON.parse(localStorage.getItem("cart")) || []
};

export const CartProvider = ({ children }) => {

  const [state, dispatch] = useReducer(cartReducer, initialState);

  // ✅ SAVE TO LOCALSTORAGE whenever cart changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.cartList));
  }, [state.cartList]);

  const addToCart = (product) => {
    dispatch({
      type: "ADD_TO_CART",
      payload: product
    });
  };

  const decreaseQty = (product) => {
    dispatch({
      type: "DECREASE_QUANTITY",
      payload: product
    });
  };

  const removeFromCart = (product) => {
    dispatch({
      type: "REMOVE_ITEM",
      payload: product
    });
  };

  const clearCart = () => {
    dispatch({
      type: "CLEAR_CART"
    });
  };

  return (
    <CartContext.Provider
      value={{
        cartList: state.cartList,
        addToCart,
        decreaseQty,
        removeFromCart,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};