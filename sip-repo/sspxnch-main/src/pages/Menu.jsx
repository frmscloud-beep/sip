import { useState } from 'react';
import MenuItemCard from '../components/MenuItemCard';
import menuData from '../data/menuData.json';

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...Object.keys(menuData.categories)];

  const getFilteredItems = () => {
    if (selectedCategory === 'All') {
      return Object.values(menuData.categories).flat();
    }
    return menuData.categories[selectedCategory] || [];
  };

  const filteredItems = getFilteredItems();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-cafe-darkBrown mb-2">Our Menu</h1>
        <p className="text-cafe-lightBrown">Discover your perfect drink or snack</p>
      </div>

      <div className="mb-8 overflow-x-auto pb-2">
        <div className="flex gap-2 justify-center min-w-max mx-auto">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-cafe-darkBrown text-white shadow-lg scale-105'
                  : 'bg-white text-cafe-text hover:bg-cafe-lightBrown hover:text-white'
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
          <p className="text-cafe-lightBrown text-lg">No items found in this category</p>
        </div>
      )}
    </div>
  );
};

export default Menu;
