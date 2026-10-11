import React, { useState } from 'react';
import { Tag, X, ArrowRight, CheckCircle2, ShieldCheck, DollarSign } from 'lucide-react';
import { Item, Offer } from '../types';
import { CURRENT_USER } from '../data/mockData';
import { FashionImage } from './FashionImage';
import { useAuth } from '../context/AuthContext';

interface OfferModalProps {
  item: Item;
  isOpen: boolean;
  onClose: () => void;
  onOfferSubmitted: (offer: Offer) => void;
}

export const OfferModal: React.FC<OfferModalProps> = ({
  item,
  isOpen,
  onClose,
  onOfferSubmitted
}) => {
  const { user, userProfile } = useAuth();
  const [offerPrice, setOfferPrice] = useState<number>(Math.round(item.listingPrice * 0.85));
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const discountPercent = Math.round(((item.listingPrice - offerPrice) / item.listingPrice) * 100);

  const applyPercent = (pct: number) => {
    setOfferPrice(Math.round(item.listingPrice * (1 - pct / 100)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (offerPrice <= 0 || offerPrice >= item.listingPrice) return;

    const newOffer: Offer = {
      id: `off_${Date.now()}`,
      itemId: item.id,
      itemTitle: item.title,
      itemPhoto: item.photos[0],
      itemBrand: item.brand,
      itemSize: item.size,
      originalListingPrice: item.listingPrice,
      offeredPrice: offerPrice,
      buyerId: user?.uid || CURRENT_USER.id,
      buyerHandle: userProfile?.handle || CURRENT_USER.handle,
      buyerName: user?.displayName || userProfile?.name || CURRENT_USER.name,
      sellerId: item.sellerId,
      sellerHandle: item.sellerHandle,
      status: offerPrice >= item.listingPrice * 0.9 ? 'accepted' : 'pending',
      createdAt: 'Just now',
      expiresAt: 'In 24 hours'
    };

    onOfferSubmitted(newOffer);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-rose-600" />
            <h2 className="text-base font-bold text-stone-900">Make an Offer</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-stone-900">Offer Sent to Seller!</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              {item.sellerHandle} has 24 hours to accept, counter, or decline your offer of ${offerPrice}. If accepted, your payment will automatically process.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Item preview */}
            <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg border border-stone-200">
              <div className="w-14 h-14 rounded overflow-hidden shrink-0">
                <FashionImage
                  src={item.photos[0]}
                  alt={item.title}
                  brand={item.brand}
                  aspectRatio="square"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500">{item.brand}</div>
                <div className="text-xs font-semibold text-stone-900 truncate">{item.title}</div>
                <div className="text-xs text-stone-500 mt-0.5">
                  Listing Price: <span className="font-bold text-stone-900">${item.listingPrice}</span>
                </div>
              </div>
            </div>

            {/* Quick percent discounts */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-2">
                Quick Discount Presets
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[10, 15, 20].map((pct) => {
                  const target = Math.round(item.listingPrice * (1 - pct / 100));
                  return (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => applyPercent(pct)}
                      className={`p-2 rounded-lg border text-xs text-center transition-colors ${
                        offerPrice === target
                          ? 'border-stone-900 bg-stone-900 text-white'
                          : 'border-stone-200 hover:border-stone-400 text-stone-700'
                      }`}
                    >
                      <div className="font-bold">{pct}% Off</div>
                      <div className="text-[11px] opacity-80">${target}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Offer Price Input */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Your Offer Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-stone-500 font-bold text-sm">$</span>
                <input
                  type="number"
                  min="5"
                  max={item.listingPrice - 1}
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-2 border border-stone-300 rounded-lg text-base font-bold text-stone-900 focus:ring-1 focus:ring-stone-900 focus:border-stone-900"
                />
              </div>
              <div className="flex justify-between items-center text-xs text-stone-500 mt-1.5">
                <span>
                  {discountPercent > 0 ? `${discountPercent}% off listing price` : 'No discount'}
                </span>
                <span>You save: ${Math.max(0, item.listingPrice - offerPrice)}</span>
              </div>
            </div>

            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs text-stone-600 space-y-1">
              <div className="font-semibold text-stone-900">How Offers Work:</div>
              <p className="text-[11px] leading-relaxed">
                By submitting, you agree to purchase this item at ${offerPrice} + $7.97 shipping if accepted within 24 hours. No charge is made unless accepted.
              </p>
            </div>

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
                disabled={offerPrice <= 0 || offerPrice >= item.listingPrice}
                className="px-5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 disabled:bg-stone-300 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
              >
                Submit Offer
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
