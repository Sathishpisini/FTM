import { useState, useEffect, useRef } from "react";

export default function AddFarm() {

  const [farm, setFarm] = useState({
    farmName: "",
    farmSize: "",
    village: "",
    latitude: null,
    longitude: null
  });

  const [villages, setVillages] = useState([]);
  const [filteredVillages, setFilteredVillages] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // ✅ FETCH VILLAGES
  useEffect(() => {
    const fetchVillages = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/supervisors/villages");

        if (!res.ok) throw new Error("Failed to fetch villages");

        const data = await res.json();

        if (Array.isArray(data)) {
          setVillages(data);
          setFilteredVillages(data);
        } else {
          setVillages([]);
          setFilteredVillages([]);
        }

      } catch (err) {
        console.error(err);
        setVillages([]);
        setFilteredVillages([]);
      }
    };

    fetchVillages();
  }, []);

  // ✅ CLOSE DROPDOWN
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFarm(prev => ({ ...prev, [name]: value }));
  };

  // ✅ SEARCH
  const handleVillageSearch = (e) => {
    const value = e.target.value;

    setFarm(prev => ({ ...prev, village: value }));
    setShowDropdown(true);

    const filtered = villages.filter(v =>
      v?.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredVillages(filtered);
  };

  const handleVillageSelect = (village) => {
    setFarm(prev => ({ ...prev, village }));
    setShowDropdown(false);
  };

  // ✅ LOCATION
  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFarm(prev => ({
          ...prev,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        }));
        alert("Location captured ✅");
      },
      () => alert("Failed to get location ❌")
    );
  };

  // ✅ SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user?.id) return alert("Login again");
    if (!farm.village) return alert("Select village");
    if (!farm.latitude) return alert("Capture location");

    const payload = {
      userId: user.id,
      farmName: farm.farmName,
      farmSize: parseFloat(farm.farmSize),
      village: farm.village,
      latitude: farm.latitude,
      longitude: farm.longitude
    };

    try {
      const res = await fetch("http://localhost:8080/api/farmers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: "Bearer " + token })
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert("Farm added successfully ✅");
        window.location.href = "/my-farms";
      } else {
        alert(await res.text());
      }

    } catch {
      alert("Something went wrong");
    }
  };

  return (
    <div className="
      max-w-xl mx-auto mt-10 p-6 rounded shadow
      bg-white text-gray-900
      dark:bg-gray-900 dark:text-gray-100
    ">

      <h2 className="text-2xl font-bold mb-4">
        Add Farm
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* FARM NAME */}
        <input
          name="farmName"
          placeholder="Farm Name"
          value={farm.farmName}
          onChange={handleChange}
          className="
            w-full p-2 rounded border
            border-gray-300 bg-white
            focus:ring-2 focus:ring-blue-500

            dark:border-gray-700
            dark:bg-gray-800 dark:text-gray-100
          "
          required
        />

        {/* FARM SIZE */}
        <input
          name="farmSize"
          placeholder="Farm Size"
          value={farm.farmSize}
          onChange={handleChange}
          className="
            w-full p-2 rounded border
            border-gray-300 bg-white
            focus:ring-2 focus:ring-blue-500

            dark:border-gray-700
            dark:bg-gray-800 dark:text-gray-100
          "
          required
        />

        {/* 🌾 VILLAGE SEARCH */}
        <div className="relative z-50" ref={dropdownRef}>
          <input
            name="village"
            placeholder="Search Village"
            value={farm.village}
            onChange={handleVillageSearch}
            onFocus={() => setShowDropdown(true)}
            className="
              w-full p-2 rounded border
              border-gray-300 bg-white
              focus:ring-2 focus:ring-blue-500

              dark:border-gray-700
              dark:bg-gray-800 dark:text-gray-100
            "
            required
          />

          {showDropdown && (
            <ul className="
              absolute w-full mt-1 rounded shadow max-h-40 overflow-y-auto
              bg-white border border-gray-300

              dark:bg-gray-800 dark:border-gray-700
            ">

              {filteredVillages.length > 0 ? (
                filteredVillages.map((v, i) => (
                  <li
                    key={i}
                    onClick={() => handleVillageSelect(v)}
                    className="
                      p-2 cursor-pointer
                      hover:bg-gray-100
                      dark:hover:bg-gray-700
                    "
                  >
                    {v}
                  </li>
                ))
              ) : (
                <li className="p-2 text-gray-500 dark:text-gray-400">
                  No villages found
                </li>
              )}

            </ul>
          )}
        </div>

        {/* 📍 LOCATION */}
        <button
          type="button"
          onClick={getCurrentLocation}
          className="
            w-full py-2 rounded font-semibold
            bg-blue-600 text-white
            hover:bg-blue-700

            dark:bg-blue-500 dark:hover:bg-blue-600
          "
        >
          Use Current Location 📍
        </button>

        {farm.latitude && (
          <p className="text-green-600 dark:text-green-400 text-sm">
            Location captured ✔
          </p>
        )}

        {/* SUBMIT */}
        <button
          className="
            w-full py-2 rounded font-semibold
            bg-green-600 text-white
            hover:bg-green-700

            dark:bg-green-500 dark:hover:bg-green-600
          "
        >
          Add Farm
        </button>

      </form>
    </div>
  );
}