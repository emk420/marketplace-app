import React from 'react';
import { Heart, Share2, Star } from 'lucide-react';
import { Item } from '../types';
import { FashionImage } from './FashionImage';

interface ItemCardProps {
  item: Item;
  onSelect: (item: Item) => void;
  onLikeToggle: (itemId: string) => void;
  isLiked: boolean;
  onShare: (item: Item) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onSelect,
  onLikeToggle,
  isLiked,
  onShare
}) => {
  const percentOff = Math.round(
    ((item.originalPrice - item.listingPrice) / item.originalPrice) * 100
  );

  return (
    <div
      onClick={() => onSelect(item)}
      className="group bg-white rounded-xl border border-stone-200/90 overflow-hidden hover:border-stone-400 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      {/* Visual Slot */}
      <div className="relative overflow-hidden bg-stone-100">
        <FashionImage
          src={item.photos[0]}
          alt={item.title}
          brand={item.brand}
          category={item.category}
          aspectRatio="4/3"
        />

        {/* Hover / Quick Action Buttons */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onLikeToggle(item.id);
            }}
            className={`p-2 rounded-full backdrop-blur-md shadow-xs transition-colors cursor-pointer ${
              isLiked
                ? 'bg-white text-rose-600'
                : 'bg-white/90 text-stone-700 hover:bg-white hover:text-rose-600'
            }`}
            title="Like item"
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-600' : ''}`} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onShare(item);
            }}
            className="p-2 rounded-full bg-white/90 hover:bg-white text-stone-700 backdrop-blur-md shadow-xs transition-colors cursor-pointer"
            title="Share to followers or party"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quiet Discount Tag (unboxed or subtle corner flag) */}
        {percentOff > 0 && (
          <div className="absolute bottom-2.5 left-2.5 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 bg-black/75 text-white backdrop-blur-xs rounded-sm">
            {percentOff}% Off
          </div>
        )}
      </div>

      {/* Content Slot - Zero-pill metadata discipline */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Unboxed clean metadata kicker */}
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <span className="font-bold uppercase tracking-wider text-stone-800 text-[11px]">
              {item.brand}
            </span>
            <span aria-hidden="true">·</span>
            <span>Size {item.size}</span>
            <span aria-hidden="true">·</span>
            <span>{item.condition}</span>
          </div>

          <h3 className="text-sm font-semibold text-stone-900 line-clamp-1 mt-1 group-hover:text-rose-600 transition-colors">
            {item.title}
          </h3>
        </div>

        <div>
          {/* Price & Savings */}
          <div className="flex items-baseline justify-between pt-2 border-t border-stone-100">
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold text-stone-900 tabular-nums">
                ${item.listingPrice.toFixed(2)}
              </span>
              {item.originalPrice > item.listingPrice && (
                <span className="text-xs text-stone-400 line-through tabular-nums">
                  ${item.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {item.discountedShipping && (
              <span className="text-[11px] font-semibold text-emerald-700">
                $4.99 Ship
              </span>
            )}
          </div>

          {/* Quiet Seller Attribution */}
          <div className="flex items-center justify-between text-[11px] text-stone-400 pt-2 mt-1">
            <span className="truncate hover:text-stone-700 transition-colors">
              {item.sellerHandle}
            </span>
            <span className="tabular-nums">
              {item.likes} {item.likes === 1 ? 'like' : 'likes'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
