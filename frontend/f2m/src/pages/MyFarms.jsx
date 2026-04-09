import { useEffect, useState } from "react";

export default function MyFarms() {

  const [farms, setFarms] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user?.id) {
      alert("User not logged in");
      return;
    }

    fetch(`http://localhost:8080/api/farmers/user/${user.id}`)
      .then(res => res.json())
      .then(data => {
        console.log("Farms:", data);
        setFarms(data);
      })
      .catch(err => console.error(err));
  }, []);

  const openMap = (lat, lng) => {
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition">

      <div className="max-w-6xl mx-auto mt-20 p-6">

        {/* TITLE */}
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          My Farms
        </h2>

        {/* EMPTY STATE */}
        {farms.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">
            No farms found
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {farms.map((farm) => (
              <div
                key={farm.id}
                className="bg-white dark:bg-gray-800 
                           shadow-md hover:shadow-xl 
                           rounded-2xl p-5 border border-gray-200 dark:border-gray-700 
                           transition"
              >

                {/* FARM NAME */}
                <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
                  {farm.farmName}
                </h3>

                {/* DETAILS */}
                <div className="space-y-2 text-gray-700 dark:text-gray-300">
                  <p>
                    <span className="font-semibold">Size:</span>{" "}
                    {farm.farmSize} acres
                  </p>

                  <p>
                    <span className="font-semibold">Village:</span>{" "}
                    {farm.village}
                  </p>
                </div>

                {/* MAP BUTTON */}
                {farm.latitude && farm.longitude && (
                  <button
                    onClick={() => openMap(farm.latitude, farm.longitude)}
                    className="mt-4 flex items-center gap-2 
                               text-blue-600 dark:text-blue-400 
                               hover:underline"
                  >
                    📍 View on Map
                  </button>
                )}

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}