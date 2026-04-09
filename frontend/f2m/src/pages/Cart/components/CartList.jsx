import { useCart } from "../../../Context/CartContext";
import { CartCard } from "./CartCard";
import { CartEmpty } from "./CartEmpty";
import { Checkout } from "./Checkout";

export const CartList = () => {

  const { cartList } = useCart();

  return (

    <main className="max-w-6xl mx-auto p-6">

      <h1 className="text-3xl pt-20 font-bold mb-6 dark:text-white">
        Shopping Cart
      </h1>

      {cartList.length === 0 ? (

        <CartEmpty />

      ) : (

        <div className="grid md:grid-cols-3 gap-8">

          <div className="md:col-span-2 space-y-4">

            {cartList.map(product => (
              <CartCard key={product.id} product={product} />
            ))}

          </div>

          <Checkout />

        </div>

      )}

    </main>

  );
};