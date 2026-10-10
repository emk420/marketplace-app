import React, { useState } from 'react';
import {
  Package,
  Printer,
  Truck,
  CheckCircle2,
  Clock,
  ArrowRight,
  DollarSign,
  Star,
  X,
  ShieldCheck,
  Tag,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { Order, Offer, OrderStatus } from '../types';
import { CURRENT_USER } from '../data/mockData';
import { FashionImage } from './FashionImage';

interface OrderManagementModalProps {
  orders: Order[];
  offers: Offer[];
  isOpen: boolean;
  onClose: () => void;
  onOpenShippingLabel: (order: Order) => void;
  onAcceptOrderDelivery: (orderId: string, rating: number, loveNote: string) => void;
  onAcceptOffer: (offerId: string) => void;
  onDeclineOffer: (offerId: string) => void;
  userBalance: number;
  onWithdrawFunds: (amount: number) => void;
  initialTab?: 'sales' | 'purchases' | 'offers' | 'payouts';
}

export const OrderManagementModal: React.FC<OrderManagementModalProps> = ({
  orders,
  offers,
  isOpen,
  onClose,
  onOpenShippingLabel,
  onAcceptOrderDelivery,
  onAcceptOffer,
  onDeclineOffer,
  userBalance,
  onWithdrawFunds,
  initialTab = 'sales'
}) => {
  const [activeTab, setActiveTab] = useState<'sales' | 'purchases' | 'offers' | 'payouts'>(initialTab);
  const [ratingModalOrderId, setRatingModalOrderId] = useState<string | null>(null);
  const [selectedRating, setSelectedRating] = useState(5);
  const [loveNote, setLoveNote] = useState('');
  const [payoutRequested, setPayoutRequested] = useState(false);

  if (!isOpen) return null;

  const salesOrders = orders.filter((o) => o.sellerId === CURRENT_USER.id);
  const purchaseOrders = orders.filter((o) => o.buyerId === CURRENT_USER.id);

  const handleRatingSubmit = (orderId: string) => {
    onAcceptOrderDelivery(orderId, selectedRating, loveNote);
    setRatingModalOrderId(null);
    setLoveNote('');
  };

  const handlePayoutSubmit = () => {
    if (userBalance <= 0) return;
    onWithdrawFunds(userBalance);
    setPayoutRequested(true);
    setTimeout(() => setPayoutRequested(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header with Navigation Tabs */}
        <div className="px-6 py-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-stone-900">Orders, Shipping & Payouts</h2>
            <p className="text-xs text-stone-500">
              Manage USPS shipping labels, active negotiations, and escrow balances
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 bg-white px-6 gap-6 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('sales')}
            className={`py-3.5 border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'sales'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Package className="w-4 h-4" />
            My Sales ({salesOrders.length})
          </button>

          <button
            onClick={() => setActiveTab('purchases')}
            className={`py-3.5 border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'purchases'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Truck className="w-4 h-4" />
            My Purchases ({purchaseOrders.length})
          </button>

          <button
            onClick={() => setActiveTab('offers')}
            className={`py-3.5 border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'offers'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Tag className="w-4 h-4" />
            Offers & Counter-Offers ({offers.length})
          </button>

          <button
            onClick={() => setActiveTab('payouts')}
            className={`py-3.5 border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'payouts'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            Payout Ledger (${userBalance.toFixed(2)})
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-6 flex-1 bg-stone-100 space-y-4">
          {/* TAB 1: MY SALES (SELLER VIEW) */}
          {activeTab === 'sales' && (
            <div className="space-y-4">
              {salesOrders.length === 0 ? (
                <div className="bg-white rounded-lg p-10 text-center border border-stone-200">
                  <Package className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-stone-800">No sales yet</p>
                  <p className="text-xs text-stone-500 mt-1">
                    When buyers purchase your listings, your prepaid shipping labels will appear here!
                  </p>
                </div>
              ) : (
                salesOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3 text-xs">
                      <div>
                        <span className="font-bold text-stone-900">Order #{order.orderNumber}</span>
                        <span className="text-stone-400 mx-2">·</span>
                        <span className="text-stone-500">{order.createdAt}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-stone-500">Buyer:</span>
                        <span className="font-semibold text-stone-800">{order.buyerHandle}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            order.status === 'Payment Authorized'
                              ? 'bg-amber-100 text-amber-800'
                              : order.status === 'Shipped / In Transit'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-stone-200">
                        <FashionImage
                          src={order.itemPhoto}
                          alt={order.itemTitle}
                          brand={order.itemBrand}
                          aspectRatio="square"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                          {order.itemBrand}
                        </span>
                        <h4 className="text-sm font-bold text-stone-900 truncate">{order.itemTitle}</h4>
                        <p className="text-xs text-stone-500 mt-0.5">
                          Size {order.itemSize} · Sold for ${order.itemPrice.toFixed(2)}
                        </p>
                        <div className="text-xs text-emerald-700 font-semibold mt-1">
                          Net Earnings to You: ${order.netPayoutToSeller.toFixed(2)} (Held in Escrow)
                        </div>
                      </div>
                    </div>

                    {/* Shipping Action Box */}
                    <div className="bg-stone-50 rounded-lg p-3.5 border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                      <div className="space-y-0.5">
                        <div className="font-semibold text-stone-900 flex items-center gap-1.5">
                          <Truck className="w-3.5 h-3.5 text-stone-600" />
                          <span>USPS Priority Mail Tracking: </span>
                          <span className="font-mono text-stone-700">{order.trackingNumber}</span>
                        </div>
                        <p className="text-[11px] text-stone-500">
                          Ship to: {order.buyerAddress.fullName}, {order.buyerAddress.city}, {order.buyerAddress.state} {order.buyerAddress.zipCode}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                        <button
                          onClick={() => onOpenShippingLabel(order)}
                          className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          Generate Shipping Label
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: MY PURCHASES (BUYER VIEW) */}
          {activeTab === 'purchases' && (
            <div className="space-y-4">
              {purchaseOrders.length === 0 ? (
                <div className="bg-white rounded-lg p-10 text-center border border-stone-200">
                  <Truck className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-stone-800">No purchases yet</p>
                  <p className="text-xs text-stone-500 mt-1">
                    Find high-end vintage and designer clothing on the feed and check out with Escrow!
                  </p>
                </div>
              ) : (
                purchaseOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3 text-xs">
                      <div>
                        <span className="font-bold text-stone-900">Order #{order.orderNumber}</span>
                        <span className="text-stone-400 mx-2">·</span>
                        <span className="text-stone-500">{order.createdAt}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-stone-500">Seller:</span>
                        <span className="font-semibold text-stone-800">{order.sellerHandle}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            order.status === 'Accepted & Funds Released'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-stone-200">
                        <FashionImage
                          src={order.itemPhoto}
                          alt={order.itemTitle}
                          brand={order.itemBrand}
                          aspectRatio="square"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                          {order.itemBrand}
                        </span>
                        <h4 className="text-sm font-bold text-stone-900 truncate">{order.itemTitle}</h4>
                        <p className="text-xs text-stone-500 mt-0.5">
                          Paid: ${order.totalAmount.toFixed(2)} via {order.paymentMethod}
                        </p>
                        {order.stripePaymentIntentId && (
                          <p className="text-[10px] text-emerald-700 font-mono mt-0.5">
                            Stripe Intent: {order.stripePaymentIntentId}
                          </p>
                        )}
                        <p className="text-xs text-stone-600 mt-1 font-mono">
                          USPS Priority Track #{order.trackingNumber}
                        </p>
                      </div>
                    </div>

                    {/* Escrow Release & Acceptance */}
                    <div className="bg-stone-50 rounded-lg p-3.5 border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-start gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-stone-900">
                            PoshProtect™ Escrow Inspection Window
                          </span>
                          <p className="text-[11px] text-stone-500">
                            {order.status === 'Accepted & Funds Released'
                              ? 'You approved this order and funds have been released to the seller.'
                              : 'Package delivered or in transit. Inspect the garment to ensure it matches description.'}
                          </p>
                        </div>
                      </div>

                      {order.status !== 'Accepted & Funds Released' && (
                        <button
                          onClick={() => setRatingModalOrderId(order.id)}
                          className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Accept Order & Release Funds
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: OFFERS (NEGOTIATIONS) */}
          {activeTab === 'offers' && (
            <div className="space-y-4">
              {offers.length === 0 ? (
                <div className="bg-white rounded-lg p-10 text-center border border-stone-200">
                  <Tag className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-stone-800">No active offers</p>
                  <p className="text-xs text-stone-500 mt-1">
                    When you make or receive an offer on a clothing listing, you can negotiate here.
                  </p>
                </div>
              ) : (
                offers.map((offer) => (
                  <div
                    key={offer.id}
                    className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-stone-200">
                        <FashionImage
                          src={offer.itemPhoto}
                          alt={offer.itemTitle}
                          brand={offer.itemBrand}
                          aspectRatio="square"
                        />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                          {offer.itemBrand}
                        </div>
                        <h4 className="text-xs font-bold text-stone-900 truncate max-w-xs">
                          {offer.itemTitle}
                        </h4>
                        <div className="text-xs text-stone-500 mt-0.5">
                          Listing: <span className="line-through">${offer.originalListingPrice}</span>{' '}
                          · Offer: <span className="font-bold text-stone-900">${offer.offeredPrice}</span>
                        </div>
                        <div className="text-[11px] text-stone-400 mt-0.5">
                          From {offer.buyerHandle} · Expires in {offer.expiresAt}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      {offer.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => onDeclineOffer(offer.id)}
                            className="flex-1 sm:flex-none px-3 py-1.5 text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
                          >
                            Decline
                          </button>
                          <button
                            onClick={() => onAcceptOffer(offer.id)}
                            className="flex-1 sm:flex-none px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors cursor-pointer"
                          >
                            Accept Offer (${offer.offeredPrice})
                          </button>
                        </>
                      ) : (
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-md">
                          Offer {offer.status.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 4: PAYOUTS & BALANCE */}
          {activeTab === 'payouts' && (
            <div className="space-y-6">
              {/* Balance card */}
              <div className="bg-stone-900 text-white rounded-xl p-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-stone-400 uppercase tracking-wider font-semibold">
                    Redeemable Seller Balance
                  </div>
                  <div className="text-3xl font-bold mt-1 tabular-nums">
                    ${userBalance.toFixed(2)}
                  </div>
                  <div className="text-xs text-stone-400 mt-1">
                    Available for ACH Bank Direct Deposit or instant spending on Poshmark
                  </div>
                </div>

                <button
                  onClick={handlePayoutSubmit}
                  disabled={userBalance <= 0}
                  className="px-5 py-2.5 text-xs font-bold bg-white text-stone-900 hover:bg-stone-100 disabled:bg-stone-700 disabled:text-stone-400 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <DollarSign className="w-4 h-4" />
                  Transfer to Bank Account
                </button>
              </div>

              {payoutRequested && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Direct Deposit payout requested! Funds will arrive in your checking account (ending in 8841) within 1-2 business days.
                  </span>
                </div>
              )}

              {/* Fee and Escrow Policies */}
              <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-3 text-xs text-stone-600">
                <h4 className="font-bold text-stone-900 text-sm">How Seller Payouts Work</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-200/80">
                    <span className="font-semibold text-stone-900 block mb-1">
                      Transparent 20% Fee Structure
                    </span>
                    <p className="text-stone-500">
                      We charge 0 listing fees. When you make a sale over $15, Poshmark keeps 20% to cover credit card fees, customer support, and buyer escrow guarantees.
                    </p>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-200/80">
                    <span className="font-semibold text-stone-900 block mb-1">
                      72-Hour Escrow Release
                    </span>
                    <p className="text-stone-500">
                      Once USPS marks your package as delivered, the buyer has 72 hours to inspect. If they accept or the time expires, funds release directly to your balance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RATING & LOVE NOTE POPUP */}
      {ratingModalOrderId && (
        <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-base text-stone-900">
              Rate Your Purchase & Release Funds
            </h3>
            <p className="text-xs text-stone-500">
              Your feedback is shared with the seller closet and helps the community.
            </p>

            <div className="flex justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setSelectedRating(star)}
                  className="p-1 cursor-pointer"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= selectedRating
                        ? 'fill-amber-400 text-amber-500'
                        : 'text-stone-300'
                    }`}
                  />
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              value={loveNote}
              onChange={(e) => setLoveNote(e.target.value)}
              placeholder="Leave a Love Note for the seller (e.g. 'Arrived quickly, packaged so beautifully, exactly as described!')..."
              className="w-full text-xs p-3 border border-stone-300 rounded-lg"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRatingModalOrderId(null)}
                className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRatingSubmit(ratingModalOrderId)}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg cursor-pointer"
              >
                Submit Love Note & Release Funds
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
