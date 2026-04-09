import { useEffect, useState } from "react";
import axios from "axios";

export default function SupervisorDashboard() {

  const [requests, setRequests] = useState([]);

  const supervisorId = 1; // replace dynamically later

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/product-requests/supervisor/${supervisorId}/pending`
      );
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const approve = async (id) => {
    await axios.put(`http://localhost:8080/api/product-requests/${id}/approve`);
    fetchRequests();
  };

  const reject = async (id) => {
    await axios.put(`http://localhost:8080/api/product-requests/${id}/reject`);
    fetchRequests();
  };

  return (
    <div className="p-6">

      <h2 className="text-xl font-bold mb-4">Supervisor Dashboard</h2>

      <table className="w-full border">
        <thead>
          <tr>
            <th>Farmer</th>
            <th>Phone</th>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {requests.map(req => (
            <tr key={req.id}>
              <td>{req.name}</td>
              <td>{req.phone}</td>
              <td>{req.productName}</td>
              <td>{req.pricePerKg}</td>
              <td>{req.quantityAvailable}</td>
              <td>
                <button onClick={() => approve(req.id)}>
                  Approve
                </button>

                <button onClick={() => reject(req.id)}>
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}