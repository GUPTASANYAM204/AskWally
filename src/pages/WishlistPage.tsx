import React, { useState } from 'react';
import { useWishlist } from '../contexts/WishlistContext';
import { Trash2, Plus, Edit2, X, ChevronDown, ChevronUp, Trash } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { mockProducts } from '../data/mockProducts';

const WishlistPage: React.FC = () => {
  const {
    wishlists,
    selectedWishlist,
    selectedWishlistId,
    createWishlist,
    renameWishlist,
    deleteWishlist,
    selectWishlist,
    removeFromWishlist,
  } = useWishlist();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [newName, setNewName] = useState('');
  const [showNewForm, setShowNewForm] = useState(false);
  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [showList, setShowList] = useState(false);

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar for Wishlists */}
        <div className="md:w-1/4 w-full mb-8 md:mb-0">
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Wishlists</h3>
              <button
                className="p-1 rounded hover:bg-walmart-blue/10"
                onClick={() => setShowList(v => !v)}
              >
                {showList ? <ChevronUp /> : <ChevronDown />}
              </button>
            </div>
            {(showList || window.innerWidth >= 768) && (
              <ul className="space-y-2">
                {wishlists.map(wl => (
                  <li key={wl.id} className={`flex items-center justify-between px-2 py-1 rounded cursor-pointer ${wl.id === selectedWishlistId ? 'bg-walmart-blue/10' : 'hover:bg-gray-100'}`}
                      onClick={() => selectWishlist(wl.id)}>
                    <span className="truncate font-medium text-gray-700">{renameId === wl.id ? (
                      <input
                        value={renameValue}
                        onChange={e => setRenameValue(e.target.value)}
                        onBlur={() => { renameWishlist(wl.id, renameValue); setRenameId(null); }}
                        onKeyDown={e => { if (e.key === 'Enter') { renameWishlist(wl.id, renameValue); setRenameId(null); }}}
                        className="px-2 py-1 border rounded text-sm w-24"
                        autoFocus
                      />
                    ) : (
                      wl.name
                    )}</span>
                    <div className="flex items-center gap-1 ml-2">
                      <button className="p-1 hover:bg-gray-200 rounded" title="Rename" onClick={e => { e.stopPropagation(); setRenameId(wl.id); setRenameValue(wl.name); }}><Edit2 className="w-4 h-4 text-gray-500" /></button>
                      {wishlists.length > 1 && (
                        <button className="p-1 hover:bg-red-100 rounded" title="Delete" onClick={e => { e.stopPropagation(); deleteWishlist(wl.id); }}><Trash className="w-4 h-4 text-red-400" /></button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-4">
              {showNewForm ? (
                <form onSubmit={e => { e.preventDefault(); if (newName.trim()) { createWishlist(newName.trim()); setNewName(''); setShowNewForm(false); }}} className="flex gap-2">
                  <input
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    placeholder="New wishlist name"
                    className="px-2 py-1 border rounded text-sm flex-1"
                  />
                  <button type="submit" className="bg-walmart-blue text-white px-3 py-1 rounded font-semibold text-sm">Add</button>
                  <button type="button" className="p-1" onClick={() => setShowNewForm(false)}><X /></button>
                </form>
              ) : (
                <button className="flex items-center gap-1 text-walmart-blue font-medium hover:underline mt-2" onClick={() => setShowNewForm(true)}><Plus className="w-4 h-4" />New Wishlist</button>
              )}
            </div>
          </div>
        </div>
        {/* Wishlist Items Grid */}
        <div className="md:w-3/4 w-full">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{selectedWishlist?.name || 'Wishlist'}</h2>
            {!selectedWishlist || selectedWishlist.items.length === 0 ? (
              <div className="text-gray-600">No items in this wishlist yet.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {selectedWishlist.items.map(item => (
                  <div key={item.id + (item.selectedSize || '')} className="relative bg-gray-50 border border-gray-100 rounded-xl p-4 flex flex-col items-center">
                    <button
                      className="absolute top-2 right-2 p-1 rounded-full bg-white hover:bg-red-100 border border-gray-200"
                      onClick={() => removeFromWishlist(item.id, item.selectedSize, selectedWishlist.id)}
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 className="w-5 h-5 text-red-400" />
                    </button>
                    <button
                      className="absolute top-2 left-2 p-1 rounded-full bg-white hover:bg-green-100 border border-gray-200"
                      onClick={() => {
                        const product = mockProducts.find(p => p.id === item.id);
                        if (product) addItem(product, item.selectedSize);
                      }}
                      aria-label="Add to cart"
                    >
                      <Plus className="w-5 h-5 text-green-600" />
                    </button>
                    <div
                      className="w-full flex flex-col items-center cursor-pointer"
                      onClick={() => navigate(`/product/${item.id}`)}
                    >
                      <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded mb-2" />
                      <div className="font-semibold text-gray-800 text-center mb-1">{item.name}</div>
                      {item.brand && <div className="text-xs text-gray-500 mb-1">{item.brand}</div>}
                      <div className="text-walmart-blue font-bold">${item.price.toFixed(2)}</div>
                      {item.selectedSize && <div className="text-xs text-gray-500">Size: {item.selectedSize}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
