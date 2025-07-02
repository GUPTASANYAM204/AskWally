import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useWally } from '../contexts/WallyContext';
import { mockProducts } from '../data/mockProducts';

export const WallyProductTracker: React.FC = () => {
  const location = useLocation();
  const { setCurrentProduct, setLastViewedProduct } = useWally();

  useEffect(() => {
    // Track product page visits
    if (location.pathname.startsWith('/product/')) {
      const productId = location.pathname.split('/')[2];
      const product = mockProducts.find(p => p.id === productId);
      
      if (product) {
        setCurrentProduct(product);
        setLastViewedProduct(product);
      }
    } else {
      // Clear current product when leaving product page
      setCurrentProduct(null);
    }
  }, [location.pathname]);

  return null; // This component doesn't render anything
};