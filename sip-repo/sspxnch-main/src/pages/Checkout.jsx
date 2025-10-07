import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartSummary from '../components/CartSummary';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useCart();
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleConfirmOrder = () => {
    setOrderPlaced(true);
    setTimeout(() => {
      clearCart();
      navigate('/menu');
    }, 3000);
  };

  if (orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-500 rounded-full mb-6 animate-bounce">
            <CheckCircle size={48} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-cafe-darkBrown mb-4">
            Order Confirmed!
          </h1>
          <p className="text-cafe-lightBrown mb-6">
            Your order has been placed successfully. Thank you for choosing Sip n Chat!
          </p>
          <p className="text-sm text-cafe-text">
            Redirecting to menu...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-cafe-darkBrown rounded-full mb-4">
            <ShoppingBag size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-cafe-darkBrown mb-2">Checkout</h1>
          <p className="text-cafe-lightBrown">Review your order before confirming</p>
        </div>

        {cart.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-cafe-lightBrown text-lg mb-6">Your cart is empty</p>
            <button
              onClick={() => navigate('/menu')}
              className="btn-primary"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <CartSummary />
            </div>

            <div className="card bg-cafe-beige">
              <h2 className="text-xl font-bold text-cafe-darkBrown mb-4">Order Summary</h2>
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-cafe-text">
                  <span>Subtotal</span>
                  <span>₱{cartTotal}</span>
                </div>
                <div className="flex justify-between text-cafe-text">
                  <span>Service Fee</span>
                  <span>₱0</span>
                </div>
                <div className="border-t border-cafe-lightBrown pt-2 flex justify-between text-xl font-bold text-cafe-darkBrown">
                  <span>Total</span>
                  <span>₱{cartTotal}</span>
                </div>
              </div>

              <div className="bg-cafe-amber bg-opacity-20 rounded-lg p-4 mb-6">
                <p className="text-sm text-cafe-text">
                  <strong>Note:</strong> This is a kiosk order system. No payment or delivery is required.
                  Your order will be prepared after confirmation.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => navigate('/menu')}
                  className="flex-1 btn-secondary"
                >
                  Add More Items
                </button>
                <button
                  onClick={handleConfirmOrder}
                  className="flex-1 btn-primary flex items-center justify-center space-x-2"
                >
                  <CheckCircle size={20} />
                  <span>Confirm Order</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Checkout;
