import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, Timestamp, doc, updateDoc, increment, runTransaction, getDoc } from 'firebase/firestore';
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
  serialNo?: number;
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

// Stock validation result
export interface StockValidationResult {
  isValid: boolean;
  insufficientItems: Array<{
    productId: string;
    productName: string;
    requested: number;
    available: number;
  }>;
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
      
      // Sort client-side by serialNo (ascending)
      return products.sort((a, b) => {
        if (a.serialNo === undefined && b.serialNo === undefined) return 0;
        if (a.serialNo === undefined) return 1;
        if (b.serialNo === undefined) return -1;
        return a.serialNo - b.serialNo;
      });
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
      
      // Sort client-side by serialNo (ascending), products without serialNo go to the end
      return products.sort((a, b) => {
        if (a.serialNo === undefined && b.serialNo === undefined) return 0;
        if (a.serialNo === undefined) return 1;
        if (b.serialNo === undefined) return -1;
        return a.serialNo - b.serialNo;
      });
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

  // NEW: Check stock availability for cart items
  async validateStock(cartItems: Array<{ productId: string; quantity: number; productName: string }>): Promise<StockValidationResult> {
    try {
      const insufficientItems: Array<{
        productId: string;
        productName: string;
        requested: number;
        available: number;
      }> = [];

      // Check each product's stock
      for (const item of cartItems) {
        const productRef = doc(db, 'products', item.productId);
        const productSnap = await getDoc(productRef);
        
        if (!productSnap.exists()) {
          insufficientItems.push({
            productId: item.productId,
            productName: item.productName,
            requested: item.quantity,
            available: 0,
          });
          continue;
        }

        const productData = productSnap.data() as Product;
        const availableStock = productData.stock || 0;

        if (availableStock < item.quantity) {
          insufficientItems.push({
            productId: item.productId,
            productName: item.productName,
            requested: item.quantity,
            available: availableStock,
          });
        }
      }

      return {
        isValid: insufficientItems.length === 0,
        insufficientItems,
      };
    } catch (error) {
      console.error('Error validating stock:', error);
      throw error;
    }
  },

  // NEW: Reduce stock for ordered items (using transaction for atomicity)
  async reduceStock(cartItems: Array<{ productId: string; quantity: number }>): Promise<void> {
    try {
      await runTransaction(db, async (transaction) => {
        // Read all product stocks first
        const productRefs = cartItems.map(item => doc(db, 'products', item.productId));
        const productSnaps = await Promise.all(
          productRefs.map(ref => transaction.get(ref))
        );

        // Verify stock availability in the transaction
        const stockIssues: string[] = [];
        productSnaps.forEach((snap, index) => {
          if (!snap.exists()) {
            stockIssues.push(`Product ${cartItems[index].productId} not found`);
            return;
          }
          
          const currentStock = snap.data().stock || 0;
          if (currentStock < cartItems[index].quantity) {
            stockIssues.push(
              `Insufficient stock for ${snap.data().name}: ${currentStock} available, ${cartItems[index].quantity} requested`
            );
          }
        });

        if (stockIssues.length > 0) {
          throw new Error(`Stock validation failed: ${stockIssues.join(', ')}`);
        }

        // Update all product stocks
        productRefs.forEach((ref, index) => {
          transaction.update(ref, {
            stock: increment(-cartItems[index].quantity),
            updatedAt: Timestamp.now(),
          });
        });
      });

      console.log('Stock reduced successfully for all items');
    } catch (error) {
      console.error('Error reducing stock:', error);
      throw error;
    }
  },

  // UPDATED: Create order with stock reduction
  async createOrder(orderData: Omit<Order, 'id'>): Promise<string> {
    try {
      // First validate and reduce stock
      const cartItems = orderData.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        productName: item.productDetails.name,
      }));

      // Validate stock availability
      const stockValidation = await this.validateStock(cartItems);
      if (!stockValidation.isValid) {
        const errorMessage = stockValidation.insufficientItems
          .map(item => `${item.productName}: ${item.available} available, ${item.requested} requested`)
          .join('\n');
        throw new Error(`Insufficient stock:\n${errorMessage}`);
      }

      // Reduce stock atomically
      await this.reduceStock(cartItems);

      // Create the order
      const docRef = await addDoc(collection(db, 'orders'), {
        ...orderData,
        createdAt: Timestamp.now(),
      });
      
      console.log('Order created with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // NEW: Get current stock for a product
  async getProductStock(productId: string): Promise<number> {
    try {
      const productRef = doc(db, 'products', productId);
      const productSnap = await getDoc(productRef);
      
      if (!productSnap.exists()) {
        throw new Error('Product not found');
      }
      
      return productSnap.data().stock || 0;
    } catch (error) {
      console.error('Error fetching product stock:', error);
      throw error;
    }
  },
};