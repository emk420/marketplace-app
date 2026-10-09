import React, { useState } from 'react';
import { Camera, DollarSign, X, CheckCircle2, ArrowRight, Sparkles, Tag, Plus, Info } from 'lucide-react';
import { Item, Department, Condition } from '../types';
import { CURRENT_USER } from '../data/mockData';

interface SellItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onItemCreated: (newItem: Item) => void;
}

const PRESET_PHOTOS = [
  {
    name: 'Vintage Knit / Wool',
    url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Designer Silk Dress',
    url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Leather Jacket',
    url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Retro Sneakers',
    url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Handbag / Crossbody',
    url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80'
  }
];

export const SellItemModal: React.FC<SellItemModalProps> = ({
  isOpen,
  onClose,
  onItemCreated
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [brand, setBrand] = useState('');
  const [department, setDepartment] = useState<Department>('Women');
  const [category, setCategory] = useState('Tops & Blouses');
  const [size, setSize] = useState('M');
  const [condition, setCondition] = useState<Condition>('Like New');
  const [color, setColor] = useState('Black');
  const [originalPrice, setOriginalPrice] = useState<string>('');
  const [listingPrice, setListingPrice] = useState<string>('');
  const [discountedShipping, setDiscountedShipping] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(PRESET_PHOTOS[0].url);
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');
  const [fabric, setFabric] = useState('100% Wool / Cashmere Blend');
  const [chestMeasurement, setChestMeasurement] = useState('38 in');
  const [lengthMeasurement, setLengthMeasurement] = useState('26 in');

  if (!isOpen) return null;

  // Real-time Poshmark Fee & Net Earnings Math:
  // Under $15: flat $2.95 fee. $15+: 20%
  const numListingPrice = parseFloat(listingPrice) || 0;
  const poshmarkFee =
    numListingPrice === 0
      ? 0
      : numListingPrice < 15
      ? 2.95
      : Number((numListingPrice * 0.20).toFixed(2));
  const shippingDiscountDeduction = discountedShipping ? 2.98 : 0;
  const netEarnings = Math.max(0, numListingPrice - poshmarkFee - shippingDiscountDeduction);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !brand || numListingPrice <= 0) return;

    const newItem: Item = {
      id: `item_${Date.now()}`,
      title,
      description: description || `Pre-loved ${brand} ${category} in ${condition}. Stored in smoke-free closet. Ready to ship with USPS Priority Mail!`,
      brand,
      department,
      category,
      size,
      condition,
      color,
      originalPrice: parseFloat(originalPrice) || numListingPrice * 2,
      listingPrice: numListingPrice,
      discountedShipping,
      photos: [customPhotoUrl || selectedPhoto],
      sellerId: CURRENT_USER.id,
      sellerName: CURRENT_USER.name,
      sellerHandle: CURRENT_USER.handle,
      sellerAvatar: CURRENT_USER.avatar,
      sellerRating: 5.0,
      sellerSalesCount: 14,
      sellerBadges: ['Posh Ambassador I', 'Fast Shipper'],
      sellerAvgShipDays: 1.0,
      likes: 1,
      shares: 0,
      inStock: true,
      fabric,
      measurements: {
        chestOrBust: chestMeasurement,
        length: lengthMeasurement
      },
      createdAt: 'Just now'
    };

    onItemCreated(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-rose-600" />
            <h2 className="text-base font-bold text-stone-900">List an Item in Your Closet</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-1">
          {/* Photos Selection */}
          <div>
            <label className="block text-xs font-bold text-stone-900 mb-2">
              Item Photos (Cover Photo)
            </label>
            <div className="grid grid-cols-5 gap-2 mb-3">
              {PRESET_PHOTOS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedPhoto(p.url);
                    setCustomPhotoUrl('');
                  }}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedPhoto === p.url && !customPhotoUrl
                      ? 'border-stone-900 ring-2 ring-stone-900/20'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] text-white py-0.5 text-center truncate px-1">
                    {p.name.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-stone-500 text-[11px]">Or custom image URL:</span>
              <input
                type="text"
                placeholder="https://..."
                value={customPhotoUrl}
                onChange={(e) => setCustomPhotoUrl(e.target.value)}
                className="flex-1 px-2.5 py-1 text-xs border border-stone-300 rounded focus:ring-1 focus:ring-stone-900"
              />
            </div>
          </div>

          {/* Title & Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Listing Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Wool Scarf Coat or Vintage Denim"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Brand *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Burberry, Acne Studios, Levi's"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900"
              />
            </div>
          </div>

          {/* Department, Category, Size, Condition */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-stone-700 font-semibold mb-1">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as Department)}
                className="w-full px-2.5 py-2 border border-stone-300 rounded-lg bg-white"
              >
                <option value="Women">Women</option>
                <option value="Men">Men</option>
                <option value="Luxury">Luxury</option>
                <option value="Bags">Bags</option>
                <option value="Shoes">Shoes</option>
                <option value="Vintage">Vintage</option>
                <option value="Kids">Kids</option>
              </select>
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Outerwear"
                className="w-full px-2.5 py-2 border border-stone-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">Size</label>
              <input
                type="text"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="S, M, L, 28x32"
                className="w-full px-2.5 py-2 border border-stone-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">Condition</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as Condition)}
                className="w-full px-2.5 py-2 border border-stone-300 rounded-lg bg-white"
              >
                <option value="NWT (New with Tags)">NWT (New with Tags)</option>
                <option value="Like New">Like New</option>
                <option value="Gently Used">Gently Used</option>
                <option value="Good Condition">Good Condition</option>
              </select>
            </div>
          </div>

          {/* Description & Fabric */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Description & Flaws
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe fit, feel, condition, any marks, and why you love it..."
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Material / Fabric</label>
                <input
                  type="text"
                  value={fabric}
                  onChange={(e) => setFabric(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-stone-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Chest / Bust</label>
                <input
                  type="text"
                  value={chestMeasurement}
                  onChange={(e) => setChestMeasurement(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-stone-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Length</label>
                <input
                  type="text"
                  value={lengthMeasurement}
                  onChange={(e) => setLengthMeasurement(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-stone-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Pricing & Real-Time Net Earnings Calculator */}
          <div className="border border-stone-200 rounded-lg p-4 bg-stone-50 space-y-4">
            <div className="font-bold text-xs text-stone-900 flex items-center justify-between">
              <span>Pricing & Earnings Calculator</span>
              <span className="text-[11px] text-stone-500 font-normal">Poshmark Fee: 20% on $15+</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] text-stone-600 mb-1">Original Retail Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-stone-400 text-xs">$</span>
                  <input
                    type="number"
                    placeholder="350"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    className="w-full pl-7 pr-3 py-1.5 text-xs border border-stone-300 rounded-lg bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-stone-600 mb-1">Listing Price *</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-stone-900 font-bold text-xs">$</span>
                  <input
                    type="number"
                    required
                    placeholder="120"
                    value={listingPrice}
                    onChange={(e) => setListingPrice(e.target.value)}
                    className="w-full pl-7 pr-3 py-1.5 text-xs font-bold border border-stone-400 rounded-lg bg-white focus:ring-1 focus:ring-stone-900"
                  />
                </div>
              </div>
            </div>

            {/* Seller Discounted Shipping Option */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={discountedShipping}
                  onChange={(e) => setDiscountedShipping(e.target.checked)}
                  className="rounded text-stone-900 focus:ring-stone-900"
                />
                <span className="text-stone-700">
                  Offer $4.99 shipping discount (Seller covers $2.98 difference to boost sales)
                </span>
              </label>
            </div>

            {/* Real-time Earnings Result Card */}
            <div className="p-3 bg-white rounded-lg border border-stone-200 text-xs space-y-1.5">
              <div className="flex justify-between text-stone-600">
                <span>Listing Price</span>
                <span className="tabular-nums font-semibold">${numListingPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Poshmark Commission</span>
                <span className="tabular-nums">-${poshmarkFee.toFixed(2)}</span>
              </div>
              {discountedShipping && (
                <div className="flex justify-between text-stone-500">
                  <span>Shipping Promo Split</span>
                  <span className="tabular-nums">-$2.98</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-emerald-700 pt-1.5 border-t border-stone-100">
                <span>Your Net Earnings:</span>
                <span className="tabular-nums">${netEarnings.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title || !brand || numListingPrice <= 0}
              className="px-6 py-2.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 rounded-lg transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
            >
              List Item in Closet
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
