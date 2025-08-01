import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { OrderProvider } from './contexts/OrderContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { WallyAssistantProvider } from './contexts/WallyAssistantContext';
import { Navigation } from './components/Navigation';
import { ErrorBoundary } from './components/ErrorBoundary';
import { CartDrawer } from './components/CartDrawer';
import { WallyAssistant } from './components/WallyAssistant';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { StoreMapPage } from './pages/StoreMapPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import ProfilePage from './pages/ProfilePage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import WishlistPage from './pages/WishlistPage';
import { useWallyAssistant } from './contexts/WallyAssistantContext';

// Wrapper component to use the WallyAssistant context
const WallyAssistantWrapper: React.FC = () => {
  const { isOpen, toggleChat } = useWallyAssistant();
  
  return (
    <WallyAssistant 
      isOpen={isOpen} 
      onToggle={toggleChat}
    />
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <OrderProvider>
            <WishlistProvider>
              <Router>
                <WallyAssistantProvider>
                  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 font-inter">
                    <Navigation />
                    <CartDrawer />
                    <WallyAssistantWrapper />
                      <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignupPage />} />
                        <Route path="/products" element={<ProductsPage />} />
                        <Route path="/product/:id" element={<ProductDetailPage />} />
                        <Route path="/store-map" element={<StoreMapPage />} />
                        <Route 
                          path="/checkout" 
                          element={
                            <ProtectedRoute>
                              <CheckoutPage />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="/order-confirmation" 
                          element={
                            <ProtectedRoute>
                              <OrderConfirmationPage />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="/profile" 
                          element={
                            <ProtectedRoute>
                              <ProfilePage />
                            </ProtectedRoute>
                          } 
                        />
                        <Route path="/terms" element={<TermsPage />} />
                        <Route path="/privacy" element={<PrivacyPage />} />
                        <Route path="/wishlist" element={
                          <ProtectedRoute>
                            <WishlistPage />
                          </ProtectedRoute>
                        } />
                      </Routes>
                    </div>
                  </WallyAssistantProvider>
                </Router>
              </WishlistProvider>
            </OrderProvider>
          </CartProvider>
        </AuthProvider>
      </ErrorBoundary>
    );
  }

export default App;