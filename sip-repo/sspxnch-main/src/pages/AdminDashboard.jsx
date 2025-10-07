import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  LogOut,
  Package,
  TrendingUp,
  AlertTriangle,
  Plus,
  Save,
  Trash2,
  BarChart3
} from 'lucide-react';
import { auth, googleProvider, facebookProvider, db } from '../lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import menuData from '../data/menuData.json';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Milk Tea',
    basePrice: 39,
    stock: 100,
    image: '/images/drink1.jpg'
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        loadProducts();
      }
    });

    return () => unsubscribe();
  }, []);

  const loadProducts = () => {
    const allProducts = Object.values(menuData.categories).flat();
    setProducts(allProducts);
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Google login error:', error);
      alert('Please configure Firebase authentication in your .env file');
    }
  };

  const handleFacebookLogin = async () => {
    try {
      await signInWithPopup(auth, facebookProvider);
    } catch (error) {
      console.error('Facebook login error:', error);
      alert('Please configure Firebase authentication in your .env file');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleAddProduct = () => {
    if (!newProduct.name) {
      alert('Please enter a product name');
      return;
    }

    const product = {
      ...newProduct,
      id: `new-${Date.now()}`,
    };

    setProducts([...products, product]);
    setNewProduct({
      name: '',
      category: 'Milk Tea',
      basePrice: 39,
      stock: 100,
      image: '/images/drink1.jpg'
    });

    alert('Product added successfully! (Note: This is a demo. In production, this would save to Firestore)');
  };

  const handleUpdateStock = (productId, newStock) => {
    setProducts(products.map(p =>
      p.id === productId ? { ...p, stock: parseInt(newStock) } : p
    ));
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  const calculateStats = () => {
    const totalProducts = products.length;
    const lowStockItems = products.filter(p => p.stock < 20).length;
    const totalValue = products.reduce((sum, p) => sum + (p.basePrice * p.stock), 0);

    return { totalProducts, lowStockItems, totalValue };
  };

  const stats = calculateStats();
  const lowStockProducts = products.filter(p => p.stock < 20);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cafe-darkBrown mx-auto mb-4"></div>
          <p className="text-cafe-lightBrown">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-cafe-darkBrown rounded-full mb-4">
                <User size={32} className="text-white" />
              </div>
              <h1 className="text-3xl font-bold text-cafe-darkBrown mb-2">Admin Login</h1>
              <p className="text-cafe-lightBrown">Sign in to access the dashboard</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleGoogleLogin}
                className="w-full btn-primary flex items-center justify-center space-x-2"
              >
                <User size={20} />
                <span>Sign in with Google</span>
              </button>

              <button
                onClick={handleFacebookLogin}
                className="w-full btn-secondary flex items-center justify-center space-x-2"
              >
                <User size={20} />
                <span>Sign in with Facebook</span>
              </button>
            </div>
            </div>
          </div>
    );
  }

  return (
    <div className="min-h-screen bg-cafe-beige">
      <div className="bg-cafe-darkBrown text-white py-4 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-cafe-amber rounded-full flex items-center justify-center">
              <User size={20} />
            </div>
            <div>
              <p className="font-medium">{user.displayName || user.email}</p>
              <p className="text-xs text-cafe-beige">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-cafe-lightBrown hover:bg-cafe-amber px-4 py-2 rounded-full transition-colors"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-cafe-darkBrown mb-6">Admin Dashboard</h1>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['overview', 'products', 'inventory'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full font-medium transition-all capitalize whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-cafe-darkBrown text-white'
                  : 'bg-white text-cafe-text hover:bg-cafe-lightBrown hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card bg-gradient-to-br from-cafe-darkBrown to-cafe-lightBrown text-white">
                <div className="flex items-center justify-between mb-2">
                  <Package size={24} />
                  <TrendingUp size={20} />
                </div>
                <p className="text-3xl font-bold mb-1">{stats.totalProducts}</p>
                <p className="text-cafe-beige text-sm">Total Products</p>
              </div>

              <div className="card bg-gradient-to-br from-cafe-amber to-yellow-600 text-white">
                <div className="flex items-center justify-between mb-2">
                  <AlertTriangle size={24} />
                  <BarChart3 size={20} />
                </div>
                <p className="text-3xl font-bold mb-1">{stats.lowStockItems}</p>
                <p className="text-white text-sm">Low Stock Items</p>
              </div>

              <div className="card bg-gradient-to-br from-green-600 to-green-700 text-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">₱</span>
                  <TrendingUp size={20} />
                </div>
                <p className="text-3xl font-bold mb-1">₱{stats.totalValue}</p>
                <p className="text-green-100 text-sm">Inventory Value</p>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center space-x-2 mb-4">
                <AlertTriangle size={20} className="text-cafe-amber" />
                <h2 className="text-xl font-bold text-cafe-darkBrown">Low Stock Alert</h2>
              </div>

              {lowStockProducts.length === 0 ? (
                <p className="text-cafe-lightBrown">All products are well stocked</p>
              ) : (
                <div className="space-y-2">
                  {lowStockProducts.map(product => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 bg-red-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-cafe-darkBrown">{product.name}</p>
                        <p className="text-sm text-cafe-lightBrown">{product.category}</p>
                      </div>
                      <span className="text-red-600 font-bold">{product.stock} left</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-xl font-bold text-cafe-darkBrown mb-4">Add New Product</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Product Name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="px-4 py-2 rounded-lg border-2 border-cafe-lightBrown focus:border-cafe-amber outline-none"
                />

                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="px-4 py-2 rounded-lg border-2 border-cafe-lightBrown focus:border-cafe-amber outline-none"
                >
                  {Object.keys(menuData.categories).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                <input
                  type="number"
                  placeholder="Base Price"
                  value={newProduct.basePrice}
                  onChange={(e) => setNewProduct({ ...newProduct, basePrice: parseInt(e.target.value) })}
                  className="px-4 py-2 rounded-lg border-2 border-cafe-lightBrown focus:border-cafe-amber outline-none"
                />

                <input
                  type="number"
                  placeholder="Stock"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
                  className="px-4 py-2 rounded-lg border-2 border-cafe-lightBrown focus:border-cafe-amber outline-none"
                />

                <input
                  type="text"
                  placeholder="Image URL"
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                  className="px-4 py-2 rounded-lg border-2 border-cafe-lightBrown focus:border-cafe-amber outline-none md:col-span-2"
                />
              </div>

              <button
                onClick={handleAddProduct}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus size={20} />
                <span>Add Product</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="card overflow-x-auto">
            <h2 className="text-xl font-bold text-cafe-darkBrown mb-4">Inventory Management</h2>

            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-cafe-lightBrown">
                  <th className="text-left py-3 px-2">Product</th>
                  <th className="text-left py-3 px-2">Category</th>
                  <th className="text-left py-3 px-2">Price</th>
                  <th className="text-left py-3 px-2">Stock</th>
                  <th className="text-left py-3 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} className="border-b border-cafe-beige hover:bg-cafe-beige">
                    <td className="py-3 px-2 font-medium">{product.name}</td>
                    <td className="py-3 px-2 text-sm text-cafe-lightBrown">{product.category}</td>
                    <td className="py-3 px-2">₱{product.basePrice}</td>
                    <td className="py-3 px-2">
                      <input
                        type="number"
                        value={product.stock}
                        onChange={(e) => handleUpdateStock(product.id, e.target.value)}
                        className={`w-20 px-2 py-1 rounded border-2 ${
                          product.stock < 20 ? 'border-red-500' : 'border-cafe-lightBrown'
                        } focus:border-cafe-amber outline-none`}
                      />
                    </td>
                    <td className="py-3 px-2">
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;