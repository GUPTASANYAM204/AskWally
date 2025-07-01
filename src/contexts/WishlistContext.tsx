import React, { createContext, useContext, useReducer, useEffect } from 'react';

export interface WishlistItem {
  id: string;
  name: string;
  image: string;
  brand?: string;
  price: number;
  selectedSize?: string;
}

export interface Wishlist {
  id: string;
  name: string;
  items: WishlistItem[];
}

interface WishlistState {
  wishlists: Wishlist[];
  selectedWishlistId: string | null;
}

const initialState: WishlistState = {
  wishlists: [],
  selectedWishlistId: null,
};

const WishlistContext = createContext<{
  wishlists: Wishlist[];
  selectedWishlistId: string | null;
  selectedWishlist: Wishlist | undefined;
  createWishlist: (name: string) => void;
  renameWishlist: (id: string, name: string) => void;
  deleteWishlist: (id: string) => void;
  selectWishlist: (id: string) => void;
  addToWishlist: (item: WishlistItem, wishlistId?: string) => void;
  removeFromWishlist: (id: string, selectedSize?: string, wishlistId?: string) => void;
  isInWishlist: (id: string, selectedSize?: string, wishlistId?: string) => boolean;
} | undefined>(undefined);

function wishlistReducer(state: WishlistState, action: any): WishlistState {
  switch (action.type) {
    case 'CREATE_WISHLIST': {
      const newWishlist: Wishlist = {
        id: action.id,
        name: action.name,
        items: [],
      };
      return {
        ...state,
        wishlists: [newWishlist, ...state.wishlists],
        selectedWishlistId: action.id,
      };
    }
    case 'RENAME_WISHLIST': {
      return {
        ...state,
        wishlists: state.wishlists.map(w =>
          w.id === action.id ? { ...w, name: action.name } : w
        ),
      };
    }
    case 'DELETE_WISHLIST': {
      const wishlists = state.wishlists.filter(w => w.id !== action.id);
      let selectedWishlistId = state.selectedWishlistId;
      if (selectedWishlistId === action.id) {
        selectedWishlistId = wishlists.length > 0 ? wishlists[0].id : null;
      }
      return {
        ...state,
        wishlists,
        selectedWishlistId,
      };
    }
    case 'SELECT_WISHLIST': {
      return {
        ...state,
        selectedWishlistId: action.id,
      };
    }
    case 'ADD': {
      const { wishlistId, item } = action;
      return {
        ...state,
        wishlists: state.wishlists.map(w =>
          w.id === wishlistId
            ? w.items.some(i => i.id === item.id && i.selectedSize === item.selectedSize)
              ? w
              : { ...w, items: [item, ...w.items] }
            : w
        ),
      };
    }
    case 'REMOVE': {
      const { wishlistId, id, selectedSize } = action;
      return {
        ...state,
        wishlists: state.wishlists.map(w =>
          w.id === wishlistId
            ? {
                ...w,
                items: w.items.filter(
                  i => !(i.id === id && (selectedSize ? i.selectedSize === selectedSize : true))
                ),
              }
            : w
        ),
      };
    }
    case 'LOAD': {
      return { ...state, ...action.state };
    }
    default:
      return state;
  }
}


export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('wishlists_v2');
    if (stored) {
      const parsed = JSON.parse(stored);
      dispatch({ type: 'LOAD', state: parsed });
    } else {
      // If no wishlists exist, create a default one
      const defaultId = 'default';
      dispatch({ type: 'CREATE_WISHLIST', id: defaultId, name: 'My Wishlist' });
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('wishlists_v2', JSON.stringify(state));
  }, [state]);

  const createWishlist = (name: string) => {
    const id = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    dispatch({ type: 'CREATE_WISHLIST', id, name });
  };

  const renameWishlist = (id: string, name: string) => {
    dispatch({ type: 'RENAME_WISHLIST', id, name });
  };

  const deleteWishlist = (id: string) => {
    dispatch({ type: 'DELETE_WISHLIST', id });
  };

  const selectWishlist = (id: string) => {
    dispatch({ type: 'SELECT_WISHLIST', id });
  };

  const addToWishlist = (item: WishlistItem, wishlistId?: string) => {
    const targetId = wishlistId || state.selectedWishlistId || (state.wishlists[0]?.id ?? 'default');
    dispatch({ type: 'ADD', wishlistId: targetId, item });
  };

  const removeFromWishlist = (id: string, selectedSize?: string, wishlistId?: string) => {
    const targetId = wishlistId || state.selectedWishlistId || (state.wishlists[0]?.id ?? 'default');
    dispatch({ type: 'REMOVE', wishlistId: targetId, id, selectedSize });
  };

  const isInWishlist = (id: string, selectedSize?: string, wishlistId?: string) => {
    const targetId = wishlistId || state.selectedWishlistId || (state.wishlists[0]?.id ?? 'default');
    const wl = state.wishlists.find(w => w.id === targetId);
    return wl ? wl.items.some(i => i.id === id && i.selectedSize === selectedSize) : false;
  };

  const selectedWishlist = state.wishlists.find(w => w.id === state.selectedWishlistId) || state.wishlists[0];

  return (
    <WishlistContext.Provider value={{
      wishlists: state.wishlists,
      selectedWishlistId: state.selectedWishlistId,
      selectedWishlist,
      createWishlist,
      renameWishlist,
      deleteWishlist,
      selectWishlist,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within a WishlistProvider');
  return ctx;
}
