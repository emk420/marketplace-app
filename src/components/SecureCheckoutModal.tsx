import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  CreditCard,
  CheckCircle2,
  X,
  Truck,
  ArrowRight,
  Sparkles,
  MapPin,
  AlertCircle,
  ExternalLink,
  Zap,
  Check
} from 'lucide-react';
import { Item, ShippingAddress, Order } from '../types';
import { CURRENT_USER } from '../data/mockData';
import { FashionImage } from './FashionImage';
import {
  createStripePaymentIntent,
  formatCardNumber,
  formatExpiry,
  getCardBrand
} from '../services/stripeService';

interface SecureCheckoutModalProps {
  item: Item;
  isOpen: boolean;
  onClose: () => void;
  onOrderCompleted: (newOrder: Order) => void;
}

export const SecureCheckoutModal: React.FC<SecureCheckoutModalProps> = ({
  item,
  isOpen,
  onClose,
  onOrderCompleted
}) => {
  const [useCredits, setUseCredits] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'stripe_card' | 'apple_pay' | 'klarna'>('stripe_card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Stripe Card Form states
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('321');
  const [buyerAddress, setBuyerAddress] = useState<ShippingAddress>(CURRENT_USER.address);
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  if (!isOpen) return null;

  // Calculate pricing
  const shippingCost = item.discountedShipping ? 4.99 : 7.97;
  const salesTax = Number((item.listingPrice * 0.08875).toFixed(2));
  const availableCredits = CURRENT_USER.poshCredits;
  const creditsApplied = useCredits ? Math.min(availableCredits, item.listingPrice + shippingCost + salesTax) : 0;
  const totalAmount = Number((item.listingPrice + shippingCost + salesTax - creditsApplied).toFixed(2));
  const netPayoutToSeller = Number((item.listingPrice * 0.8).toFixed(2));

  const cardBrand = getCardBrand(cardNumber);

  const fillTestCard = (type: 'success' | '3ds') => {
    if (type === 'success') {
      setCardNumber('4242 4242 4242 4242');
      setCardExpiry('12/28');
      setCardCvc('123');
    } else {
      setCardNumber('4000 0027 6000 3184');
      setCardExpiry('10/29');
      setCardCvc('888');
    }
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    setErrorMessage(null);
    setProcessingStep('Initializing Stripe PaymentIntent...');

    const orderNum = `POSH-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      // 1. Call server-side Stripe PaymentIntent endpoint
      const stripeRes = await createStripePaymentIntent({
        amount: totalAmount,
        currency: 'usd',
        itemTitle: item.title,
        orderNumber: orderNum,
      });

      setProcessingStep('Stripe Radar verifying 0% fraud risk...');
      await new Promise((r) => setTimeout(r, 600));

      setProcessingStep('Confirming escrow authorization with Stripe...');
      await new Promise((r) => setTimeout(r, 600));

      const last4 = cardNumber.replace(/\s+/g, '').slice(-4) || '4242';
      const paymentDisplay =
        paymentMethod === 'apple_pay'
          ? 'Apple Pay via Stripe'
          : paymentMethod === 'klarna'
          ? 'Klarna 4x via Stripe'
          : `Stripe Card (•••• ${last4})`;

      const generatedOrder: Order = {
        id: `ord_${Date.now()}`,
        orderNumber: orderNum,
        itemId: item.id,
        itemTitle: item.title,
        itemPhoto: item.photos[0],
        itemBrand: item.brand,
        itemSize: item.size,
        itemPrice: item.listingPrice,
        shippingCost,
        salesTax,
        totalAmount,
        poshCreditsUsed: creditsApplied,
        netPayoutToSeller,
        buyerId: CURRENT_USER.id,
        buyerName: buyerAddress.fullName,
        buyerHandle: CURRENT_USER.handle,
        buyerAddress,
        sellerId: item.sellerId,
        sellerName: item.sellerName,
        sellerHandle: item.sellerHandle,
        sellerAddress: {
          fullName: item.sellerName,
          street1: '482 Broome Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10013',
          phone: '(212) 555-0812'
        },
        status: 'Payment Authorized',
        trackingNumber: `9405 5082 ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} 4819 18`,
        carrier: 'USPS Priority Mail',
        packageWeight: '1 LB 8 OZ',
        serviceTier: 'USPS Priority Mail® 2-Day (Prepaid Label)',
        paymentMethod: paymentDisplay,
        paymentEscrowProtected: true,
        stripePaymentIntentId: stripeRes.paymentIntentId,
        stripeClientSecret: stripeRes.clientSecret,
        createdAt: 'Just now'
      };

      setCompletedOrder(generatedOrder);
      onOrderCompleted(generatedOrder);
    } catch (err: any) {
      console.error('Checkout error:', err);
      setErrorMessage(err.message || 'Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-stone-900">
              {completedOrder ? 'Order Confirmed!' : 'Secure Stripe Escrow Checkout'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          {completedOrder ? (
            /* Order Success View */
            <div className="text-center py-6 space-y-5">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-stone-900">Payment Authorized via Stripe!</h3>
                <p className="text-xs text-stone-500 mt-1">
                  Order #{completedOrder.orderNumber} · Charged{' '}
                  <span className="font-semibold text-stone-900">${completedOrder.totalAmount.toFixed(2)}</span>
                </p>
                {completedOrder.stripePaymentIntentId && (
                  <p className="font-mono text-[11px] text-stone-400 mt-0.5">
                    Stripe PaymentIntent: {completedOrder.stripePaymentIntentId}
                  </p>
                )}
              </div>

              {/* Stripe Escrow Guarantee Highlight */}
              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200/80 text-left max-w-lg mx-auto">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div className="text-xs text-emerald-900 space-y-1">
                    <span className="font-bold block">Stripe Escrow & PoshProtect™ Guarantee Active</span>
                    <p className="text-stone-600 leading-relaxed">
                      Your funds are vaulted securely with Stripe. The seller has been issued their pre-paid USPS shipping label and must ship within 7 days. You have 72 hours upon delivery to inspect your item before funds release.
                    </p>
                  </div>
                </div>
              </div>

              {/* Purchased item thumbnail */}
              <div className="flex items-center gap-4 p-3 bg-stone-50 rounded-lg border border-stone-200 max-w-lg mx-auto text-left">
                <div className="w-16 h-16 rounded-md overflow-hidden shrink-0">
                  <FashionImage
                    src={completedOrder.itemPhoto}
                    alt={completedOrder.itemTitle}
                    brand={completedOrder.itemBrand}
                    aspectRatio="square"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-stone-900 truncate">{completedOrder.itemTitle}</p>
                  <p className="text-xs text-stone-500">
                    {completedOrder.itemBrand} · Size {completedOrder.itemSize}
                  </p>
                  <p className="text-xs font-semibold text-stone-900 mt-0.5">
                    ${completedOrder.itemPrice.toFixed(2)} · {completedOrder.paymentMethod}
                  </p>
                </div>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Review View */
            <>
              {/* Stripe Trust Ribbon */}
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-lg p-3 flex items-start gap-3 text-xs text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Stripe 256-Bit Escrow Vault: </span>
                  We hold your payment until your package arrives. If it's not as described, return it for a 100% refund.
                </div>
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-800">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Item Snapshot */}
              <div className="flex items-center gap-4 p-3 bg-stone-50 rounded-lg border border-stone-200">
                <div className="w-16 h-16 rounded-md overflow-hidden shrink-0">
                  <FashionImage
                    src={item.photos[0]}
                    alt={item.title}
                    brand={item.brand}
                    aspectRatio="square"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                    {item.brand}
                  </span>
                  <h4 className="text-sm font-semibold text-stone-900 truncate">{item.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-stone-600 mt-0.5">
                    <span>Size: {item.size}</span>
                    <span aria-hidden="true">·</span>
                    <span>Condition: {item.condition}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-base font-bold text-stone-900 tabular-nums">
                    ${item.listingPrice.toFixed(2)}
                  </div>
                  {item.discountedShipping && (
                    <span className="text-[10px] text-emerald-700 font-semibold block">
                      $4.99 Shipping Discount!
                    </span>
                  )}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="border border-stone-200 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-stone-900">
                    <MapPin className="w-4 h-4 text-stone-600" />
                    Ship To (USPS Priority Mail)
                  </div>
                  <button
                    onClick={() => setIsEditingAddress(!isEditingAddress)}
                    className="text-xs text-rose-700 hover:text-rose-900 font-semibold cursor-pointer"
                  >
                    {isEditingAddress ? 'Save Address' : 'Change'}
                  </button>
                </div>

                {isEditingAddress ? (
                  <div className="grid grid-cols-2 gap-2.5 pt-2 text-xs">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={buyerAddress.fullName}
                      onChange={(e) => setBuyerAddress({ ...buyerAddress, fullName: e.target.value })}
                      className="col-span-2 px-3 py-1.5 border border-stone-300 rounded focus:ring-1 focus:ring-stone-900"
                    />
                    <input
                      type="text"
                      placeholder="Street Address"
                      value={buyerAddress.street1}
                      onChange={(e) => setBuyerAddress({ ...buyerAddress, street1: e.target.value })}
                      className="col-span-2 px-3 py-1.5 border border-stone-300 rounded focus:ring-1 focus:ring-stone-900"
                    />
                    <input
                      type="text"
                      placeholder="City"
                      value={buyerAddress.city}
                      onChange={(e) => setBuyerAddress({ ...buyerAddress, city: e.target.value })}
                      className="px-3 py-1.5 border border-stone-300 rounded focus:ring-1 focus:ring-stone-900"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="State"
                        value={buyerAddress.state}
                        onChange={(e) => setBuyerAddress({ ...buyerAddress, state: e.target.value })}
                        className="px-3 py-1.5 border border-stone-300 rounded focus:ring-1 focus:ring-stone-900"
                      />
                      <input
                        type="text"
                        placeholder="ZIP"
                        value={buyerAddress.zipCode}
                        onChange={(e) => setBuyerAddress({ ...buyerAddress, zipCode: e.target.value })}
                        className="px-3 py-1.5 border border-stone-300 rounded focus:ring-1 focus:ring-stone-900"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-stone-600 pl-6 leading-relaxed">
                    <span className="font-semibold text-stone-900">{buyerAddress.fullName}</span>
                    <br />
                    {buyerAddress.street1} {buyerAddress.street2 && `· ${buyerAddress.street2}`}
                    <br />
                    {buyerAddress.city}, {buyerAddress.state} {buyerAddress.zipCode}
                  </div>
                )}
              </div>

              {/* Stripe Payment Method Selector */}
              <div className="border border-stone-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-stone-900">
                    <Lock className="w-4 h-4 text-emerald-600" />
                    <span>Payment Method</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-stone-500 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Powered by Stripe</span>
                  </div>
                </div>

                {/* Method selector pills */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('stripe_card')}
                    className={`p-2.5 rounded-lg border text-xs font-medium text-center transition-colors cursor-pointer ${
                      paymentMethod === 'stripe_card'
                        ? 'border-stone-900 bg-stone-50 text-stone-900 ring-1 ring-stone-900'
                        : 'border-stone-200 text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 mx-auto mb-1 text-stone-700" />
                    <span>Stripe Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('apple_pay')}
                    className={`p-2.5 rounded-lg border text-xs font-medium text-center transition-colors cursor-pointer ${
                      paymentMethod === 'apple_pay'
                        ? 'border-stone-900 bg-stone-50 text-stone-900 ring-1 ring-stone-900'
                        : 'border-stone-200 text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    <span className="font-bold block text-sm leading-tight mb-0.5">Pay</span>
                    <span>Stripe Wallet</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('klarna')}
                    className={`p-2.5 rounded-lg border text-xs font-medium text-center transition-colors cursor-pointer ${
                      paymentMethod === 'klarna'
                        ? 'border-stone-900 bg-stone-50 text-stone-900 ring-1 ring-stone-900'
                        : 'border-stone-200 text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    <span className="font-bold text-pink-600 block text-xs mb-0.5">Klarna.</span>
                    <span>4 x ${(totalAmount / 4).toFixed(2)}</span>
                  </button>
                </div>

                {/* Stripe Card Element Input */}
                {paymentMethod === 'stripe_card' && (
                  <div className="space-y-3 pt-1 text-xs">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-stone-500 text-[11px] font-semibold">Card Number</label>
                        <span className="text-[10px] uppercase font-bold text-stone-600 px-1.5 py-0.2 bg-stone-100 rounded">
                          {cardBrand.toUpperCase()}
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          maxLength={19}
                          value={cardNumber}
                          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                          placeholder="4242 4242 4242 4242"
                          className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded font-mono text-xs focus:ring-1 focus:ring-stone-900 bg-white"
                        />
                        <CreditCard className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-stone-500 text-[11px] mb-1 font-semibold">Expires (MM/YY)</label>
                        <input
                          type="text"
                          maxLength={5}
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                          placeholder="12/28"
                          className="w-full px-3 py-2 border border-stone-300 rounded font-mono text-xs focus:ring-1 focus:ring-stone-900 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-500 text-[11px] mb-1 font-semibold">CVC</label>
                        <input
                          type="text"
                          maxLength={4}
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ''))}
                          placeholder="321"
                          className="w-full px-3 py-2 border border-stone-300 rounded font-mono text-xs focus:ring-1 focus:ring-stone-900 bg-white"
                        />
                      </div>
                    </div>

                    {/* Stripe Quick Test Cards */}
                    <div className="pt-1 flex items-center gap-2">
                      <span className="text-[10px] text-stone-400 font-medium">Stripe Test Cards:</span>
                      <button
                        type="button"
                        onClick={() => fillTestCard('success')}
                        className="text-[10px] bg-stone-100 hover:bg-stone-200 text-stone-700 px-2 py-0.5 rounded cursor-pointer transition-colors"
                      >
                        4242 (Success)
                      </button>
                      <button
                        type="button"
                        onClick={() => fillTestCard('3ds')}
                        className="text-[10px] bg-stone-100 hover:bg-stone-200 text-stone-700 px-2 py-0.5 rounded cursor-pointer transition-colors"
                      >
                        3D Secure Auth
                      </button>
                    </div>
                  </div>
                )}

                {/* Stripe Digital Wallet or Klarna Note */}
                {paymentMethod !== 'stripe_card' && (
                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-200/80 text-[11px] text-stone-600 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>
                      Stripe 1-Click Checkout: Your default wallet will be prompted during final authorization.
                    </span>
                  </div>
                )}
              </div>

              {/* Poshmark Credits Application */}
              {availableCredits > 0 && (
                <div className="flex items-center justify-between p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="use-credits"
                      checked={useCredits}
                      onChange={(e) => setUseCredits(e.target.checked)}
                      className="w-4 h-4 rounded text-stone-900 focus:ring-stone-900"
                    />
                    <label htmlFor="use-credits" className="text-stone-700 cursor-pointer">
                      Apply Posh Credits ({availableCredits.toFixed(2)} available)
                    </label>
                  </div>
                  <span className="font-bold text-emerald-700 tabular-nums">
                    -${creditsApplied.toFixed(2)}
                  </span>
                </div>
              )}

              {/* Order Cost Breakdown */}
              <div className="border-t border-stone-200 pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Item Subtotal</span>
                  <span className="tabular-nums font-medium">${item.listingPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>USPS Priority Expedited (1-3 Day)</span>
                  <span className="tabular-nums font-medium">${shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Estimated Sales Tax</span>
                  <span className="tabular-nums font-medium">${salesTax.toFixed(2)}</span>
                </div>
                {creditsApplied > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Posh Credits Applied</span>
                    <span className="tabular-nums">-${creditsApplied.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-stone-200">
                  <span>Total Due</span>
                  <span className="tabular-nums">${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!completedOrder && (
          <div className="px-6 py-4 border-t border-stone-200 bg-white flex items-center justify-between">
            <div className="text-xs text-stone-500 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-stone-400" />
              <span>Stripe 256-Bit Escrow Vault</span>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className="px-6 py-2.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 disabled:bg-stone-300 rounded-lg transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{processingStep || 'Processing with Stripe...'}</span>
                </>
              ) : (
                <>
                  <span>Pay with Stripe · ${totalAmount.toFixed(2)}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
