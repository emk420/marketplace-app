import React, { useState } from 'react';
import { Printer, Download, X, CheckCircle2, ShieldCheck, Truck, Package, Info, ArrowRight } from 'lucide-react';
import { Order } from '../types';

interface ShippingLabelModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onMarkShipped: (orderId: string) => void;
}

export const ShippingLabelModal: React.FC<ShippingLabelModalProps> = ({
  order,
  isOpen,
  onClose,
  onMarkShipped
}) => {
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyTracking = () => {
    navigator.clipboard.writeText(order.trackingNumber.replace(/\s+/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    setDownloadSuccess(true);
    // Simulate instantaneous download preparation
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  // Generate barcode bars pattern programmatically for crisp SVG barcode
  const barcodePattern = [
    2, 1, 3, 1, 1, 2, 3, 2, 1, 2, 1, 3, 2, 1, 1, 4, 1, 2, 2, 1, 3, 1, 2, 3, 1, 1, 2, 4, 1, 2,
    1, 3, 2, 1, 1, 2, 3, 2, 1, 4, 2, 1, 2, 3, 1, 1, 2, 1, 3, 2, 1, 2, 4, 1, 1, 3, 2, 1, 2, 1,
    3, 1, 2, 2, 1, 4, 1, 2, 1, 3, 2, 1, 1, 3, 2, 2, 1, 1, 4, 2, 1, 3, 1, 2, 2, 1, 3, 1, 2, 1
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="no-print flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-stone-900">Prepaid USPS Shipping Label</h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Ready to Print
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Order #{order.orderNumber} · {order.itemTitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Scrollable Area */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1 bg-stone-100">
          {/* Quick Notice Bar */}
          <div className="no-print bg-white rounded-lg p-4 border border-stone-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-stone-600">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-stone-900">USPS Priority Mail 1–3 Day Service</span>
                <span className="block text-stone-500">
                  Pre-paid up to 5 lbs. Includes free box usage, USPS tracking, and $100 PoshProtect™ seller insurance.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleCopyTracking}
                className="px-2.5 py-1.5 border border-stone-300 rounded hover:bg-stone-50 text-stone-700 font-mono text-[11px] transition-colors"
              >
                {copied ? 'Copied!' : 'Copy Tracking #'}
              </button>
            </div>
          </div>

          {/* THE OFFICIAL 4x6 SHIPPING LABEL (PRINTABLE TARGET) */}
          <div className="flex justify-center">
            <div
              id="printable-shipping-label"
              className="bg-white border-2 border-black w-full max-w-[440px] p-4 text-black font-sans shadow-md select-text"
              style={{ minHeight: '640px' }}
            >
              {/* Top Row: USPS Priority Header & Postage block */}
              <div className="flex items-stretch justify-between border-b-4 border-black pb-3">
                <div className="flex-1 pr-3">
                  <div className="text-[11px] font-bold tracking-widest uppercase text-stone-600">
                    UNITED STATES POSTAL SERVICE ®
                  </div>
                  <div className="text-2xl font-black tracking-tight leading-none mt-1">
                    PRIORITY MAIL 2-DAY ®
                  </div>
                  <div className="text-[10px] font-bold mt-1 text-stone-700">
                    POSHMARK COMMERCIAL BASE PRICING
                  </div>
                </div>

                {/* Postage Paid Block with big "P" */}
                <div className="w-24 border-2 border-black p-1 text-center flex flex-col justify-between shrink-0">
                  <div className="text-[8px] font-bold leading-tight uppercase">
                    US POSTAGE PAID
                  </div>
                  <div className="text-3xl font-black leading-none my-0.5">P</div>
                  <div className="text-[7px] font-semibold leading-tight">
                    POSHMARK INC.<br />e-Postage<br />Permit No. G-10
                  </div>
                </div>
              </div>

              {/* Shipper & Weight Row */}
              <div className="grid grid-cols-12 border-b-2 border-black py-2 text-xs">
                {/* Return Address (Seller) */}
                <div className="col-span-8 pr-2">
                  <div className="text-[9px] font-bold text-stone-500 uppercase tracking-wider mb-0.5">
                    SHIP FROM:
                  </div>
                  <div className="font-bold text-xs uppercase leading-tight">{order.sellerName}</div>
                  <div className="text-[11px] uppercase leading-tight">{order.sellerAddress.street1}</div>
                  {order.sellerAddress.street2 && (
                    <div className="text-[11px] uppercase leading-tight">{order.sellerAddress.street2}</div>
                  )}
                  <div className="text-[11px] uppercase font-semibold leading-tight">
                    {order.sellerAddress.city}, {order.sellerAddress.state} {order.sellerAddress.zipCode}
                  </div>
                </div>

                {/* Package Specs */}
                <div className="col-span-4 border-l-2 border-black pl-2 flex flex-col justify-between text-right">
                  <div>
                    <div className="text-[9px] font-bold text-stone-500 uppercase">WEIGHT</div>
                    <div className="font-black text-sm">{order.packageWeight}</div>
                  </div>
                  <div>
                    <div className="text-[9px] font-bold text-stone-500 uppercase">ZONE</div>
                    <div className="font-bold text-xs">COMMERCIAL</div>
                  </div>
                </div>
              </div>

              {/* Ship To / Recipient Address */}
              <div className="py-4 border-b-4 border-black">
                <div className="text-[9px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                  SHIP TO:
                </div>
                <div className="pl-4 space-y-0.5">
                  <div className="text-base font-black uppercase tracking-tight">
                    {order.buyerName}
                  </div>
                  <div className="text-sm font-bold uppercase">
                    {order.buyerAddress.street1}
                  </div>
                  {order.buyerAddress.street2 && (
                    <div className="text-sm uppercase font-semibold">
                      {order.buyerAddress.street2}
                    </div>
                  )}
                  <div className="text-base font-black uppercase tracking-tight">
                    {order.buyerAddress.city} {order.buyerAddress.state} {order.buyerAddress.zipCode}
                  </div>
                </div>
              </div>

              {/* Zip Code Barcode Section */}
              <div className="py-3 border-b-2 border-black flex flex-col items-center">
                <div className="text-[9px] font-mono tracking-widest text-stone-700 mb-1">
                  ZIP ROUTING: {order.buyerAddress.zipCode.substring(0, 5)}
                </div>
                {/* SVG Routing Barcode */}
                <svg className="w-56 h-8" viewBox="0 0 100 24" preserveAspectRatio="none">
                  {barcodePattern.slice(0, 40).map((width, idx) => (
                    <rect
                      key={idx}
                      x={idx * 2.5}
                      y="0"
                      width={width * 0.8}
                      height="24"
                      fill="black"
                    />
                  ))}
                </svg>
              </div>

              {/* IMpb USPS TRACKING BARCODE SECTION */}
              <div className="py-4 border-b-2 border-black flex flex-col items-center">
                <div className="text-[10px] font-black uppercase tracking-widest mb-1.5">
                  USPS TRACKING #
                </div>

                {/* SVG Code 128 / IMpb Barcode */}
                <div className="w-full flex justify-center py-1">
                  <svg className="w-full h-16 max-w-[380px]" viewBox="0 0 160 50" preserveAspectRatio="none">
                    {barcodePattern.map((width, idx) => (
                      <rect
                        key={idx}
                        x={idx * 1.8}
                        y="0"
                        width={width * 0.75}
                        height="50"
                        fill="black"
                      />
                    ))}
                  </svg>
                </div>

                {/* Human Readable Tracking Number */}
                <div className="font-mono font-bold text-xs tracking-widest mt-1 text-center">
                  {order.trackingNumber}
                </div>
              </div>

              {/* Bottom Packing Note for Seller */}
              <div className="pt-2 text-[9px] text-stone-600 flex justify-between items-center">
                <span className="font-semibold">ORDER: {order.orderNumber}</span>
                <span className="truncate max-w-[200px]">{order.itemBrand} - {order.itemSize}</span>
                <span>POSHMARK SHIPPING</span>
              </div>
            </div>
          </div>

          {/* Shipping Drop-off & Packaging Guidelines */}
          <div className="no-print bg-white rounded-lg p-5 border border-stone-200 space-y-3 text-xs text-stone-700">
            <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
              <Truck className="w-4 h-4 text-stone-700" />
              Easy 3-Step Shipping Instructions
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200/80">
                <div className="font-bold text-stone-900 mb-1">1. Pack Securely</div>
                <p className="text-stone-500 leading-relaxed">
                  Use any clean box or grab a <strong>FREE Priority Mail box</strong> from your local post office.
                </p>
              </div>
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200/80">
                <div className="font-bold text-stone-900 mb-1">2. Attach Label</div>
                <p className="text-stone-500 leading-relaxed">
                  Print on standard paper and tape clearly over the barcode with clear tape (no wrinkles).
                </p>
              </div>
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200/80">
                <div className="font-bold text-stone-900 mb-1">3. Hand to Carrier</div>
                <p className="text-stone-500 leading-relaxed">
                  Leave in mailbox, drop at blue USPS box, or schedule a free pickup on USPS.com.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="no-print px-6 py-4 border-t border-stone-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-stone-500 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-stone-400" />
            <span>Label is already paid for. No additional postage needed at the counter.</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleDownload}
              className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              {downloadSuccess ? 'Downloaded Label!' : 'Download (PDF)'}
            </button>

            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold text-stone-900 bg-stone-200 hover:bg-stone-300 rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              Print Label
            </button>

            {order.status !== 'Shipped / In Transit' && (
              <button
                onClick={() => {
                  onMarkShipped(order.id);
                  onClose();
                }}
                className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                Mark as Shipped
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
