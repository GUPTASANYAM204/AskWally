import React, { createContext, useContext, useReducer, useEffect } from 'react';

export interface OrderItem {
  id: string;
  name: string;
  image: string;
  brand?: string;
  price: number;
  quantity: number;
  selectedSize?: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  createdAt: string;
}

interface OrderState {
  orders: Order[];
}

type OrderAction =
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'LOAD_ORDERS'; payload: Order[] };

const orderReducer = (state: OrderState, action: OrderAction): OrderState => {
  switch (action.type) {
    case 'ADD_ORDER':
      return { ...state, orders: [action.payload, ...state.orders] };
    case 'LOAD_ORDERS':
      return { ...state, orders: action.payload };
    default:
      return state;
  }
};

const initialState: OrderState = {
  orders: [],
};

interface OrderContextType extends OrderState {
  addOrder: (order: Order) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, initialState);

  // Load orders from localStorage on mount
  useEffect(() => {
    const savedOrders = localStorage.getItem('askwally-orders');
    if (savedOrders) {
      try {
        const orderData = JSON.parse(savedOrders);
        dispatch({ type: 'LOAD_ORDERS', payload: orderData });
      } catch (error) {
        console.error('Error loading orders from localStorage:', error);
      }
    }
  }, []);

  // Save orders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('askwally-orders', JSON.stringify(state.orders));
  }, [state.orders]);

  const addOrder = (order: Order) => {
    dispatch({ type: 'ADD_ORDER', payload: order });
  };

  return (
    <OrderContext.Provider value={{ ...state, addOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
