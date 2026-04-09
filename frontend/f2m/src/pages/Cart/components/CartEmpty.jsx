import { Link } from "react-router-dom";

export const CartEmpty = () => {

  return (

    <div className="text-center mt-20">

      <h2 className="text-2xl font-semibold mb-4">
        Your cart is empty
      </h2>

      <Link
        to="/products"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg"
      >
        Continue Shopping
      </Link>

    </div>

  );

};