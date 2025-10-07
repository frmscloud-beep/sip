import { useState } from 'react';
import { ShoppingCart, Plus, Minus, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import menuData from '../data/menuData.json';

const MenuItemCard = ({ item }) => {
  const { addToCart } = useCart();
  const [showModal, setShowModal] = useState(false);
  const [selectedSize, setSelectedSize] = useState('Medium');
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [quantity, setQuantity] = useState(1);

  const isSnack = item.category === 'Snacks';
  const isHotDrink = item.category === 'Espresso (Hot Drinks)';

  const availableAddons = menuData.addons.filter(addon =>
    addon.applicableTo.includes(item.category)
  );

  const calculatePrice = () => {
    if (isSnack) return item.basePrice;

    const sizePrice = menuData.sizes.find(s => s.name === selectedSize)?.price || item.basePrice;
    const addonsPrice = selectedAddons.reduce((sum, addonId) => {
      const addon = menuData.addons.find(a => a.id === addonId);
      return sum + (addon?.price || 0);
    }, 0);

    return sizePrice + addonsPrice;
  };

  const handleAddToCart = () => {
    const totalPrice = calculatePrice();

    addToCart({
      id: item.id,
      name: item.name,
      category: item.category,
      size: isSnack ? 'N/A' : selectedSize,
      addons: selectedAddons.map(id => menuData.addons.find(a => a.id === id)?.name || ''),
      quantity,
      totalPrice,
      image: item.image
    });

    setShowModal(false);
    setQuantity(1);
    setSelectedAddons([]);
    setSelectedSize('Medium');
  };

  const toggleAddon = (addonId) => {
    setSelectedAddons(prev =>
      prev.includes(addonId)
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    );
  };

  return (
    <>
      <div className="card group cursor-pointer" onClick={() => setShowModal(true)}>
        <div className="relative overflow-hidden rounded-xl mb-3">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              e.target.src = 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=400';
            }}
          />
          {item.stock < 10 && (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              Low Stock
            </span>
          )}
        </div>

        <h3 className="font-semibold text-lg text-cafe-darkBrown mb-1">{item.name}</h3>
        <p className="text-sm text-cafe-lightBrown mb-2">{item.category}</p>
        <div className="flex items-center justify-between">
          <span className="text-cafe-amber font-bold">₱{item.basePrice}+</span>
          <button
            className="bg-cafe-darkBrown text-white p-2 rounded-full hover:bg-cafe-amber transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setShowModal(true);
            }}
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-cafe-darkBrown">{item.name}</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-cafe-text hover:text-cafe-amber"
              >
                <X size={24} />
              </button>
            </div>

            <img
              src={item.image}
              alt={item.name}
              className="w-full h-48 object-cover rounded-xl mb-4"
              onError={(e) => {
                e.target.src = 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=400';
              }}
            />

            {!isSnack && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-cafe-darkBrown mb-2">
                  Size
                </label>
                <div className="flex gap-2">
                  {menuData.sizes.map(size => (
                    <button
                      key={size.name}
                      onClick={() => setSelectedSize(size.name)}
                      className={`flex-1 py-2 px-4 rounded-lg border-2 transition-colors ${
                        selectedSize === size.name
                          ? 'border-cafe-amber bg-cafe-amber text-white'
                          : 'border-cafe-lightBrown text-cafe-text hover:border-cafe-amber'
                      }`}
                    >
                      <div className="text-sm font-medium">{size.name}</div>
                      <div className="text-xs">₱{size.price}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {availableAddons.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-cafe-darkBrown mb-2">
                  Add-ons
                </label>
                <div className="space-y-2">
                  {availableAddons.map(addon => (
                    <button
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`w-full py-2 px-4 rounded-lg border-2 transition-colors text-left ${
                        selectedAddons.includes(addon.id)
                          ? 'border-cafe-amber bg-cafe-amber bg-opacity-10'
                          : 'border-gray-200 hover:border-cafe-lightBrown'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{addon.name}</span>
                        <span className="text-sm text-cafe-amber">+₱{addon.price}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium text-cafe-darkBrown mb-2">
                Quantity
              </label>
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="bg-cafe-lightBrown text-white p-2 rounded-full hover:bg-cafe-darkBrown transition-colors"
                >
                  <Minus size={20} />
                </button>
                <span className="text-2xl font-bold text-cafe-darkBrown w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="bg-cafe-lightBrown text-white p-2 rounded-full hover:bg-cafe-darkBrown transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mb-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span className="text-cafe-darkBrown">Total:</span>
                <span className="text-cafe-amber">₱{calculatePrice() * quantity}</span>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full btn-primary flex items-center justify-center space-x-2"
            >
              <ShoppingCart size={20} />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MenuItemCard;
