import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';
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
  // Fetch categories (ordered by name to avoid complex indexes)
  async getCategories(): Promise<Category[]> {
    try {
      const q = query(
        collection(db, 'categories'),
        where('isActive', '==', true),
        orderBy('name') // Simple index that should exist by default
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Category));
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Fetch products by category (ordered by name to avoid complex indexes)
  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    try {
      const q = query(
        collection(db, 'products'),
        where('categoryId', '==', categoryId),
        where('isActive', '==', true),
        orderBy('name') // Simple index
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Product));
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  },

  // Fetch all active products (ordered by name)
  async getProducts(): Promise<Product[]> {
    try {
      const q = query(
        collection(db, 'products'),
        where('isActive', '==', true),
        orderBy('name')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Product));
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Fetch combos (ordered by name to avoid complex indexes)
  async getCombos(): Promise<Combo[]> {
    try {
      const q = query(
        collection(db, 'combos'),
        where('isActive', '==', true),
        orderBy('name')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Combo));
    } catch (error) {
      console.error('Error fetching combos:', error);
      throw error;
    }
  },

  // Fetch featured combos
  async getFeaturedCombos(): Promise<Combo[]> {
    try {
      const q = query(
        collection(db, 'combos'),
        where('isActive', '==', true),
        where('isFeatured', '==', true),
        orderBy('name')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Combo));
    } catch (error) {
      console.error('Error fetching featured combos:', error);
      throw error;
    }
  }
};