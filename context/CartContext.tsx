import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Alert } from 'react-native';

interface CartItem {
  product: any;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  labId: number | null;
  addToCart: (product: any, quantity: number, labId: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  isCartEmpty: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [labId, setLabId] = useState<number | null>(null);

  const addToCart = (product: any, quantity: number, newLabId: number) => {
    if (labId !== null && labId !== newLabId) {
      Alert.alert(
        'مخبر مختلف',
        'لا يمكنك إضافة منتجات من مخابر مختلفة في نفس الطلب. هل تريد تفريغ السلة الحالية؟',
        [
          { text: 'إلغاء', style: 'cancel' },
          {
            text: 'تفريغ السلة',
            style: 'destructive',
            onPress: () => {
              setItems([{ product, quantity }]);
              setLabId(newLabId);
            },
          },
        ]
      );
      return;
    }

    setLabId(newLabId);
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(item => item.product.id === product.id);
      if (existingItemIndex >= 0) {
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += quantity;
        return newItems;
      } else {
        return [...prevItems, { product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: number) => {
    setItems((prevItems) => {
      const newItems = prevItems.filter(item => item.product.id !== productId);
      if (newItems.length === 0) setLabId(null);
      return newItems;
    });
  };

  const clearCart = () => {
    setItems([]);
    setLabId(null);
  };

  const getCartTotal = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      items,
      labId,
      addToCart,
      removeFromCart,
      clearCart,
      getCartTotal,
      isCartEmpty: items.length === 0,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
