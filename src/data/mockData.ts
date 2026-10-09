import { Item, Seller, Order, Offer, PoshParty, ShippingAddress } from '../types';

export const CURRENT_USER = {
  id: 'usr_me',
  handle: '@fashion_odette',
  name: 'Odette Wales',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  balance: 420.50,
  poshCredits: 15.00,
  address: {
    fullName: 'Odette Wales',
    street1: '742 Evergreen Terrace',
    street2: 'Apt 4B',
    city: 'Brooklyn',
    state: 'NY',
    zipCode: '11201',
    phone: '(555) 321-9840'
  } as ShippingAddress
};

export const INITIAL_SELLERS: Record<string, Seller> = {
  'seller_claire': {
    id: 'seller_claire',
    handle: '@claire_archives',
    name: 'Claire Vance',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    coverGradient: 'from-amber-700 via-stone-800 to-stone-900',
    bio: 'Archival minimalist pieces, luxury outerwear, and curated vintage denim from Paris, Tokyo, and NYC. 100% authentic guarantee.',
    cityState: 'SoHo, New York, NY',
    rating: 4.96,
    reviewCount: 384,
    salesCount: 642,
    avgShipDays: 1.1,
    ambassadorLevel: 'Posh Ambassador II',
    followersCount: 28400,
    followingCount: 1420,
    bundleDiscountPercent: 15
  },
  'seller_marcus': {
    id: 'seller_marcus',
    handle: '@marcus_closet',
    name: 'Marcus Sterling',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    coverGradient: 'from-stone-900 via-zinc-800 to-slate-900',
    bio: 'Streetwear collector & vintage enthusiast. Selling personal grail pieces: Arc\'teryx, Supreme, Made in USA denim, and rare sneakers.',
    cityState: 'Los Angeles, CA',
    rating: 4.92,
    reviewCount: 219,
    salesCount: 412,
    avgShipDays: 1.3,
    ambassadorLevel: 'Posh Ambassador II',
    followersCount: 19800,
    followingCount: 890,
    bundleDiscountPercent: 20
  },
  'seller_sophie': {
    id: 'seller_sophie',
    handle: '@sophie_luxury_vault',
    name: 'Sophie Laurent',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    coverGradient: 'from-rose-950 via-stone-900 to-black',
    bio: 'Certified luxury appraiser & collector. Chanel, Hermès, Bottega Veneta, and Saint Laurent. Authenticity card included with every purchase.',
    cityState: 'Beverly Hills, CA',
    rating: 5.0,
    reviewCount: 512,
    salesCount: 890,
    avgShipDays: 0.9,
    ambassadorLevel: 'Posh Ambassador II',
    followersCount: 42300,
    followingCount: 620,
    bundleDiscountPercent: 10
  }
};

export const INITIAL_ITEMS: Item[] = [
  {
    id: 'item_1',
    title: 'Vintage Double-Breasted Heritage Trench Coat',
    description: 'Iconic honey camel double-breasted trench in crisp weatherproof cotton gabardine. Features horn buttons, belted cuffs, shoulder epaulettes, and signature archival check lining. Purchased in London vintage boutique, worn twice with minimal care marks.',
    brand: 'Burberry Vintage',
    department: 'Luxury',
    category: 'Coats & Jackets',
    size: 'M (US 6-8)',
    condition: 'Like New',
    color: 'Honey Camel',
    originalPrice: 2190,
    listingPrice: 685,
    discountedShipping: true,
    photos: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=80'
    ],
    sellerId: 'seller_claire',
    sellerName: 'Claire Vance',
    sellerHandle: '@claire_archives',
    sellerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    sellerRating: 4.96,
    sellerSalesCount: 642,
    sellerBadges: ['Posh Ambassador II', 'Top Shipper', 'Verified Authenticity'],
    sellerAvgShipDays: 1.1,
    likes: 84,
    shares: 142,
    inStock: true,
    fabric: '100% Cotton Gabardine / Archival Check Lining',
    measurements: {
      chestOrBust: '39 in',
      length: '43 in'
    },
    createdAt: '2 hours ago'
  },
  {
    id: 'item_2',
    title: 'Distressed Vintage Leather Moto Biker Jacket',
    description: 'Heavyweight brown steerhide leather biker jacket with authentic natural distressing, heavy antiqued brass hardware, zippered sleeves, and waist cinch belt. Perfect boxy 90s silhouette with broken-in drape.',
    brand: 'Acne Studios',
    department: 'Women',
    category: 'Leather Jackets',
    size: 'S / 36',
    condition: 'Gently Used',
    color: 'Distressed Tobacco Brown',
    originalPrice: 1750,
    listingPrice: 520,
    photos: [
      'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=80'
    ],
    sellerId: 'seller_claire',
    sellerName: 'Claire Vance',
    sellerHandle: '@claire_archives',
    sellerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    sellerRating: 4.96,
    sellerSalesCount: 642,
    sellerBadges: ['Posh Ambassador II', 'Top Shipper'],
    sellerAvgShipDays: 1.1,
    likes: 129,
    shares: 310,
    inStock: true,
    fabric: '100% Lambskin & Steerhide Leather / Cupro Lining',
    measurements: {
      chestOrBust: '38 in',
      length: '22 in'
    },
    createdAt: '5 hours ago'
  },
  {
    id: 'item_3',
    title: 'Classic Quilted Flap Bag with 24K Gold Hardware',
    description: 'Ultra-rare vintage caviar leather shoulder bag with 24K gold plated interlocking turnlock and chain strap. Pristine corners, immaculate burgundy leather interior, hologram serial sticker intact. Verified authentic with Entrupy certificate.',
    brand: 'Chanel',
    department: 'Bags',
    category: 'Shoulder Bags',
    size: 'Medium (10 x 6.3 x 3 in)',
    condition: 'Like New',
    color: 'Noir Caviar Black',
    originalPrice: 10200,
    listingPrice: 4850,
    discountedShipping: true,
    photos: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80'
    ],
    sellerId: 'seller_sophie',
    sellerName: 'Sophie Laurent',
    sellerHandle: '@sophie_luxury_vault',
    sellerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    sellerRating: 5.0,
    sellerSalesCount: 890,
    sellerBadges: ['Posh Ambassador II', 'Luxury Authenticator'],
    sellerAvgShipDays: 0.9,
    likes: 342,
    shares: 890,
    inStock: true,
    fabric: 'Grained Caviar Calfskin / 24K Gold Hardware',
    measurements: {
      length: '10 in',
      chestOrBust: '6.3 in'
    },
    createdAt: '1 day ago'
  },
  {
    id: 'item_4',
    title: 'Vintage 501 Original Fit Jeans (Made in USA 1994)',
    description: 'True vintage 1990s deadstock wash Levi\'s 501 with red tab, button fly, and classic straight leg. Authentic high rise waist with beautifully feathered whiskers and natural fading. Stiff durable 100% non-stretch selvedge-weight cotton denim.',
    brand: 'Levi\'s Vintage',
    department: 'Vintage',
    category: 'Denim & Jeans',
    size: '28 x 32',
    condition: 'Gently Used',
    color: 'Medium Stonewash Indigo',
    originalPrice: 198,
    listingPrice: 94,
    discountedShipping: false,
    photos: [
      'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?auto=format&fit=crop&w=900&q=80'
    ],
    sellerId: 'seller_marcus',
    sellerName: 'Marcus Sterling',
    sellerHandle: '@marcus_closet',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    sellerRating: 4.92,
    sellerSalesCount: 412,
    sellerBadges: ['Posh Ambassador II', 'Vintage Specialist'],
    sellerAvgShipDays: 1.3,
    likes: 67,
    shares: 114,
    inStock: true,
    fabric: '100% Rigid Heavyweight Cotton Denim',
    measurements: {
      waist: '28 in',
      inseam: '32 in'
    },
    createdAt: '6 hours ago'
  },
  {
    id: 'item_5',
    title: 'Beta LT Waterproof Gore-Tex Shell Jacket',
    description: 'Minimalist all-mountain weather protection. Durable 3L GORE-TEX fabric with bluesign-approved backing. Helmet-compatible StormHood, pit zips for ventilation, WaterTight front zips. Worn on one alpine hike, no delamination or flaws.',
    brand: 'Arc\'teryx',
    department: 'Men',
    category: 'Outerwear',
    size: 'L',
    condition: 'Like New',
    color: 'Lucent Tatsu Olive',
    originalPrice: 450,
    listingPrice: 310,
    discountedShipping: true,
    photos: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=900&q=80'
    ],
    sellerId: 'seller_marcus',
    sellerName: 'Marcus Sterling',
    sellerHandle: '@marcus_closet',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    sellerRating: 4.92,
    sellerSalesCount: 412,
    sellerBadges: ['Posh Ambassador II'],
    sellerAvgShipDays: 1.3,
    likes: 195,
    shares: 420,
    inStock: true,
    fabric: 'N40d 3L GORE-TEX fabric with tricot backer technology',
    measurements: {
      chestOrBust: '44 in',
      length: '30 in'
    },
    createdAt: '3 hours ago'
  },
  {
    id: 'item_6',
    title: 'Made in USA 990v3 Suede Running Sneakers',
    description: 'Iconic dad-shoe legend crafted in Boston, USA. Pigskin suede upper with breathable mesh inlays, ENCAP midsole cushioning with lightweight foam and durable polyurethane rim. Comes with original silver box and spare cream laces.',
    brand: 'New Balance',
    department: 'Shoes',
    category: 'Sneakers',
    size: 'Men 10.5 / Women 12',
    condition: 'NWT (New with Tags)',
    color: 'Castlerock Grey / Navy',
    originalPrice: 210,
    listingPrice: 165,
    discountedShipping: false,
    photos: [
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=900&q=80'
    ],
    sellerId: 'seller_marcus',
    sellerName: 'Marcus Sterling',
    sellerHandle: '@marcus_closet',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    sellerRating: 4.92,
    sellerSalesCount: 412,
    sellerBadges: ['Posh Ambassador II', 'Sneaker Con Authenticated'],
    sellerAvgShipDays: 1.3,
    likes: 88,
    shares: 162,
    inStock: true,
    fabric: 'Pigskin Suede, Engineered Mesh, Rubber Outsole',
    measurements: {
      length: '11.5 in outsole'
    },
    createdAt: '1 day ago'
  },
  {
    id: 'item_7',
    title: 'Sleeveless Floral Silk Midi Bias Cut Dress',
    description: 'Flattering 90s slip silhouette crafted from 100% lightweight mulberry silk crepe with adjustable delicate spaghetti straps, scoop neckline, and cascading hemline. Worn once to summer wedding.',
    brand: 'Reformation',
    department: 'Women',
    category: 'Dresses',
    size: 'XS (US 0-2)',
    condition: 'Like New',
    color: 'Ivory / Wildflower Bloom',
    originalPrice: 298,
    listingPrice: 145,
    discountedShipping: true,
    photos: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=900&q=80'
    ],
    sellerId: 'seller_claire',
    sellerName: 'Claire Vance',
    sellerHandle: '@claire_archives',
    sellerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    sellerRating: 4.96,
    sellerSalesCount: 642,
    sellerBadges: ['Posh Ambassador II'],
    sellerAvgShipDays: 1.1,
    likes: 215,
    shares: 510,
    inStock: true,
    fabric: '100% Silk Crepe de Chine',
    measurements: {
      chestOrBust: '32 in',
      waist: '25 in',
      length: '47 in'
    },
    createdAt: '4 hours ago'
  },
  {
    id: 'item_8',
    title: 'Wool & Cashmere Blend Scarf Jacket with Contrast Stitching',
    description: 'Sculptural boxy jacket with integrated fringed scarf drape. Heavyweight double-faced wool-cashmere blend with contrast cream blanket stitching throughout and patch front pockets. Sold out everywhere.',
    brand: 'Toteme',
    department: 'Luxury',
    category: 'Coats & Jackets',
    size: '36 (US 4-6)',
    condition: 'NWT (New with Tags)',
    color: 'Charcoal Mélange',
    originalPrice: 1100,
    listingPrice: 790,
    discountedShipping: true,
    photos: [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80'
    ],
    sellerId: 'seller_claire',
    sellerName: 'Claire Vance',
    sellerHandle: '@claire_archives',
    sellerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    sellerRating: 4.96,
    sellerSalesCount: 642,
    sellerBadges: ['Posh Ambassador II'],
    sellerAvgShipDays: 1.1,
    likes: 412,
    shares: 980,
    inStock: true,
    fabric: '88% Wool, 12% Cashmere Double-Faced Fabric',
    measurements: {
      chestOrBust: '42 in (Relaxed fit)',
      length: '28 in'
    },
    createdAt: '8 hours ago'
  },
  {
    id: 'item_9',
    title: 'Re-Edition 2000 Nylon Mini Shoulder Bag',
    description: 'Revival of the iconic archival 2000 mini hobo in durable black tessutto nylon. Features enamel triangle logo plaque, fabric ribbon handle, silver zipper closure, and removable saffiano leather keychain nametag. Comes with authenticity card and dust bag.',
    brand: 'Prada',
    department: 'Bags',
    category: 'Mini Bags',
    size: 'Mini (8.6 x 6.7 in)',
    condition: 'Like New',
    color: 'Nero Black',
    originalPrice: 1250,
    listingPrice: 740,
    discountedShipping: true,
    photos: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80'
    ],
    sellerId: 'seller_sophie',
    sellerName: 'Sophie Laurent',
    sellerHandle: '@sophie_luxury_vault',
    sellerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    sellerRating: 5.0,
    sellerSalesCount: 890,
    sellerBadges: ['Posh Ambassador II', 'Luxury Authenticator'],
    sellerAvgShipDays: 0.9,
    likes: 278,
    shares: 610,
    inStock: true,
    fabric: 'Regenerated Nylon & Saffiano Leather Details',
    measurements: {
      length: '8.6 in'
    },
    createdAt: '1 day ago'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord_sale_101',
    orderNumber: 'POSH-849201',
    itemId: 'item_sell_sample',
    itemTitle: 'Acne Studios Oversized Mohair Wool Knit Sweater',
    itemPhoto: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80',
    itemBrand: 'Acne Studios',
    itemSize: 'M',
    itemPrice: 280.00,
    shippingCost: 7.97,
    salesTax: 24.85,
    totalAmount: 312.82,
    poshCreditsUsed: 0,
    netPayoutToSeller: 224.00, // 80% of $280
    buyerId: 'usr_emma_buyer',
    buyerName: 'Emma Richardson',
    buyerHandle: '@emmastyle_sf',
    buyerAddress: {
      fullName: 'Emma Richardson',
      street1: '1420 Montgomery Street',
      street2: 'Apt 3',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94133-2810',
      phone: '(415) 555-0199'
    },
    sellerId: CURRENT_USER.id,
    sellerName: CURRENT_USER.name,
    sellerHandle: CURRENT_USER.handle,
    sellerAddress: CURRENT_USER.address,
    status: 'Payment Authorized', // READY TO SHIP - Generates shipping label!
    trackingNumber: '9405 5082 0549 7120 4819 32',
    carrier: 'USPS Priority Mail',
    packageWeight: '1 LB 6 OZ',
    serviceTier: 'USPS Priority Mail® 2-Day (Prepaid Label)',
    paymentMethod: 'Apple Pay (Verified Escrow)',
    paymentEscrowProtected: true,
    createdAt: 'Today, 10:14 AM'
  },
  {
    id: 'ord_buy_202',
    orderNumber: 'POSH-718290',
    itemId: 'item_1',
    itemTitle: 'Vintage Double-Breasted Heritage Trench Coat',
    itemPhoto: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80',
    itemBrand: 'Burberry Vintage',
    itemSize: 'M (US 6-8)',
    itemPrice: 685.00,
    shippingCost: 4.99, // discounted
    salesTax: 59.85,
    totalAmount: 734.84,
    poshCreditsUsed: 15.00,
    netPayoutToSeller: 548.00,
    buyerId: CURRENT_USER.id,
    buyerName: CURRENT_USER.name,
    buyerHandle: CURRENT_USER.handle,
    buyerAddress: CURRENT_USER.address,
    sellerId: 'seller_claire',
    sellerName: 'Claire Vance',
    sellerHandle: '@claire_archives',
    sellerAddress: {
      fullName: 'Claire Vance',
      street1: '482 Broome Street',
      street2: 'Fl 4',
      city: 'New York',
      state: 'NY',
      zipCode: '10013-1102',
      phone: '(212) 555-0812'
    },
    status: 'Shipped / In Transit',
    trackingNumber: '9405 5118 9956 2201 9845 11',
    carrier: 'USPS Priority Mail',
    packageWeight: '2 LBS 4 OZ',
    serviceTier: 'USPS Priority Mail® 1-Day (Prepaid Label)',
    paymentMethod: 'Visa •••• 4242 (Held in Escrow)',
    paymentEscrowProtected: true,
    createdAt: 'Yesterday, 3:20 PM',
    shippedAt: 'Yesterday, 5:45 PM'
  }
];

export const INITIAL_OFFERS: Offer[] = [
  {
    id: 'off_1',
    itemId: 'item_sell_sample',
    itemTitle: 'Acne Studios Oversized Mohair Wool Knit Sweater',
    itemPhoto: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80',
    itemBrand: 'Acne Studios',
    itemSize: 'M',
    originalListingPrice: 320,
    offeredPrice: 280,
    buyerId: 'usr_emma_buyer',
    buyerHandle: '@emmastyle_sf',
    buyerName: 'Emma Richardson',
    sellerId: CURRENT_USER.id,
    sellerHandle: CURRENT_USER.handle,
    status: 'accepted',
    createdAt: 'Today, 9:30 AM',
    expiresAt: 'In 23 hours'
  },
  {
    id: 'off_2',
    itemId: 'item_2',
    itemTitle: 'Distressed Vintage Leather Moto Biker Jacket',
    itemPhoto: 'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?auto=format&fit=crop&w=900&q=80',
    itemBrand: 'Acne Studios',
    itemSize: 'S / 36',
    originalListingPrice: 520,
    offeredPrice: 460,
    buyerId: CURRENT_USER.id,
    buyerHandle: CURRENT_USER.handle,
    buyerName: CURRENT_USER.name,
    sellerId: 'seller_claire',
    sellerHandle: '@claire_archives',
    status: 'pending',
    shippingDiscountOffered: true,
    createdAt: '3 hours ago',
    expiresAt: 'In 21 hours'
  }
];

export const POSH_PARTIES: PoshParty[] = [
  {
    id: 'party_1',
    title: 'Luxury Handbags & Designer Vault Party',
    theme: 'Chanel, Prada, Gucci, Celine & Bottega',
    host: 'Hosted by @sophie_luxury_vault & Poshmark Editors',
    timeRemaining: 'Happening Now · Ends in 1 hr 45 min',
    sharedCount: 14820,
    badge: 'LIVE NOW'
  },
  {
    id: 'party_2',
    title: 'Best in Streetwear, Denim & Outerwear',
    theme: 'Arc\'teryx, Levi\'s 501, Vintage & Gorpcore',
    host: 'Hosted by @marcus_closet & Poshmark Community',
    timeRemaining: 'Starts Today at 4:00 PM EST',
    sharedCount: 8930,
    badge: 'UPCOMING'
  },
  {
    id: 'party_3',
    title: 'Fall Cashmere, Trench Coats & Chunky Knits',
    theme: 'Toteme, Burberry, Reformation, Sézane',
    host: 'Hosted by @claire_archives',
    timeRemaining: 'Starts Tomorrow at 12:00 PM EST',
    sharedCount: 6240,
    badge: 'UPCOMING'
  }
];
