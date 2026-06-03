/**
 * Client-side Inventory Service
 * Provides client-side functions to interact with admin inventory endpoints
 */

// Brands
export async function fetchBrands() {
  const res = await fetch('/api/admin/brands');
  if (!res.ok) {
    throw new Error('Failed to fetch brands');
  }
  const data = await res.json();
  return data.brands || [];
}

export async function createBrand(name: string, imageUrl?: string) {
  const res = await fetch('/api/admin/brands', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, imageUrl }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to create brand');
  }
  return await res.json();
}

export async function updateBrand(id: string, name: string, imageUrl?: string) {
  const res = await fetch(`/api/admin/brands?id=${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, imageUrl }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to update brand');
  }
  return await res.json();
}

export async function deleteBrand(id: string) {
  const res = await fetch(`/api/admin/brands?id=${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to delete brand');
  }
  return await res.json();
}

// Vehicles
export async function createVehicle(data: {
  make: string;
  model: string;
  year: number;
  trim?: string;
  price: number;
  slug?: string;
  designPhilosophy: string;
  images: string[];
  brandId: number;
  
  modelCode?: string;
  category?: string;
  shortDescription?: string;
  topSpeed?: string;
  certifiedRange?: string;
  realWorldRange?: string;
  ridingModes?: string[];
  climbingDegree?: string;
  loadCapacity?: string;
  batteryType?: string;
  batteryCapacity?: string;
  chargingTime?: string;
  fastCharging?: boolean;
  chargerIncluded?: string;
  batteryWarranty?: string;
  motorPower?: string;
  brakingSystem?: string;
  tyreType?: string;
  wheelType?: string;
  wheelSize?: string;
  groundClearance?: string;
  displayType?: string;
  colors?: string[];
  keyFeatures?: string[];
  bootSpace?: string;
  parentId?: number | null;
}) {
  const res = await fetch('/api/admin/inventory', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...data,
      imageUrls: data.images || [],
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to create vehicle');
  }

  return await res.json();
}

// File Upload
export async function uploadVehicleImages(files: File[]) {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });

  const res = await fetch('/api/admin/storage/upload?folder=vehicles', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to upload images');
  }

  const data = await res.json();
  if (data.files && Array.isArray(data.files)) {
    return data.files.map((f: any) => f.url);
  }
  return data.urls || [];
}

export async function uploadBrandImage(file: File) {
  const formData = new FormData();
  formData.append('files', file);

  const res = await fetch('/api/admin/storage/upload?folder=brands', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to upload brand image');
  }

  const data = await res.json();
  if (data.files && Array.isArray(data.files) && data.files.length > 0) {
    return data.files[0].url;
  }
  return null;
}

// Update Vehicle
export async function updateVehicleAPI(
  id: string,
  data: {
    brandId?: number;
    make?: string;
    model?: string;
    year?: number;
    trim?: string;
    price?: number;
    slug?: string;
    designPhilosophy?: string;
    imageUrls?: string[];
    
    modelCode?: string;
    category?: string;
    shortDescription?: string;
    topSpeed?: string;
    certifiedRange?: string;
    realWorldRange?: string;
    ridingModes?: string[];
    climbingDegree?: string;
    loadCapacity?: string;
    batteryType?: string;
    batteryCapacity?: string;
    chargingTime?: string;
    fastCharging?: boolean;
    chargerIncluded?: string;
    batteryWarranty?: string;
    motorPower?: string;
    brakingSystem?: string;
    tyreType?: string;
    wheelType?: string;
    wheelSize?: string;
    groundClearance?: string;
    displayType?: string;
    colors?: string[];
    keyFeatures?: string[];
    bootSpace?: string;
    parentId?: number | null;
  }
) {
  const res = await fetch('/api/admin/inventory', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...data }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to update vehicle');
  }

  return await res.json();
}

// Delete Vehicle
export async function deleteVehicleAPI(id: string) {
  const res = await fetch('/api/admin/inventory', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to delete vehicle');
  }

  return await res.json();
}

// Bulk Update Vehicles
export async function bulkUpdateVehicles(
  vehicleIds: string[],
  updates: {
    [key: string]: any;
  }
) {
  const res = await fetch('/api/admin/inventory/bulk-update', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ vehicleIds, updates }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to bulk update vehicles');
  }

  return await res.json();
}

// Likes
export async function fetchLikeStatus(slug: string) {
  const res = await fetch(`/api/vehicles/${slug}/like`);
  if (!res.ok) {
    throw new Error('Failed to fetch like status');
  }
  return await res.json();
}

export async function toggleLikeAPI(slug: string) {
  const res = await fetch(`/api/vehicles/${slug}/like`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to toggle like');
  }
  return await res.json();
}

// Get vehicle placeholder images
export function generatePlaceholderImages(make: string, model: string): string[] {
  return [
    `https://picsum.photos/seed/${make}-${model}-1/800/600`,
    `https://picsum.photos/seed/${make}-${model}-2/800/600`,
    `https://picsum.photos/seed/${make}-${model}-3/800/600`,
  ];
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export async function submitOrderAPI(
  slug: string,
  data: {
    variantId?: number | null;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    preferredShowroom?: string;
    preferredDate?: string;
    orderType?: 'test_drive' | 'purchase';
    couponCode?: string;
  }
) {
  const res = await fetch(`/api/vehicles/${slug}/order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ vehicleSlug: slug, ...data }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to submit order');
  }
  return await res.json();
}

// ─── Coupons ──────────────────────────────────────────────────────────────────

export async function validateCouponAPI(code: string, orderValue: number) {
  const res = await fetch('/api/coupons/validate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, orderValue }),
  });
  return await res.json(); // returns { valid, discountAmount, finalPrice, error? }
}

export async function fetchAdminCoupons() {
  const res = await fetch('/api/admin/coupons');
  if (!res.ok) throw new Error('Failed to fetch coupons');
  const data = await res.json();
  return data.coupons || [];
}

export async function createCouponAPI(data: object) {
  const res = await fetch('/api/admin/coupons', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to create coupon');
  }
  return await res.json();
}

export async function updateCouponAPI(data: object) {
  const res = await fetch('/api/admin/coupons', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to update coupon');
  }
  return await res.json();
}

export async function deleteCouponAPI(id: number) {
  const res = await fetch(`/api/admin/coupons?id=${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to delete coupon');
  }
  return await res.json();
}

// ─── Variants ─────────────────────────────────────────────────────────────────

export async function fetchVariants(vehicleId: number) {
  const res = await fetch(`/api/admin/variants?vehicleId=${vehicleId}`);
  if (!res.ok) throw new Error('Failed to fetch variants');
  const data = await res.json();
  return data.variants || [];
}

export async function fetchPublicVariants(slug: string) {
  const res = await fetch(`/api/vehicles/${slug}/variants`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.variants || [];
}

export async function fetchGlobalVariantsAPI() {
  const res = await fetch('/api/admin/variants/global');
  if (!res.ok) return [];
  const data = await res.json();
  return data.globalVariants || [];
}

export async function createGlobalVariantAPI(data: object) {
  const res = await fetch('/api/admin/variants/global', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to create global variant preset');
  }
  return await res.json();
}

export async function updateGlobalVariantAPI(data: object) {
  const res = await fetch('/api/admin/variants/global', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to update global variant preset');
  }
  return await res.json();
}

export async function deleteGlobalVariantAPI(id: number) {
  const res = await fetch(`/api/admin/variants/global?id=${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to delete global variant preset');
  }
  return await res.json();
}

export async function createVariantAPI(data: object) {
  const res = await fetch('/api/admin/variants', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to create variant');
  }
  return await res.json();
}

export async function updateVariantAPI(data: object) {
  const res = await fetch('/api/admin/variants', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to update variant');
  }
  return await res.json();
}

export async function deleteVariantAPI(id: number) {
  const res = await fetch(`/api/admin/variants?id=${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to delete variant');
  }
  return await res.json();
}

export async function bulkAssignVariantsAPI(vehicleId: number, globalVariantIds: number[]) {
  const res = await fetch('/api/admin/variants/bulk-assign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ vehicleId, globalVariantIds }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to bulk assign variants');
  }
  return await res.json();
}

// ─── Admin Orders ─────────────────────────────────────────────────────────────

export async function fetchAdminOrders(status?: string) {
  const url = status ? `/api/admin/orders?status=${status}` : '/api/admin/orders';
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch orders');
  const data = await res.json();
  return data.orders || [];
}

export async function updateOrderStatusAPI(id: number, status: string, adminNotes?: string) {
  const res = await fetch('/api/admin/orders', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, status, adminNotes }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to update order');
  }
  return await res.json();
}

export async function fetchAdminVehicles() {
  const res = await fetch('/api/admin/inventory');
  if (!res.ok) throw new Error('Failed to fetch inventory vehicles');
  const data = await res.json();
  return data.vehicles || [];
}
