import { Link } from "react-router-dom";

export const OrderFail = () => {

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">

      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 text-center max-w-md w-full">

        {/* Icon / Indicator */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
            <span className="text-red-600 dark:text-red-300 text-3xl">✕</span>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-red-600 dark:text-red-400">
          Order Failed
        </h1>

        <p className="mt-4 text-gray-600 dark:text-gray-300">
          Please select Cash On Delivery to place order.
        </p>

        <Link
          to="/checkout"
          className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
        >
          Try Again
        </Link>

      </div>

    </div>

  );
};