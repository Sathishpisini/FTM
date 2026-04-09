export const cartReducer = (state, action) => {

  switch(action.type){

    case "ADD_TO_CART": {

      const item = state.cartList.find(
        product => product.id === action.payload.id
      );

      // if already in cart
      if(item){

        // stop if stock finished
        if(item.quantity >= action.payload.count){
          return state;
        }

        return {
          ...state,
          cartList: state.cartList.map(product =>
            product.id === action.payload.id
              ? { ...product, quantity: product.quantity + 1 }
              : product
          )
        };
      }

      // add new item
      return {
        ...state,
        cartList: [
          ...state.cartList,
          { ...action.payload, quantity: 1 }
        ]
      };
    }


    case "DECREASE_QUANTITY": {

      const item = state.cartList.find(
        product => product.id === action.payload.id
      );

      // if quantity becomes 0 remove product
      if(item.quantity === 1){
        return {
          ...state,
          cartList: state.cartList.filter(
            product => product.id !== action.payload.id
          )
        };
      }

      return {
        ...state,
        cartList: state.cartList.map(product =>
          product.id === action.payload.id
            ? { ...product, quantity: product.quantity - 1 }
            : product
        )
      };
    }


    case "REMOVE_ITEM":

      return {
        ...state,
        cartList: state.cartList.filter(
          product => product.id !== action.payload.id
        )
      };


    case "CLEAR_CART":

      return {
        ...state,
        cartList: []
      };


    default:
      return state;
  }
};