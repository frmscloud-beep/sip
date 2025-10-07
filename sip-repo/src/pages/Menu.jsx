import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { checkAndSeedFirestore } from '../lib/seedFirestore';
import MenuItemCard from '../components/MenuItemCard';

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      await checkAndSeedFirestore();

      const productsRef = collection(db, 'products');
      const snapshot = await getDocs(productsRef);
      const productsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productsList);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const getFilteredItems = () => {
    if (selectedCategory === 'All') {
      return products;
    }
    return products.filter(p => p.category === selectedCategory);
  };

  const filteredItems = getFilteredItems();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paleOyster">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-oil mx-auto mb-4"></div>
          <p className="text-judgeGray">Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-paleOyster min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-montserrat text-oil mb-2">Our Menu</h1>
        <p className="text-judgeGray">Discover your perfect drink or snack</p>
      </div>

      <div className="mb-8 overflow-x-auto pb-2">
        <div className="flex gap-2 justify-center min-w-max mx-auto">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-oil text-white shadow-lg scale-105'
                  : 'bg-white text-cafe-text hover:bg-judgeGray hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map(item => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-judgeGray text-lg">No items found in this category</p>
        </div>
      )}
    </div>
  );
};

export default Menu;
