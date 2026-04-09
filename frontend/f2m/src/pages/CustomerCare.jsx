import React from "react";

export function CustomerCare() {
  return (
    <main className="p-6 max-w-6xl mx-auto 
                     bg-white dark:bg-gray-900 
                     text-gray-800 dark:text-gray-100">

      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-6 text-center">
        Customer Support
      </h1>

      {/* CONTACT INFO */}
      <section className="grid md:grid-cols-3 gap-4 mb-8">

        <div className="p-4 bg-gray-100 dark:bg-gray-800 
                        rounded-xl text-center shadow">
          <h2 className="text-lg font-semibold">📞 Call Us</h2>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            +91 98765 43210
          </p>
        </div>

        <div className="p-4 bg-gray-100 dark:bg-gray-800 
                        rounded-xl text-center shadow">
          <h2 className="text-lg font-semibold">📧 Email</h2>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            support@farmfresh.com
          </p>
        </div>

        <div className="p-4 bg-gray-100 dark:bg-gray-800 
                        rounded-xl text-center shadow">
          <h2 className="text-lg font-semibold">🕒 Working Hours</h2>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            Mon - Sat: 9 AM - 7 PM
          </p>
        </div>

      </section>

      {/* FAQ SECTION */}
      <section>
        <h2 className="text-xl font-semibold mb-4">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">

          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded shadow">
            <h3 className="font-semibold">How to place an order?</h3>
            <p className="text-sm mt-1 text-gray-700 dark:text-gray-300">
              Browse products, add to cart, and checkout.
            </p>
          </div>

          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded shadow">
            <h3 className="font-semibold">Can I cancel my order?</h3>
            <p className="text-sm mt-1 text-gray-700 dark:text-gray-300">
              Yes, you can cancel before shipment.
            </p>
          </div>

          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded shadow">
            <h3 className="font-semibold">Refund policy?</h3>
            <p className="text-sm mt-1 text-gray-700 dark:text-gray-300">
              Refunds are processed within 5-7 business days.
            </p>
          </div>

          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded shadow">
            <h3 className="font-semibold">How to contact support quickly?</h3>
            <p className="text-sm mt-1 text-gray-700 dark:text-gray-300">
              You can call us directly or email us for faster response.
            </p>
          </div>

        </div>
      </section>

      {/* ADDRESS */}
      <section className="mt-10 text-center">
        <h2 className="text-lg font-semibold">📍 Our Office</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          FarmFresh Pvt Ltd, Bangalore, India
        </p>
      </section>

    </main>
  );
}

export default CustomerCare;