import { useEffect, useState } from "react";
import axios from "axios";

export default function MyRequests() {

  const [requests, setRequests] = useState([]);

  const farmerId = 1; // replace with logged-in user

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/product-requests/farmer/${farmerId}`
      );
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">

      <h2 className="text-xl font-bold mb-4">My Product Requests</h2>

      <table className="w-full border">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {requests.map(req => (
            <tr key={req.id}>
              <td>{req.productName}</td>
              <td>{req.pricePerKg}</td>
              <td>{req.quantityAvailable}</td>
              <td>{req.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}