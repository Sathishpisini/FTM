import { useEffect, useState } from "react";
import { ProductCard } from "../components/Elements/ProductCard";

export const FreshProducts = () => {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/products/fresh")
      .then(res => res.json())
      .then(data => {
        console.log("Fresh Products:", data);
        setProducts(data);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="grid grid-cols-4 gap-4 p-6">

      {products.length > 0 ? (
        products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))
      ) : (
        <p className="col-span-4 text-center">No fresh products available</p>
      )}

    </div>
  );
};