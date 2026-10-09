import React, { useState } from 'react';
import { Star, Truck, ShieldCheck, Heart, UserPlus, Check, X, Tag, Package, ShoppingBag } from 'lucide-react';
import { Seller, Item } from '../types';
import { FashionImage } from './FashionImage';

interface ClosetViewModalProps {
  seller: Seller;
  items: Item[];
  isOpen: boolean;
  onClose: () => void;
  onSelectItem: (item: Item) => void;
  onLikeToggle: (itemId: string) => void;
  likedItemIds: string[];
}

export const ClosetViewModal: React.FC<ClosetViewModalProps> = ({
  seller,
  items,
  isOpen,
  onClose,
  onSelectItem,
  onLikeToggle,
  likedItemIds
}) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!isOpen) return null;

  const categories = ['All', ...Array.from(new Set(items.map((it) => it.category)))];
  const filteredItems =
    selectedCategory === 'All'
      ? items
      : items.filter((it) => it.category === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white w-full max-w-5xl rounded-xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[94vh]">
        {/* Cover Banner Header */}
        <div className={`relative h-36 sm:h-44 bg-gradient-to-r ${seller.coverGradient} p-6 flex flex-col justify-between`}>
          <button
            onClick={onClose}
            className="self-end p-1.5 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors cursor-pointer"
            aria-label="Close closet"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-end justify-between">
            <div className="flex items-center gap-4">
              <img
                src={seller.avatar}
                alt={seller.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-white shadow-md -mb-8 sm:-mb-10 bg-white"
              />
              <div className="text-white drop-shadow-xs">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-bold">{seller.name}</h2>
                  <span className="text-[10px] bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded font-semibold">
                    {seller.ambassadorLevel}
                  </span>
                </div>
                <p className="text-xs text-stone-200">{seller.handle} · {seller.cityState}</p>
              </div>
            </div>

            <button
              onClick={() => setIsFollowing(!isFollowing)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer ${
                isFollowing
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-stone-900 hover:bg-stone-100'
              }`}
            >
              {isFollowing ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Following Closet
                </>
              ) : (
                <>
                  <UserPlus className="w-3.5 h-3.5" />
                  Follow Closet
                </>
              )}
            </button>
          </div>
        </div>

        {/* Bio & Seller Stats Strip */}
        <div className="pt-10 sm:pt-12 px-6 pb-4 border-b border-stone-200 bg-stone-50 space-y-3">
          <p className="text-xs text-stone-600 max-w-2xl">{seller.bio}</p>

          <div className="flex flex-wrap items-center gap-6 text-xs text-stone-600 pt-1">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
              <span className="font-bold text-stone-900">{seller.rating.toFixed(2)}</span>
              <span className="text-stone-400">({seller.reviewCount} reviews)</span>
            </div>
            <div className="flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-stone-500" />
              <span>Avg. Ship Speed: <strong className="text-stone-900">{seller.avgShipDays} days</strong></span>
            </div>
            <div>
              <span>Listings: <strong className="text-stone-900">{items.length}</strong></span>
            </div>
            <div>
              <span>Sales: <strong className="text-stone-900">{seller.salesCount}</strong></span>
            </div>
            <div>
              <span>Followers: <strong className="text-stone-900">{(seller.followersCount / 1000).toFixed(1)}k</strong></span>
            </div>
          </div>

          {/* Bundle promotion banner */}
          <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-lg flex items-center justify-between text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-amber-700" />
              <span>
                <strong>Closet Bundle Discount:</strong> Add 2 or more items from {seller.name}'s closet and automatically receive <strong>{seller.bundleDiscountPercent}% off</strong> at checkout!
              </span>
            </div>
          </div>
        </div>

        {/* Category filter tabs */}
        <div className="px-6 py-2.5 border-b border-stone-200 bg-white flex items-center gap-2 overflow-x-auto text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Closet Product Grid */}
        <div className="overflow-y-auto p-6 flex-1 bg-stone-100">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 text-stone-500 text-xs">
              No items in this category currently.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredItems.map((item) => {
                const isLiked = likedItemIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => onSelectItem(item)}
                    className="bg-white rounded-lg border border-stone-200 overflow-hidden hover:border-stone-400 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div className="relative">
                      <FashionImage
                        src={item.photos[0]}
                        alt={item.title}
                        brand={item.brand}
                        aspectRatio="4/3"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onLikeToggle(item.id);
                        }}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 backdrop-blur-xs text-stone-600 hover:text-rose-600 shadow-2xs transition-colors"
                      >
                        <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
                      </button>
                    </div>

                    <div className="p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 truncate">
                        {item.brand}
                      </p>
                      <h3 className="text-xs font-semibold text-stone-900 truncate mt-0.5 group-hover:text-rose-700 transition-colors">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mt-1">
                        <span>Size {item.size}</span>
                        <span aria-hidden="true">·</span>
                        <span>{item.condition}</span>
                      </div>
                      <div className="flex items-baseline justify-between mt-2 pt-2 border-t border-stone-100">
                        <span className="text-sm font-bold text-stone-900 tabular-nums">
                          ${item.listingPrice}
                        </span>
                        {item.originalPrice > item.listingPrice && (
                          <span className="text-[10px] text-stone-400 line-through tabular-nums">
                            ${item.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
