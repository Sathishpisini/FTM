import { Link } from "react-router-dom";

export const OrderSuccess = () => {

  return (

    <div className="text-center mt-20">

      <h1 className="text-3xl font-bold text-green-600">
        Order Placed Successfully
      </h1>

      <p className="mt-4">Your order will be delivered soon.</p>

      <Link
        to="/my-orders"
        className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded"
      >
        Go To My Orders
      </Link>

    </div>

  );
};