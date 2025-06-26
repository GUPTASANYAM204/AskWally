import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, Truck, Home, Download } from 'lucide-react';

export const OrderConfirmationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderNumber, total, items } = location.state || {};

  if (!orderNumber) {
    navigate('/');
    return null;
  }

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 3);

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Confirmed!</h1>
          <p className="text-lg text-gray-600">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Order Number</h3>
              <p className="text-2xl font-bold text-walmart-blue">{orderNumber}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Total Amount</h3>
              <p className="text-2xl font-bold text-gray-800">${total?.toFixed(2)}</p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-semibold text-gray-800 mb-4">Estimated Delivery</h3>
            <p className="text-lg text-gray-600">
              {estimatedDelivery.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>

        {/* Order Timeline */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Order Status</h3>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mb-2">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-semibold text-green-600">Order Placed</p>
              <p className="text-xs text-gray-500">Just now</p>
            </div>
            
            <div className="flex-1 h-0.5 bg-gray-300 mx-4"></div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-walmart-blue rounded-full flex items-center justify-center mb-2">
                <Package className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-semibold text-walmart-blue">Processing</p>
              <p className="text-xs text-gray-500">1-2 hours</p>
            </div>
            
            <div className="flex-1 h-0.5 bg-gray-300 mx-4"></div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mb-2">
                <Truck className="w-6 h-6 text-gray-600" />
              </div>
              <p className="text-sm font-semibold text-gray-600">Shipped</p>
              <p className="text-xs text-gray-500">1-2 days</p>
            </div>
            
            <div className="flex-1 h-0.5 bg-gray-300 mx-4"></div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mb-2">
                <Home className="w-6 h-6 text-gray-600" />
              </div>
              <p className="text-sm font-semibold text-gray-600">Delivered</p>
              <p className="text-xs text-gray-500">3-5 days</p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Order Items</h3>
          
          <div className="space-y-4">
            {items?.map((item: any) => (
              <div key={`${item.id}-${item.selectedSize}`} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-1">{item.name}</h4>
                  <p className="text-sm text-gray-600">{item.brand}</p>
                  {item.selectedSize && (
                    <p className="text-sm text-gray-600">Size: {item.selectedSize}</p>
                  )}
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-walmart-blue">${item.price}</p>
                  <p className="text-sm text-gray-600">
                    Total: ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/products')}
            className="bg-gradient-to-r from-walmart-blue to-walmart-blue-dark text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
          >
            Continue Shopping
          </button>
          
          <button
            onClick={() => window.print()}
            className="bg-white border-2 border-walmart-blue text-walmart-blue px-8 py-3 rounded-xl font-semibold hover:bg-walmart-blue hover:text-white transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <Download className="w-5 h-5" />
            <span>Download Receipt</span>
          </button>
        </div>

        {/* Contact Info */}
        <div className="text-center mt-8 p-6 bg-walmart-blue/5 rounded-2xl">
          <h4 className="font-semibold text-gray-800 mb-2">Need Help?</h4>
          <p className="text-gray-600 mb-4">
            If you have any questions about your order, please contact our customer service team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:1-800-WALMART"
              className="text-walmart-blue hover:text-walmart-blue-dark font-semibold"
            >
              📞 1-800-WALMART
            </a>
            <a
              href="mailto:help@askwally.com"
              className="text-walmart-blue hover:text-walmart-blue-dark font-semibold"
            >
              ✉️ help@askwally.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};