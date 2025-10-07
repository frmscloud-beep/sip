import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  LogOut,
  Package,
  TrendingUp,
  AlertTriangle,
  Plus,
  Trash2,
  BarChart3,
  Edit2,
  Save,
  X
} from 'lucide-react';
import { auth, googleProvider, facebookProvider, db } from '../lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { checkAndSeedFirestore } from '../lib/seedFirestore';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Milk Tea',
    price: 39,
    stock: 100,
    image: '/images/drink1.jpg'
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        await checkAndSeedFirestore();
        await loadProducts();
      }
    });

    return () => unsubscribe();
  }, []);

  const loadProducts = async () => {
    try {
      const productsRef = collection(db, 'products');
      const snapshot = await getDocs(productsRef);
      const productsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productsList);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Google login error:', error);
      alert('Error signing in with Google. Please check your Firebase configuration.');
    }
  };

  const handleFacebookLogin = async () => {
    try {
      await signInWithPopup(auth, facebookProvider);
    } catch (error) {
      console.error('Facebook login error:', error);
      alert('Facebook login requires additional setup in Firebase Console. Please enable Facebook authentication and provide your Facebook App ID and Secret.');
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

  const handleAddProduct = async () => {
    if (!newProduct.name) {
      alert('Please enter a product name');
      return;
    }

    try {
      const productsRef = collection(db, 'products');
      await addDoc(productsRef, newProduct);

      setNewProduct({
        name: '',
        category: 'Milk Tea',
        price: 39,
        stock: 100,
        image: '/images/drink1.jpg'
      });

      await loadProducts();
      alert('Product added successfully!');
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product. Please try again.');
    }
  };

  const handleUpdateStock = async (productId, newStock) => {
    try {
      const productRef = doc(db, 'products', productId);
      await updateDoc(productRef, { stock: parseInt(newStock) });
      await loadProducts();
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  const handleEditProduct = async (productId, updates) => {
    try {
      const productRef = doc(db, 'products', productId);
      await updateDoc(productRef, updates);
      await loadProducts();
      setEditingProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error updating product. Please try again.');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const productRef = doc(db, 'products', productId);
        await deleteDoc(productRef);
        await loadProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product. Please try again.');
      }
    }
  };

  const calculateStats = () => {
    const totalProducts = products.length;
    const lowStockItems = products.filter(p => p.stock < 20).length;
    const totalValue = products.reduce((sum, p) => {
      const price = p.price || p.prices?.Medium || 0;
      return sum + (price * p.stock);
    }, 0);

    return { totalProducts, lowStockItems, totalValue };
  };

  const stats = calculateStats();
  const lowStockProducts = products.filter(p => p.stock < 20);

  const categories = ['Milk Tea', 'Iced Coffee', 'Hot Drinks', 'Non-Coffee', 'Fruit Soda', 'Snacks', 'Add-on'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paleOyster">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-oil mx-auto mb-4"></div>
          <p className="text-judgeGray">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-paleOyster">
        <div className="max-w-md w-full">
          <div className="card">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-oil rounded-full mb-4">
                <User size={32} className="text-white" />
              </div>
              <h1 className="text-3xl font-bold font-montserrat text-oil mb-2">Admin Login</h1>
              <p className="text-judgeGray">Sign in to access the dashboard</p>
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paleOyster">
      <div className="bg-oil text-white py-4 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
              <User size={20} />
            </div>
            <div>
              <p className="font-medium font-montserrat">{user.displayName || user.email}</p>
              <p className="text-xs text-paleOyster">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-judgeGray hover:bg-accent px-4 py-2 rounded-full transition-colors"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold font-montserrat text-oil mb-6">Admin Dashboard</h1>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['overview', 'products', 'inventory'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full font-medium transition-all capitalize whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-oil text-white'
                  : 'bg-white text-cafe-text hover:bg-judgeGray hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card bg-gradient-to-br from-oil to-judgeGray text-white">
                <div className="flex items-center justify-between mb-2">
                  <Package size={24} />
                  <TrendingUp size={20} />
                </div>
                <p className="text-3xl font-bold mb-1">{stats.totalProducts}</p>
                <p className="text-paleOyster text-sm">Total Products</p>
              </div>

              <div className="card bg-gradient-to-br from-accent to-amber-600 text-white">
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
                <p className="text-3xl font-bold mb-1">₱{stats.totalValue.toLocaleString()}</p>
                <p className="text-green-100 text-sm">Inventory Value</p>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center space-x-2 mb-4">
                <AlertTriangle size={20} className="text-accent" />
                <h2 className="text-xl font-bold font-montserrat text-oil">Low Stock Alert</h2>
              </div>

              {lowStockProducts.length === 0 ? (
                <p className="text-judgeGray">All products are well stocked</p>
              ) : (
                <div className="space-y-2">
                  {lowStockProducts.map(product => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 bg-red-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-oil">{product.name}</p>
                        <p className="text-sm text-judgeGray">{product.category}</p>
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
              <h2 className="text-xl font-bold font-montserrat text-oil mb-4">Add New Product</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Product Name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="px-4 py-2 rounded-lg border-2 border-judgeGray focus:border-accent outline-none"
                />

                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="px-4 py-2 rounded-lg border-2 border-judgeGray focus:border-accent outline-none"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                <input
                  type="number"
                  placeholder="Price"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: parseInt(e.target.value) })}
                  className="px-4 py-2 rounded-lg border-2 border-judgeGray focus:border-accent outline-none"
                />

                <input
                  type="number"
                  placeholder="Stock"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
                  className="px-4 py-2 rounded-lg border-2 border-judgeGray focus:border-accent outline-none"
                />

                <input
                  type="text"
                  placeholder="Image URL"
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                  className="px-4 py-2 rounded-lg border-2 border-judgeGray focus:border-accent outline-none md:col-span-2"
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
            <h2 className="text-xl font-bold font-montserrat text-oil mb-4">Inventory Management</h2>

            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-judgeGray">
                  <th className="text-left py-3 px-2">Product</th>
                  <th className="text-left py-3 px-2">Category</th>
                  <th className="text-left py-3 px-2">Price</th>
                  <th className="text-left py-3 px-2">Stock</th>
                  <th className="text-left py-3 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} className="border-b border-paleOyster hover:bg-gray-50">
                    <td className="py-3 px-2 font-medium">{product.name}</td>
                    <td className="py-3 px-2 text-sm text-judgeGray">{product.category}</td>
                    <td className="py-3 px-2">
                      ₱{product.price || product.prices?.Medium || 'N/A'}
                    </td>
                    <td className="py-3 px-2">
                      <input
                        type="number"
                        value={product.stock}
                        onChange={(e) => handleUpdateStock(product.id, e.target.value)}
                        className={`w-20 px-2 py-1 rounded border-2 ${
                          product.stock < 20 ? 'border-red-500' : 'border-judgeGray'
                        } focus:border-accent outline-none`}
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
