import { initializeApp } from 'firebase/app';
import { getFirestore, collection,addDoc, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyDBp_vEVahkIY216SmAkceBGcL_h6DVUhs",
  authDomain: "smartcleaners5.firebaseapp.com",
  projectId: "smartcleaners5",
  storageBucket: "smartcleaners5.firebasestorage.app",
  messagingSenderId: "371632438384",
  appId: "1:371632438384:web:7d6d6c283de217e01708b5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Types based on Firebase collections
export interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: Timestamp;
}
export interface Order {
  id?: string;
  orderId: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  createdAt: Date | Timestamp;
  customer: {
    name: string;
    phone: string;
    address: {
      street: string;
      city: string;
      state: string;
      pincode: string;
      fullAddress: string;
    };
  };
  items: Array<{
    productId: string;
    productDetails: {
      name: string;
      sku: string;
      categoryId: string;
      originalPrice: number;
      salePrice?: number;
      weight: string;
      dimensions: string;
      description: string;
      ingredients: string;
      instructions: string;
      images: string[];
    };
    quantity: number;
    unitPrice: number;
    bulkDiscountPerUnit: number;
    finalUnitPrice: number;
    lineTotal: number;
    bulkDiscountApplied: string | null;
  }>;
  pricing: {
    subtotal: number;
    bulkDiscountTotal: number;
    shippingCost: number;
    finalTotal: number;
    itemCount: number;
  };
  flags: {
    isNewCustomer: boolean;
    requiresVerification: boolean;
    priority: 'low' | 'medium' | 'high';
  };
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  categoryId: string;
  images: string[];
  sku: string;
  stock: number;
  weight: string;
  dimensions: string;
  ingredients: string;
  instructions: string;
  isActive: boolean;
  createdAt: Timestamp;
}

export interface Combo {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  comboPrice: number;
  originalPrice: number;
  savings: number;
  products: string[]; // Array of product IDs
  isActive: boolean;
  isFeatured: boolean;
  validFrom: Timestamp;
  validUntil: Timestamp;
  createdAt: Timestamp;
}

// Firebase service functions
export const firebaseService = {
  // Fetch categories (client-side sorting to avoid index requirements)
  async getCategories(): Promise<Category[]> {
    try {
      const q = query(
        collection(db, 'categories'),
        where('isActive', '==', true)
      );
      const snapshot = await getDocs(q);
      const categories = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Category));
      
      // Sort client-side by name
      return categories.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Fetch products by category (client-side sorting to avoid index requirements)
  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    try {
      const q = query(
        collection(db, 'products'),
        where('categoryId', '==', categoryId),
        where('isActive', '==', true)
      );
      const snapshot = await getDocs(q);
      const products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Product));
      
      // Sort client-side by name
      return products.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  },

  // Fetch all active products (client-side sorting to avoid index requirements)
  async getProducts(): Promise<Product[]> {
    try {
      const q = query(
        collection(db, 'products'),
        where('isActive', '==', true)
      );
      const snapshot = await getDocs(q);
      const products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Product));
      
      // Sort client-side by name
      return products.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Fetch combos (client-side sorting to avoid index requirements)
  async getCombos(): Promise<Combo[]> {
    try {
      const q = query(
        collection(db, 'combos'),
        where('isActive', '==', true)
      );
      const snapshot = await getDocs(q);
      const combos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Combo));
      
      // Sort client-side by name
      return combos.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error('Error fetching combos:', error);
      throw error;
    }
  },

  // Fetch featured combos (client-side sorting to avoid index requirements)
  async getFeaturedCombos(): Promise<Combo[]> {
    try {
      const q = query(
        collection(db, 'combos'),
        where('isActive', '==', true),
        where('isFeatured', '==', true)
      );
      const snapshot = await getDocs(q);
      const combos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Combo));
      
      // Sort client-side by name
      return combos.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error('Error fetching featured combos:', error);
      throw error;
    }
  },

  async createOrder(orderData: Omit<Order, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'orders'), {
        ...orderData,
        createdAt: Timestamp.now(), // Convert to Firestore Timestamp
      });
      console.log('Order created with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }
};