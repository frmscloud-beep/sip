import { Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartSummary = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="card text-center py-12">
        <p className="text-cafe-lightBrown text-lg">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {cart.map((item) => (
        <div key={item.cartId} className="card">
          <div className="flex gap-4">
            <img
              src={item.image}
              alt={item.name}
              className="w-20 h-20 object-cover rounded-lg"
              onError={(e) => {
                e.target.src = 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=400';
              }}
            />

            <div className="flex-1">
              <h3 className="font-semibold text-cafe-darkBrown">{item.name}</h3>
              <p className="text-sm text-cafe-lightBrown">{item.category}</p>
              {item.size !== 'N/A' && (
                <p className="text-xs text-cafe-text">Size: {item.size}</p>
              )}
              {item.addons.length > 0 && (
                <p className="text-xs text-cafe-text">Add-ons: {item.addons.join(', ')}</p>
              )}

              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                    className="bg-cafe-lightBrown text-white p-1 rounded hover:bg-cafe-darkBrown transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="font-medium w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                    className="bg-cafe-lightBrown text-white p-1 rounded hover:bg-cafe-darkBrown transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="font-bold text-cafe-amber">
                    ₱{item.totalPrice * item.quantity}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.cartId)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="card bg-cafe-darkBrown text-white">
        <div className="flex justify-between items-center text-xl font-bold">
          <span>Total:</span>
          <span>₱{cartTotal}</span>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
