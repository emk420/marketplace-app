export type Department = 'All' | 'Women' | 'Men' | 'Kids' | 'Luxury' | 'Bags' | 'Shoes' | 'Vintage';

export type Condition = 'NWT (New with Tags)' | 'Like New' | 'Gently Used' | 'Good Condition';

export interface ShippingAddress {
  fullName: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
}

export interface Item {
  id: string;
  title: string;
  description: string;
  brand: string;
  department: Department;
  category: string;
  size: string;
  condition: Condition;
  color: string;
  originalPrice: number;
  listingPrice: number;
  discountedShipping?: boolean; // e.g. seller offers $4.99 instead of $7.97
  photos: string[];
  sellerId: string;
  sellerName: string;
  sellerHandle: string;
  sellerAvatar: string;
  sellerRating: number;
  sellerSalesCount: number;
  sellerBadges: string[];
  sellerAvgShipDays: number;
  likes: number;
  shares: number;
  inStock: boolean;
  fabric: string;
  measurements: {
    chestOrBust?: string;
    length?: string;
    waist?: string;
    inseam?: string;
  };
  createdAt: string;
}

export interface Seller {
  id: string;
  handle: string;
  name: string;
  avatar: string;
  coverGradient: string;
  bio: string;
  cityState: string;
  rating: number;
  reviewCount: number;
  salesCount: number;
  avgShipDays: number;
  ambassadorLevel: 'Posh Ambassador II' | 'Posh Ambassador I' | 'Top Seller';
  followersCount: number;
  followingCount: number;
  bundleDiscountPercent: number; // e.g. 15% off 2+ items
}

export type OrderStatus =
  | 'Payment Authorized'
  | 'Label Generated'
  | 'Shipped / In Transit'
  | 'Delivered'
  | 'Accepted & Funds Released';

export interface Order {
  id: string;
  orderNumber: string;
  itemId: string;
  itemTitle: string;
  itemPhoto: string;
  itemBrand: string;
  itemSize: string;
  itemPrice: number;
  shippingCost: number;
  salesTax: number;
  totalAmount: number;
  poshCreditsUsed: number;
  netPayoutToSeller: number;
  buyerId: string;
  buyerName: string;
  buyerHandle: string;
  buyerAddress: ShippingAddress;
  sellerId: string;
  sellerName: string;
  sellerHandle: string;
  sellerAddress: ShippingAddress;
  status: OrderStatus;
  trackingNumber: string;
  carrier: string;
  packageWeight: string;
  serviceTier: string;
  labelGeneratedAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  paymentMethod: string;
  paymentEscrowProtected: boolean;
  stripePaymentIntentId?: string;
  stripeClientSecret?: string;
  createdAt: string;
  buyerRating?: number;
  buyerLoveNote?: string;
}

export interface Offer {
  id: string;
  itemId: string;
  itemTitle: string;
  itemPhoto: string;
  itemBrand: string;
  itemSize: string;
  originalListingPrice: number;
  offeredPrice: number;
  buyerId: string;
  buyerHandle: string;
  buyerName: string;
  sellerId: string;
  sellerHandle: string;
  status: 'pending' | 'accepted' | 'declined' | 'countered';
  counterPrice?: number;
  shippingDiscountOffered?: boolean;
  createdAt: string;
  expiresAt: string;
}

export interface PoshParty {
  id: string;
  title: string;
  theme: string;
  host: string;
  timeRemaining: string;
  sharedCount: number;
  badge: string;
}
