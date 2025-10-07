import { collection, getDocs, addDoc, writeBatch, doc } from 'firebase/firestore';
import { db } from './firebase';

const seedData = [
  { name: "Taro", category: "Milk Tea", prices: { Small: 39, Medium: 49, Large: 59 }, stock: 100, image: "/images/drink1.jpg" },
  { name: "Okinawa", category: "Milk Tea", prices: { Small: 39, Medium: 49, Large: 59 }, stock: 100, image: "/images/drink2.jpg" },
  { name: "Wintermelon", category: "Milk Tea", prices: { Small: 39, Medium: 49, Large: 59 }, stock: 100, image: "/images/drink3.jpg" },
  { name: "Brown Sugar", category: "Milk Tea", prices: { Small: 39, Medium: 49, Large: 59 }, stock: 100, image: "/images/drink4.jpg" },
  { name: "Salted Caramel", category: "Milk Tea", prices: { Small: 39, Medium: 49, Large: 59 }, stock: 100, image: "/images/drink5.jpg" },
  { name: "Moffee", category: "Milk Tea", prices: { Small: 39, Medium: 49, Large: 59 }, stock: 100, image: "/images/drink6.jpg" },
  { name: "Cookies n Cream", category: "Milk Tea", prices: { Small: 39, Medium: 49, Large: 59 }, stock: 100, image: "/images/drink7.jpg" },

  { name: "Spanish Latte", category: "Iced Coffee", prices: { Small: 39, Medium: 49, Large: 59 }, stock: 100, image: "/images/coffee1.jpg" },
  { name: "Caramel Macchiato", category: "Iced Coffee", prices: { Small: 39, Medium: 49, Large: 59 }, stock: 100, image: "/images/coffee2.jpg" },
  { name: "Dark Mocha", category: "Iced Coffee", prices: { Small: 39, Medium: 49, Large: 59 }, stock: 100, image: "/images/coffee3.jpg" },
  { name: "Matcha Espresso", category: "Iced Coffee", prices: { Small: 39, Medium: 49, Large: 59 }, stock: 100, image: "/images/coffee4.jpg" },
  { name: "Cafe Latte", category: "Iced Coffee", prices: { Small: 39, Medium: 49, Large: 59 }, stock: 100, image: "/images/coffee5.jpg" },

  { name: "Matcha", category: "Hot Drinks", price: 49, stock: 100, image: "/images/hot1.jpg" },
  { name: "Chocolate", category: "Hot Drinks", price: 49, stock: 100, image: "/images/hot2.jpg" },
  { name: "Red Velvet", category: "Hot Drinks", price: 49, stock: 100, image: "/images/hot3.jpg" },
  { name: "Arabica Coffee", category: "Hot Drinks", price: 49, stock: 100, image: "/images/hot4.jpg" },

  { name: "Red Velvet (Non-Coffee)", category: "Non-Coffee", prices: { Small: 39, Medium: 49, Large: 59 }, stock: 100, image: "/images/noncoffee1.jpg" },
  { name: "Dark Choco", category: "Non-Coffee", prices: { Small: 39, Medium: 49, Large: 59 }, stock: 100, image: "/images/noncoffee2.jpg" },
  { name: "Iced Matcha", category: "Non-Coffee", prices: { Small: 39, Medium: 49, Large: 59 }, stock: 100, image: "/images/noncoffee3.jpg" },
  { name: "Milk Caramel", category: "Non-Coffee", prices: { Small: 39, Medium: 49, Large: 59 }, stock: 100, image: "/images/noncoffee4.jpg" },

  { name: "Blue Lemonade", category: "Fruit Soda", prices: { Small: 39, Medium: 49, Large: 59 }, stock: 100, image: "/images/soda1.jpg" },
  { name: "Green Apple", category: "Fruit Soda", prices: { Small: 39, Medium: 49, Large: 59 }, stock: 100, image: "/images/soda2.jpg" },
  { name: "Strawberry", category: "Fruit Soda", prices: { Small: 39, Medium: 49, Large: 59 }, stock: 100, image: "/images/soda3.jpg" },
  { name: "Blueberry", category: "Fruit Soda", prices: { Small: 39, Medium: 49, Large: 59 }, stock: 100, image: "/images/soda4.jpg" },
  { name: "Lemon", category: "Fruit Soda", prices: { Small: 39, Medium: 49, Large: 59 }, stock: 100, image: "/images/soda5.jpg" },
  { name: "Lychee", category: "Fruit Soda", prices: { Small: 39, Medium: 49, Large: 59 }, stock: 100, image: "/images/soda6.jpg" },

  { name: "Fish Ball", category: "Snacks", price: 20, stock: 200, image: "/images/snack1.jpg" },
  { name: "Mini Hotdogs", category: "Snacks", price: 20, stock: 200, image: "/images/snack2.jpg" },
  { name: "Kikiam", category: "Snacks", price: 20, stock: 200, image: "/images/snack3.jpg" },
  { name: "Chicken Skin", category: "Snacks", price: 45, stock: 100, image: "/images/snack4.jpg" },
  { name: "French Fries", category: "Snacks", price: 45, stock: 100, image: "/images/snack5.jpg" },

  { name: "Milk (Add-on)", category: "Add-on", price: 10, stock: 999, image: "/images/addon1.jpg" },
  { name: "Pearl (Add-on)", category: "Add-on", price: 10, stock: 999, image: "/images/addon2.jpg" },
  { name: "Fruit Jelly (Add-on)", category: "Add-on", price: 10, stock: 999, image: "/images/addon3.jpg" },
  { name: "Yakult (Add-on)", category: "Add-on", price: 10, stock: 999, image: "/images/addon4.jpg" }
];

export const seedFirestore = async () => {
  try {
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);

    if (snapshot.empty) {
      console.log('Seeding Firestore with menu data...');

      const batch = writeBatch(db);
      seedData.forEach(product => {
        const newDocRef = doc(productsRef);
        batch.set(newDocRef, product);
      });

      await batch.commit();
      console.log('Firestore seeded successfully with', seedData.length, 'products');
      return { success: true, count: seedData.length };
    } else {
      console.log('Products collection already has data. Skipping seed.');
      return { success: true, count: snapshot.size, skipped: true };
    }
  } catch (error) {
    console.error('Error seeding Firestore:', error);
    return { success: false, error: error.message };
  }
};

export const checkAndSeedFirestore = async () => {
  try {
    const result = await seedFirestore();
    return result;
  } catch (error) {
    console.error('Error in checkAndSeedFirestore:', error);
    return { success: false, error: error.message };
  }
};
