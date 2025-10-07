import { Link } from 'react-router-dom';
import { Home, Menu, Bot, ShoppingCart, User } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { cartCount } = useCart();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-cafe-darkBrown rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="font-bold text-xl text-cafe-darkBrown hidden sm:inline">
              Sip n Chat
            </span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className="flex items-center space-x-1 text-cafe-text hover:text-cafe-amber transition-colors"
            >
              <Home size={20} />
              <span className="hidden sm:inline">Home</span>
            </Link>

            <Link
              to="/menu"
              className="flex items-center space-x-1 text-cafe-text hover:text-cafe-amber transition-colors"
            >
              <Menu size={20} />
              <span className="hidden sm:inline">Menu</span>
            </Link>

            <Link
              to="/quiz"
              className="flex items-center space-x-1 text-cafe-text hover:text-cafe-amber transition-colors"
            >
              <Bot size={20} />
              <span className="hidden sm:inline">Ask AI</span>
            </Link>

            <Link
              to="/checkout"
              className="flex items-center space-x-1 text-cafe-text hover:text-cafe-amber transition-colors relative"
            >
              <ShoppingCart size={20} />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-cafe-amber text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link
              to="/admin"
              className="flex items-center space-x-1 text-cafe-text hover:text-cafe-amber transition-colors"
            >
              <User size={20} />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
