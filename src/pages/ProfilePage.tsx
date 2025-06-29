import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useOrders } from '../contexts/OrderContext';
import { Download, Edit } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { orders } = useOrders();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    profilePicture: user?.profilePicture || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.state || '',
    zipCode: user?.zipCode || '',
  });

  if (!user) {
    return <div className="pt-16 min-h-screen flex items-center justify-center text-xl">Please log in to view your profile.</div>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, profilePicture: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    updateProfile({
      profilePicture: form.profilePicture,
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      address: {
        street: form.address,
        city: form.city,
        state: form.state,
        zipCode: form.zipCode,
      },
    });
    setEditing(false);
  };

  const handleDownloadInvoice = (orderId: string) => {
    window.print(); // Simple print for now; can be replaced with PDF generation
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              {form.profilePicture ? (
                <img
                  src={form.profilePicture}
                  alt="Profile Avatar"
                  className="w-20 h-20 rounded-full object-cover border-2 border-walmart-blue shadow"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300">
                  <span className="text-3xl text-gray-400">👤</span>
                </div>
              )}
              {editing && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-walmart-blue/80 file:text-white hover:file:bg-walmart-blue-dark"
                  />
                </div>
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
            {!editing && (
              <button
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-walmart-blue text-white font-semibold hover:bg-walmart-blue-dark transition-all duration-200"
                onClick={() => setEditing(true)}
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-600 font-medium mb-1">First Name</label>
              {editing ? (
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-walmart-blue"
                />
              ) : (
                <div className="py-2">{user.firstName}</div>
              )}
            </div>
            <div>
              <label className="block text-gray-600 font-medium mb-1">Last Name</label>
              {editing ? (
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-walmart-blue"
                />
              ) : (
                <div className="py-2">{user.lastName}</div>
              )}
            </div>
            <div>
              <label className="block text-gray-600 font-medium mb-1">Email</label>
              {editing ? (
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-walmart-blue"
                />
              ) : (
                <div className="py-2">{user.email}</div>
              )}
            </div>
            <div>
              <label className="block text-gray-600 font-medium mb-1">Phone</label>
              {editing ? (
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-walmart-blue"
                />
              ) : (
                <div className="py-2">{user.phone}</div>
              )}
            </div>
            <div>
              <label className="block text-gray-600 font-medium mb-1">Address</label>
              {editing ? (
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-walmart-blue mb-2"
                  placeholder="Street"
                />
              ) : (
                <div className="py-2">{user.address?.street}</div>
              )}
            </div>
            <div>
              <label className="block text-gray-600 font-medium mb-1">City</label>
              {editing ? (
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-walmart-blue"
                />
              ) : (
                <div className="py-2">{user.address?.city}</div>
              )}
            </div>
            <div>
              <label className="block text-gray-600 font-medium mb-1">State</label>
              {editing ? (
                <input
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-walmart-blue"
                />
              ) : (
                <div className="py-2">{user.address?.state}</div>
              )}
            </div>
            <div>
              <label className="block text-gray-600 font-medium mb-1">ZIP Code</label>
              {editing ? (
                <input
                  name="zipCode"
                  value={form.zipCode}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-walmart-blue"
                />
              ) : (
                <div className="py-2">{user.address?.zipCode}</div>
              )}
            </div>
          </div>
          {editing && (
            <div className="flex justify-end space-x-2 mt-6">
              <button
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-walmart-blue text-white font-semibold hover:bg-walmart-blue-dark"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          )}
        </div>

        {/* Order History Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Order History</h2>
          {orders.length === 0 ? (
            <div className="text-gray-600">No orders found.</div>
          ) : (
            <div className="space-y-6">
              {orders.map(order => (
                <div key={order.id} className="border border-gray-100 rounded-xl p-4 bg-gray-50 flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="font-semibold text-gray-800">Order #{order.id}</div>
                    <div className="text-gray-600 text-sm">Placed on {new Date(order.createdAt).toLocaleString()}</div>
                    <div className="text-gray-600 text-sm">Total: <span className="font-bold text-walmart-blue">${order.total.toFixed(2)}</span></div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {order.items.map(item => (
                        <div key={item.id + (item.selectedSize || '')} className="flex items-center space-x-2 bg-white border border-gray-200 rounded-lg px-3 py-1">
                          <img src={item.image} alt={item.name} className="w-8 h-8 object-cover rounded" />
                          <div className="text-gray-800 text-sm">{item.name}</div>
                          {item.selectedSize && <div className="text-xs text-gray-500">({item.selectedSize})</div>}
                          <div className="text-xs text-gray-500">x{item.quantity}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 mt-4 md:mt-0 md:items-end">
                    <button
                      onClick={() => handleDownloadInvoice(order.id)}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-walmart-blue text-walmart-blue font-semibold hover:bg-walmart-blue hover:text-white transition-all duration-200"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Invoice</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
