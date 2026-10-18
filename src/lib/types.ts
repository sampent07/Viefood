export interface Ingredient {
  id?: string;
  name: string;
  amount: number;
  unit: string;
  caloriesKcal?: number | null;
  weightState?: string | null;
}

export interface Product {
  id: string;
  sku: string;
  slug: string;
  name: string;
  categorySlug: string;
  description: string;
  priceVnd: number | null;
  estimatedWeightG?: number | null;
  servingVolumeMl?: number | null;
  caloriesKcal?: number | null;
  nutritionVerified: boolean;
  imageUrl: string;
  badges?: string | null;
  isAvailable: boolean;
  sortOrder: number;
  ingredients?: Ingredient[];
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface CartItem {
  productId: string;
  sku: string;
  slug: string;
  name: string;
  priceVnd: number;
  quantity: number;
  imageUrl: string;
  categorySlug: string;
  estimatedWeightG?: number | null;
  caloriesKcal?: number | null;
  itemNote?: string;
}

export interface Branch {
  id: string;
  code: string;
  name: string;
  address: string;
  phone: string;
  openHours: string;
  deliveryRadiusKm: number;
  baseShippingFee: number;
  isActive: boolean;
}

export interface Voucher {
  id: string;
  code: string;
  title: string;
  discountType: 'PERCENT' | 'FIXED' | 'FREE_SHIP' | string;
  discountValue: number;
  minOrderValue: number;
  maxDiscountValue?: number | null;
  isActive: boolean;
  branchId?: string | null;
}

export interface Package {
  id: string;
  code: string;
  slug: string;
  name: string;
  type: string;
  description: string;
  priceVnd: number;
  originalPriceVnd?: number | null;
  daysCount: number;
  mealsPerDay: number;
  totalBoxes: number;
  avgKcalPerDay?: number | null;
  imageUrl: string;
  isActive: boolean;
  items?: Array<{
    id: string;
    dayIndex: number;
    mealType: string;
    quantity: number;
    product: Product;
  }>;
}

export interface Order {
  id: string;
  orderCode: string;
  receiverName: string;
  receiverPhone: string;
  branchId: string;
  branch?: Branch;
  deliveryAddress: string;
  deliveryDate?: string | null;
  deliverySlot?: string | null;
  orderNote?: string | null;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  cancelReason?: string | null;
  createdAt: string | Date;
  items: Array<{
    id: string;
    productName: string;
    productSku: string;
    priceAtPurchase: number;
    quantity: number;
    itemNote?: string | null;
    weightSnapshot?: number | null;
    caloriesSnapshot?: number | null;
    imageUrl?: string | null;
  }>;
}

export interface ConsultationRequest {
  id: string;
  requestCode: string;
  fullName: string;
  phone: string;
  zalo?: string | null;
  packageInterest: string;
  branchId?: string | null;
  branch?: Branch | null;
  deliveryArea?: string | null;
  budget?: string | null;
  dietaryGoals?: string | null;
  preferredContactTime?: string | null;
  notes?: string | null;
  consentAgreed: boolean;
  status: string;
  staffNote?: string | null;
  createdAt: string | Date;
}

