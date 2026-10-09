/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Truck,
  Sparkles,
  ArrowRight,
  Filter,
  DollarSign,
  Package,
  Heart,
  Tag,
  CheckCircle2,
  Clock,
  Layers,
  ChevronDown
} from 'lucide-react';

import { Item, Department, Order, Offer, Seller } from './types';
import {
  INITIAL_ITEMS,
  INITIAL_ORDERS,
  INITIAL_OFFERS,
  INITIAL_SELLERS,
  CURRENT_USER,
  POSH_PARTIES
} from './data/mockData';

import { Navbar } from './components/Navbar';
import { ItemCard } from './components/ItemCard';
import { ItemDetailModal } from './components/ItemDetailModal';
import { SecureCheckoutModal } from './components/SecureCheckoutModal';
import { OfferModal } from './components/OfferModal';
import { ShareModal } from './components/ShareModal';
import { ClosetViewModal } from './components/ClosetViewModal';
import { ShippingLabelModal } from './components/ShippingLabelModal';
import { SellItemModal } from './components/SellItemModal';
import { OrderManagementModal } from './components/OrderManagementModal';
import { AuthProvider, useAuth } from './context/AuthContext';
import {
  initializeMarketplaceData,
  subscribeToItems,
  saveItemToFirestore,
  updateItemInteraction,
  saveOrderToFirestore,
  updateOrderStatusInFirestore,
  saveOfferToFirestore,
  updateOfferStatusInFirestore
} from './services/marketplaceService';

function MarketplaceApp() {
  const { user, userProfile, updateBalance } = useAuth();

  // State Initialization with LocalStorage fallbacks
  const [items, setItems] = useState<Item[]>(() => {
    const saved = localStorage.getItem('posh_items');
    return saved ? JSON.parse(saved) : INITIAL_ITEMS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('posh_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [offers, setOffers] = useState<Offer[]>(() => {
    const saved = localStorage.getItem('posh_offers');
    return saved ? JSON.parse(saved) : INITIAL_OFFERS;
  });

  const [likedItemIds, setLikedItemIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('posh_likes');
    return saved ? JSON.parse(saved) : ['item_1', 'item_3'];
  });

  const [userBalance, setUserBalance] = useState<number>(() => {
    const saved = localStorage.getItem('posh_balance');
    return saved ? parseFloat(saved) : CURRENT_USER.balance;
  });

  // Sync user profile balance if logged in
  useEffect(() => {
    if (userProfile?.balance !== undefined) {
      setUserBalance(userProfile.balance);
    }
  }, [userProfile]);

  // Real-time Firestore synchronization
  useEffect(() => {
    initializeMarketplaceData().catch(console.error);

    const unsubscribe = subscribeToItems(
      (firestoreItems) => {
        if (firestoreItems && firestoreItems.length > 0) {
          setItems(firestoreItems);
        }
      },
      (err) => console.warn('Using local items cache:', err)
    );

    return () => unsubscribe();
  }, []);

  // Filter & Search States
  const [selectedDepartment, setSelectedDepartment] = useState<Department>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCondition, setSelectedCondition] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price_low' | 'price_high' | 'likes'>('featured');
  const [priceTier, setPriceTier] = useState<string>('All');

  // Modal Control States
  const [detailItem, setDetailItem] = useState<Item | null>(null);
  const [checkoutItem, setCheckoutItem] = useState<Item | null>(null);
  const [offerItem, setOfferItem] = useState<Item | null>(null);
  const [shareItem, setShareItem] = useState<Item | null>(null);
  const [closetSeller, setClosetSeller] = useState<Seller | null>(null);
  const [labelOrder, setLabelOrder] = useState<Order | null>(null);
  const [isSellOpen, setIsSellOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [ordersModalTab, setOrdersModalTab] = useState<'sales' | 'purchases' | 'offers' | 'payouts'>('sales');

  // Toast banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('posh_items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('posh_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('posh_offers', JSON.stringify(offers));
  }, [offers]);

  useEffect(() => {
    localStorage.setItem('posh_likes', JSON.stringify(likedItemIds));
  }, [likedItemIds]);

  useEffect(() => {
    localStorage.setItem('posh_balance', userBalance.toString());
  }, [userBalance]);

  // Handlers
  const handleLikeToggle = (itemId: string) => {
    setLikedItemIds((prev) => {
      const isAlreadyLiked = prev.includes(itemId);
      const next = isAlreadyLiked ? prev.filter((id) => id !== itemId) : [...prev, itemId];
      // update item like count
      setItems((prevItems) =>
        prevItems.map((it) => {
          if (it.id === itemId) {
            const updatedLikes = isAlreadyLiked ? Math.max(0, it.likes - 1) : it.likes + 1;
            updateItemInteraction(itemId, updatedLikes, it.shares).catch(console.error);
            return { ...it, likes: updatedLikes };
          }
          return it;
        })
      );
      return next;
    });
  };

  const handleOrderCompleted = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    saveOrderToFirestore(newOrder).catch(console.error);
    showToast(`Order #${newOrder.orderNumber} confirmed! Escrow authorized with USPS Priority.`);
  };

  const handleItemCreated = (newItem: Item) => {
    // Inject active user attributes if logged in
    const finalItem: Item = {
      ...newItem,
      sellerId: user?.uid || newItem.sellerId,
      sellerName: user?.displayName || userProfile?.name || newItem.sellerName,
      sellerHandle: userProfile?.handle || newItem.sellerHandle,
      sellerAvatar: user?.photoURL || userProfile?.avatar || newItem.sellerAvatar,
    };
    setItems((prev) => [finalItem, ...prev]);
    saveItemToFirestore(finalItem).catch(console.error);
    showToast(`"${finalItem.title}" is live in your closet and synced to Firestore!`);
  };

  const handleOfferSubmitted = (newOffer: Offer) => {
    const finalOffer: Offer = {
      ...newOffer,
      buyerId: user?.uid || newOffer.buyerId,
      buyerHandle: userProfile?.handle || newOffer.buyerHandle,
      buyerName: user?.displayName || userProfile?.name || newOffer.buyerName,
    };
    setOffers((prev) => [finalOffer, ...prev]);
    saveOfferToFirestore(finalOffer).catch(console.error);
    showToast(`Offer of $${finalOffer.offeredPrice} submitted to ${finalOffer.sellerHandle}!`);
  };

  const handleItemShared = (itemId: string, destination: string) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id === itemId) {
          const updatedShares = it.shares + 1;
          updateItemInteraction(itemId, it.likes, updatedShares).catch(console.error);
          return { ...it, shares: updatedShares };
        }
        return it;
      })
    );
    showToast(`Shared to ${destination}!`);
  };

  const handleMarkShipped = (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? { ...ord, status: 'Shipped / In Transit', shippedAt: 'Just now' }
          : ord
      )
    );
    updateOrderStatusInFirestore(orderId, 'Shipped / In Transit', { shippedAt: 'Just now' }).catch(console.error);
    showToast('Package marked as shipped! USPS tracking activated.');
  };

  const handleAcceptDelivery = (orderId: string, rating: number, loveNote: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status: 'Accepted & Funds Released',
            buyerRating: rating,
            buyerLoveNote: loveNote
          };
        }
        return ord;
      })
    );

    updateOrderStatusInFirestore(orderId, 'Accepted & Funds Released', {
      buyerRating: rating,
      buyerLoveNote: loveNote
    }).catch(console.error);

    // If this was a sale where current user is the seller, add to user balance
    const targetOrder = orders.find((o) => o.id === orderId);
    if (targetOrder && targetOrder.sellerId === (user?.uid || CURRENT_USER.id)) {
      const nextBal = userBalance + targetOrder.netPayoutToSeller;
      setUserBalance(nextBal);
      updateBalance(nextBal).catch(console.error);
    }

    showToast('Order accepted! Escrow funds released to seller.');
  };

  const handleAcceptOffer = (offerId: string) => {
    setOffers((prev) =>
      prev.map((off) => (off.id === offerId ? { ...off, status: 'accepted' } : off))
    );
    updateOfferStatusInFirestore(offerId, 'accepted').catch(console.error);
    showToast('Offer accepted! Buyer will be prompted to finalize.');
  };

  const handleDeclineOffer = (offerId: string) => {
    setOffers((prev) =>
      prev.map((off) => (off.id === offerId ? { ...off, status: 'declined' } : off))
    );
    updateOfferStatusInFirestore(offerId, 'declined').catch(console.error);
    showToast('Offer declined.');
  };

  const handleWithdrawFunds = (amount: number) => {
    setUserBalance(0);
    updateBalance(0).catch(console.error);
    showToast(`$${amount.toFixed(2)} transfer initiated to your verified checking account.`);
  };

  const handleOpenCloset = (sellerId: string) => {
    const s = INITIAL_SELLERS[sellerId] || {
      id: sellerId,
      handle: `@${sellerId}`,
      name: 'Poshmark Closet',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      coverGradient: 'from-stone-900 to-stone-800',
      bio: 'Curated selection of pre-loved clothing and accessories.',
      cityState: 'New York, NY',
      rating: 5.0,
      reviewCount: 42,
      salesCount: 88,
      avgShipDays: 1.2,
      ambassadorLevel: 'Posh Ambassador I',
      followersCount: 5400,
      followingCount: 300,
      bundleDiscountPercent: 10
    };
    setClosetSeller(s);
  };

  // Filter items logic
  const filteredItems = items.filter((item) => {
    if (selectedDepartment !== 'All' && item.department !== selectedDepartment) return false;
    if (selectedCondition !== 'All' && item.condition !== selectedCondition) return false;

    if (priceTier === 'under100' && item.listingPrice >= 100) return false;
    if (priceTier === '100to500' && (item.listingPrice < 100 || item.listingPrice > 500)) return false;
    if (priceTier === 'over500' && item.listingPrice <= 500) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        item.title.toLowerCase().includes(q) ||
        item.brand.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'price_low') return a.listingPrice - b.listingPrice;
    if (sortBy === 'price_high') return b.listingPrice - a.listingPrice;
    if (sortBy === 'likes') return b.likes - a.likes;
    return 0; // default featured
  });

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col selection:bg-rose-100 selection:text-rose-900">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-60 bg-stone-900 text-white px-4 py-3 rounded-lg shadow-xl border border-stone-700 text-xs flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Top Navigation */}
      <Navbar
        selectedDepartment={selectedDepartment}
        onSelectDepartment={setSelectedDepartment}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenSellModal={() => setIsSellOpen(true)}
        onOpenOrdersModal={(tab) => {
          if (tab) setOrdersModalTab(tab);
          setIsOrdersOpen(true);
        }}
        likesCount={likedItemIds.length}
        ordersCount={orders.filter((o) => o.sellerId === CURRENT_USER.id).length}
        userBalance={userBalance}
      />

      {/* Hero Showcase (Section 1 of E-Commerce reference) */}
      <section className="bg-stone-900 text-white relative overflow-hidden border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-rose-400">
              <Sparkles className="w-4 h-4" />
              <span>Second-Hand Luxury & Streetwear Exchange</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-serif-luxury leading-tight text-balance">
              Buy & sell authenticated fashion with built-in USPS shipping.
            </h1>

            <p className="text-sm sm:text-base text-stone-300 max-w-xl leading-relaxed">
              Shop pre-loved trench coats, vintage denim, and designer handbags. Sellers get 1-click printable USPS Priority shipping labels; buyers enjoy 100% escrow protection.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsSellOpen(true)}
                className="px-5 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
              >
                Start Selling in Your Closet
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setOrdersModalTab('sales');
                  setIsOrdersOpen(true);
                }}
                className="px-5 py-2.5 text-xs font-semibold text-stone-200 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Package className="w-4 h-4 text-rose-400" />
                View Shipping Labels ({orders.length})
              </button>
            </div>
          </div>

          {/* Right Hero Column: Live Posh Party Spotlight Card */}
          <div className="lg:col-span-5">
            <div className="bg-stone-800/90 rounded-xl border border-stone-700 p-5 shadow-lg space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-rose-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" />
                  Live Posh Party
                </span>
                <span className="text-stone-400 font-mono text-[11px]">14.8k pieces shared</span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white">{POSH_PARTIES[0].title}</h3>
                <p className="text-xs text-stone-300 mt-1">{POSH_PARTIES[0].theme}</p>
                <p className="text-[11px] text-stone-400 mt-0.5">{POSH_PARTIES[0].host}</p>
              </div>

              <div className="pt-2 border-t border-stone-700/80 flex items-center justify-between text-xs">
                <span className="text-stone-300 text-[11px]">{POSH_PARTIES[0].timeRemaining}</span>
                <button
                  onClick={() => {
                    const sampleItem = items[0];
                    setShareItem(sampleItem);
                  }}
                  className="px-3 py-1.5 bg-white text-stone-900 hover:bg-stone-100 font-semibold rounded text-xs transition-colors cursor-pointer"
                >
                  Share an Item to Party
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column Escrow & Shipping Trust Strip */}
        <div className="border-t border-stone-800/90 bg-stone-950/60 py-3.5 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-stone-300">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span><strong>PoshProtect™ Escrow:</strong> 100% money-back guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-rose-400 shrink-0" />
              <span><strong>USPS Priority Mail:</strong> Flat rate prepaid 1–3 day labels</span>
            </div>
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-amber-400 shrink-0" />
              <span><strong>Make an Offer:</strong> Negotiate directly with closet owners</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400 shrink-0" />
              <span><strong>Zero Listing Fees:</strong> Keep 80% on all sales</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog & Feed Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-6">
        {/* Interactive Filter Toolbar (Functional Filter Controls) */}
        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs space-y-3">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* Department selector */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 w-full md:w-auto">
              {(['All', 'Women', 'Men', 'Luxury', 'Bags', 'Vintage', 'Shoes'] as Department[]).map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDepartment(dept)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                    selectedDepartment === dept
                      ? 'bg-stone-900 text-white'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>

            {/* Right side filter dropdowns */}
            <div className="flex items-center gap-2 text-xs w-full md:w-auto justify-end flex-wrap">
              {/* Condition */}
              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                className="px-2.5 py-1.5 border border-stone-300 rounded-lg bg-white text-stone-700 cursor-pointer"
              >
                <option value="All">All Conditions</option>
                <option value="NWT (New with Tags)">NWT (With Tags)</option>
                <option value="Like New">Like New</option>
                <option value="Gently Used">Gently Used</option>
              </select>

              {/* Price Tier */}
              <select
                value={priceTier}
                onChange={(e) => setPriceTier(e.target.value)}
                className="px-2.5 py-1.5 border border-stone-300 rounded-lg bg-white text-stone-700 cursor-pointer"
              >
                <option value="All">Any Price</option>
                <option value="under100">Under $100</option>
                <option value="100to500">$100 – $500</option>
                <option value="over500">$500+ Luxury</option>
              </select>

              {/* Sort by */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-2.5 py-1.5 border border-stone-300 rounded-lg bg-white text-stone-700 cursor-pointer"
              >
                <option value="featured">Featured Listings</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="likes">Most Liked</option>
              </select>
            </div>
          </div>

          {/* Quick Active Filter Indicator */}
          <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100">
            <div>
              <span>Showing </span>
              <strong className="text-stone-900">{filteredItems.length}</strong>
              <span> listings in </span>
              <strong className="text-stone-900">{selectedDepartment}</strong>
              {searchQuery && (
                <span> for "{searchQuery}"</span>
              )}
            </div>

            {(selectedDepartment !== 'All' || selectedCondition !== 'All' || priceTier !== 'All' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedDepartment('All');
                  setSelectedCondition('All');
                  setPriceTier('All');
                  setSearchQuery('');
                }}
                className="text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
              >
                Reset All Filters
              </button>
            )}
          </div>
        </div>

        {/* Product Cards Grid (Section 2.A: 3-column / 4-column product grid with generous whitespace) */}
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-xl border border-stone-200 p-16 text-center space-y-3">
            <Package className="w-10 h-10 text-stone-300 mx-auto" />
            <h3 className="text-base font-bold text-stone-800">No listings found</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              No items match your active search and filter options. Try adjusting your criteria or list a new item!
            </p>
            <button
              onClick={() => {
                setSelectedDepartment('All');
                setSelectedCondition('All');
                setPriceTier('All');
                setSearchQuery('');
              }}
              className="mt-2 px-4 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onSelect={(it) => setDetailItem(it)}
                onLikeToggle={handleLikeToggle}
                isLiked={likedItemIds.includes(item.id)}
                onShare={(it) => setShareItem(it)}
              />
            ))}
          </div>
        )}

        {/* Featured Closets Showcase (Social Marketplace hallmark) */}
        <div className="pt-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-stone-900">Top Rated Posh Closets</h2>
              <p className="text-xs text-stone-500">Verified Ambassador sellers with 1.1-day average shipping</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.values(INITIAL_SELLERS).map((seller) => (
              <div
                key={seller.id}
                className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between hover:border-stone-400 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <img
                      src={seller.avatar}
                      alt={seller.name}
                      className="w-12 h-12 rounded-full object-cover border border-stone-200"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-stone-900">{seller.name}</h4>
                      <p className="text-[11px] text-stone-500">{seller.handle}</p>
                      <span className="text-[10px] text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded font-semibold mt-0.5 inline-block">
                        {seller.ambassadorLevel}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 line-clamp-2 mt-3 leading-relaxed">
                    {seller.bio}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-stone-500 mt-3 pt-3 border-t border-stone-100">
                    <span>{seller.rating.toFixed(2)} ★ ({seller.reviewCount})</span>
                    <span aria-hidden="true">·</span>
                    <span>{seller.salesCount} Sales</span>
                    <span aria-hidden="true">·</span>
                    <span>{seller.bundleDiscountPercent}% Bundle Off</span>
                  </div>
                </div>

                <div className="mt-4 pt-2">
                  <button
                    onClick={() => handleOpenCloset(seller.id)}
                    className="w-full py-2 text-xs font-semibold text-stone-700 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg transition-colors cursor-pointer text-center"
                  >
                    Explore {seller.name.split(' ')[0]}'s Closet
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Quiet Footer */}
      <footer className="mt-16 border-t border-stone-200 bg-white py-8 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif-luxury font-bold text-stone-900">POSHPOP</span>
            <span aria-hidden="true">·</span>
            <span>Second-Hand Fashion & Curated Closets</span>
          </div>

          <div className="flex items-center gap-6">
            <span>Escrow Protected</span>
            <span aria-hidden="true">·</span>
            <span>USPS Priority Commercial</span>
            <span aria-hidden="true">·</span>
            <span>Zero Listing Fees</span>
          </div>
        </div>
      </footer>

      {/* ALL MODAL WORKFLOWS */}

      {/* 1. PDP Item Detail Modal */}
      {detailItem && (
        <ItemDetailModal
          item={detailItem}
          isOpen={!!detailItem}
          onClose={() => setDetailItem(null)}
          onBuyNow={(it) => {
            setDetailItem(null);
            setCheckoutItem(it);
          }}
          onMakeOffer={(it) => {
            setDetailItem(null);
            setOfferItem(it);
          }}
          onShare={(it) => setShareItem(it)}
          onLikeToggle={handleLikeToggle}
          isLiked={likedItemIds.includes(detailItem.id)}
          onViewCloset={(sellerId) => {
            setDetailItem(null);
            handleOpenCloset(sellerId);
          }}
          onAddToBundle={(it) => {
            showToast(`"${it.title}" added to your closet bundle!`);
          }}
        />
      )}

      {/* 2. Secure Escrow Checkout Modal */}
      {checkoutItem && (
        <SecureCheckoutModal
          item={checkoutItem}
          isOpen={!!checkoutItem}
          onClose={() => setCheckoutItem(null)}
          onOrderCompleted={handleOrderCompleted}
        />
      )}

      {/* 3. Make an Offer Modal */}
      {offerItem && (
        <OfferModal
          item={offerItem}
          isOpen={!!offerItem}
          onClose={() => setOfferItem(null)}
          onOfferSubmitted={handleOfferSubmitted}
        />
      )}

      {/* 4. Social Share & Posh Party Modal */}
      {shareItem && (
        <ShareModal
          item={shareItem}
          isOpen={!!shareItem}
          onClose={() => setShareItem(null)}
          onItemShared={handleItemShared}
        />
      )}

      {/* 5. Closet Showcase Modal */}
      {closetSeller && (
        <ClosetViewModal
          seller={closetSeller}
          items={items.filter((it) => it.sellerId === closetSeller.id)}
          isOpen={!!closetSeller}
          onClose={() => setClosetSeller(null)}
          onSelectItem={(it) => setDetailItem(it)}
          onLikeToggle={handleLikeToggle}
          likedItemIds={likedItemIds}
        />
      )}

      {/* 6. Built-in USPS Priority Shipping Label Generator Modal */}
      {labelOrder && (
        <ShippingLabelModal
          order={labelOrder}
          isOpen={!!labelOrder}
          onClose={() => setLabelOrder(null)}
          onMarkShipped={handleMarkShipped}
        />
      )}

      {/* 7. Sell Item / Closet Lister Tool */}
      {isSellOpen && (
        <SellItemModal
          isOpen={isSellOpen}
          onClose={() => setIsSellOpen(false)}
          onItemCreated={handleItemCreated}
        />
      )}

      {/* 8. Order Management, Shipping Labels & Payout Ledger */}
      {isOrdersOpen && (
        <OrderManagementModal
          orders={orders}
          offers={offers}
          isOpen={isOrdersOpen}
          onClose={() => setIsOrdersOpen(false)}
          onOpenShippingLabel={(ord) => {
            setLabelOrder(ord);
          }}
          onAcceptOrderDelivery={handleAcceptDelivery}
          onAcceptOffer={handleAcceptOffer}
          onDeclineOffer={handleDeclineOffer}
          userBalance={userBalance}
          onWithdrawFunds={handleWithdrawFunds}
          initialTab={ordersModalTab}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MarketplaceApp />
    </AuthProvider>
  );
}
