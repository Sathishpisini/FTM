// src/components/MyCompanies.jsx
import React, { useEffect, useState } from "react";
import { getBuyerCompaniesByUser } from "../services/api";

// MyCompanies component
const MyCompanies = () => {
  const [companies, setCompanies] = useState([]);  // update to handle multiple companies
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;
  // Fetch company data on component mount
  useEffect(() => {
    fetchCompanies(userId);
  }, [userId]);

  // Fetch companies function
  const fetchCompanies = async (userId) => {
  try {
    const data = await getBuyerCompaniesByUser(userId);

    // ✅ Ensure it's always an array
    if (Array.isArray(data)) {
      setCompanies(data);
    } else {
      setCompanies([data]); // wrap single object into array
    }

  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  // Open company location in Google Maps
  const openInMaps = (company) => {
    let query = "";

    if (company.latitude && company.longitude) {
      query = `${company.latitude},${company.longitude}`;
    } else {
      query = encodeURIComponent(company.address);  // fallback to address
    }

    const url = `https://www.google.com/maps?q=${query}`;
    window.open(url, "_blank");
  };

  if (loading) return <p>Loading companies...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Companies</h2>

      {companies.length === 0 ? (
        <p>No companies found.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "16px",
            marginTop: "20px",
          }}
        >
          {companies.map((company) => (
            <div
              key={company.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "16px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              }}
            >
              <h3 style={{ marginBottom: "10px" }}>{company.companyName}</h3>
              <p>
                <strong>Address:</strong> {company.address}
              </p>
              <p>
                <strong>Location:</strong>{" "}
                {company.latitude && company.longitude
                  ? `${company.latitude}, ${company.longitude}`
                  : "Not Available"}
              </p>

              <button
                onClick={() => openInMaps(company)}
                style={{
                  marginTop: "10px",
                  padding: "8px 12px",
                  border: "none",
                  borderRadius: "6px",
                  backgroundColor: "#007bff",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Open in Maps
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCompanies;