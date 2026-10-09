import React, { useState } from 'react';
import {
  Heart,
  Share2,
  ShieldCheck,
  Truck,
  Tag,
  Star,
  CheckCircle2,
  X,
  ArrowRight,
  ShoppingBag,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { Item, Seller } from '../types';
import { FashionImage } from './FashionImage';

interface ItemDetailModalProps {
  item: Item;
  isOpen: boolean;
  onClose: () => void;
  onBuyNow: (item: Item) => void;
  onMakeOffer: (item: Item) => void;
  onShare: (item: Item) => void;
  onLikeToggle: (itemId: string) => void;
  isLiked: boolean;
  onViewCloset: (sellerId: string) => void;
  onAddToBundle: (item: Item) => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  isOpen,
  onClose,
  onBuyNow,
  onMakeOffer,
  onShare,
  onLikeToggle,
  isLiked,
  onViewCloset,
  onAddToBundle
}) => {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [bundleAdded, setBundleAdded] = useState(false);

  if (!isOpen) return null;

  const percentOff = Math.round(
    ((item.originalPrice - item.listingPrice) / item.originalPrice) * 100
  );

  const handleBundleClick = () => {
    onAddToBundle(item);
    setBundleAdded(true);
    setTimeout(() => setBundleAdded(false), 2200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[94vh]">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <span className="font-semibold text-stone-900">{item.department}</span>
            <span aria-hidden="true">·</span>
            <span>{item.category}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-stone-400">ID #{item.id.replace('item_', '')}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Split 2-Column Grid */}
        <div className="overflow-y-auto p-6 flex-1 grid grid-cols-1 md:grid-cols-12 gap-8 bg-white">
          {/* Left Column: Gallery */}
          <div className="md:col-span-6 space-y-4">
            <div className="rounded-lg overflow-hidden border border-stone-200 shadow-xs relative">
              <FashionImage
                src={item.photos[activePhotoIdx] || item.photos[0]}
                alt={item.title}
                brand={item.brand}
                category={item.category}
                aspectRatio="4/3"
              />
              {percentOff > 0 && (
                <div className="absolute top-3 left-3 bg-stone-900/90 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded shadow-xs">
                  {percentOff}% OFF RETAIL
                </div>
              )}
            </div>

            {/* Thumbnail selector if multiple photos */}
            {item.photos.length > 1 && (
              <div className="flex gap-2">
                {item.photos.map((photo, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActivePhotoIdx(idx)}
                    className={`w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
                      activePhotoIdx === idx
                        ? 'border-stone-900 ring-2 ring-stone-900/20'
                        : 'border-stone-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={photo} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Buyer Trust Guarantees */}
            <div className="p-4 bg-stone-50 rounded-lg border border-stone-200/80 space-y-2 text-xs text-stone-600">
              <div className="flex items-center gap-2 font-bold text-stone-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>PoshProtect™ Escrow Guarantee</span>
              </div>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                Full refund if the item does not match description or authenticity guidelines. Funds are released to seller only after you confirm delivery.
              </p>
              <div className="flex items-center gap-2 pt-1 text-stone-700 font-medium">
                <Truck className="w-3.5 h-3.5 text-stone-500" />
                <span>
                  USPS Priority Mail 1–3 Day Flat Rate{' '}
                  {item.discountedShipping ? (
                    <strong className="text-emerald-700">($4.99 Discounted)</strong>
                  ) : (
                    '($7.97)'
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Brand & Title */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  {item.brand}
                </p>
                <h1 className="text-xl sm:text-2xl font-bold text-stone-900 leading-tight mt-1">
                  {item.title}
                </h1>
                <div className="flex items-center gap-3 text-xs text-stone-500 mt-2">
                  <span>Size: <strong className="text-stone-900">{item.size}</strong></span>
                  <span aria-hidden="true">·</span>
                  <span>Condition: <strong className="text-stone-900">{item.condition}</strong></span>
                  <span aria-hidden="true">·</span>
                  <span>Color: <strong className="text-stone-900">{item.color}</strong></span>
                </div>
              </div>

              {/* Price Banner */}
              <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-2xl sm:text-3xl font-bold text-stone-900 tabular-nums">
                      ${item.listingPrice.toFixed(2)}
                    </span>
                    {item.originalPrice > item.listingPrice && (
                      <span className="text-sm text-stone-400 line-through tabular-nums">
                        ${item.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  {percentOff > 0 && (
                    <p className="text-xs text-emerald-700 font-semibold mt-0.5">
                      Save ${(item.originalPrice - item.listingPrice).toFixed(2)} vs original retail
                    </p>
                  )}
                </div>

                {/* Social Share & Like Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onLikeToggle(item.id)}
                    className={`p-2.5 rounded-lg border transition-colors cursor-pointer ${
                      isLiked
                        ? 'bg-rose-50 border-rose-200 text-rose-600'
                        : 'border-stone-200 hover:bg-stone-100 text-stone-600'
                    }`}
                    title="Like item"
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-600' : ''}`} />
                  </button>
                  <button
                    onClick={() => onShare(item)}
                    className="p-2.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-600 transition-colors cursor-pointer"
                    title="Share item"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Description & Item Specs */}
              <div className="space-y-3 text-xs text-stone-700">
                <div>
                  <h3 className="font-bold text-stone-900 mb-1">Item Description</h3>
                  <p className="text-stone-600 leading-relaxed">{item.description}</p>
                </div>

                {item.fabric && (
                  <div>
                    <h4 className="font-semibold text-stone-900">Fabric & Material:</h4>
                    <p className="text-stone-600">{item.fabric}</p>
                  </div>
                )}

                {item.measurements && (
                  <div>
                    <h4 className="font-semibold text-stone-900 mb-1">Measurements:</h4>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-stone-600">
                      {item.measurements.chestOrBust && (
                        <span>Chest: {item.measurements.chestOrBust}</span>
                      )}
                      {item.measurements.length && (
                        <span>Length: {item.measurements.length}</span>
                      )}
                      {item.measurements.waist && (
                        <span>Waist: {item.measurements.waist}</span>
                      )}
                      {item.measurements.inseam && (
                        <span>Inseam: {item.measurements.inseam}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Seller Closet Profile Card */}
              <div className="p-3.5 bg-stone-50 rounded-lg border border-stone-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={item.sellerAvatar}
                    alt={item.sellerName}
                    className="w-11 h-11 rounded-full object-cover border border-stone-200"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-stone-900">{item.sellerHandle}</span>
                      <span className="text-[10px] bg-stone-200 text-stone-800 font-semibold px-1.5 py-0.2 rounded">
                        {item.sellerBadges[0] || 'Top Seller'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-0.5">
                      <span className="flex items-center text-amber-600 font-semibold">
                        <Star className="w-3 h-3 fill-amber-500 mr-0.5" />
                        {item.sellerRating.toFixed(2)}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>Ships in ~{item.sellerAvgShipDays} days</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onViewCloset(item.sellerId)}
                  className="px-3 py-1.5 text-xs font-semibold text-stone-700 bg-white border border-stone-300 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                >
                  Visit Closet
                </button>
              </div>
            </div>

            {/* Sticky Action Strip */}
            <div className="space-y-2 pt-2 border-t border-stone-200">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onMakeOffer(item)}
                  className="py-2.5 px-4 text-xs font-semibold text-stone-900 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Tag className="w-3.5 h-3.5" />
                  Make an Offer
                </button>

                <button
                  onClick={handleBundleClick}
                  className="py-2.5 px-4 text-xs font-semibold text-stone-900 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  {bundleAdded ? 'Added to Bundle!' : 'Add to Bundle'}
                </button>
              </div>

              <button
                onClick={() => onBuyNow(item)}
                className="w-full py-3 px-4 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                Buy Now · ${item.listingPrice.toFixed(2)}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
